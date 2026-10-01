// Entry point: `node src/run.js products` or `node src/run.js orders`.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import config from "../config.js";
import { createEbay } from "./ebay.js";
import { createTopDawg } from "./topdawg.js";
import { loadState, saveState } from "./state.js";
import { createNotifier } from "./notify.js";
import { syncProducts, siteFeed } from "./sync-products.js";
import { syncOrders } from "./sync-orders.js";

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const STATE = root("state/state.json");
const SITE_FEED = root("../site/products.json");
const TEMPLATE = root("../ebay/description-template.html");

function env(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing secret ${name}. See automation/README.md.`);
  return v;
}

async function main(job) {
  if (!["products", "orders"].includes(job)) throw new Error("Usage: node src/run.js products|orders");
  // Safety: nothing is bought or listed until DRY_RUN is explicitly "false".
  const dryRun = process.env.DRY_RUN !== "false";
  const log = console;
  const state = loadState(STATE);
  const notify = createNotifier({ state });

  const ebay = createEbay({
    clientId: env("EBAY_CLIENT_ID"),
    clientSecret: env("EBAY_CLIENT_SECRET"),
    refreshToken: env("EBAY_REFRESH_TOKEN"),
    sandbox: process.env.EBAY_SANDBOX === "true",
    marketplaceId: config.marketplaceId,
    contentLanguage: config.contentLanguage,
  });
  const topdawg = createTopDawg({ apiKey: env("TOPDAWG_API_KEY"), config: config.topdawg });
  const ctx = { ebay, topdawg, state, config, dryRun, log, notify };
  if (dryRun) log.info("DRY RUN: nothing will be listed, bought or marked shipped.");

  try {
    if (job === "products") {
      const policies = {
        fulfillmentPolicyId: env("EBAY_FULFILLMENT_POLICY_ID"),
        paymentPolicyId: env("EBAY_PAYMENT_POLICY_ID"),
        returnPolicyId: env("EBAY_RETURN_POLICY_ID"),
      };
      const template = readFileSync(TEMPLATE, "utf8").replace(/<!--[\s\S]*?-->\s*/, "");
      await syncProducts({ ...ctx, policies, template });
      if (!dryRun) writeFileSync(SITE_FEED, JSON.stringify(siteFeed(state), null, 2) + "\n");
    } else {
      await syncOrders(ctx);
    }
  } finally {
    if (!dryRun) saveState(STATE, state);
    if (!dryRun) await notify.flush();
  }
}

main(process.argv[2]).catch((err) => {
  console.error(err);
  process.exit(1);
});
