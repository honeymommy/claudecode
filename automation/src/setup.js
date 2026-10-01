// One-time: creates the US-only eBay business policies and prints their IDs.
// Needs EBAY_CLIENT_ID, EBAY_CLIENT_SECRET, EBAY_REFRESH_TOKEN.
import config from "../config.js";
import { createEbay } from "./ebay.js";
import { HttpError } from "./http.js";

const ebay = createEbay({
  clientId: process.env.EBAY_CLIENT_ID,
  clientSecret: process.env.EBAY_CLIENT_SECRET,
  refreshToken: process.env.EBAY_REFRESH_TOKEN,
  sandbox: process.env.EBAY_SANDBOX === "true",
  marketplaceId: config.marketplaceId,
  contentLanguage: config.contentLanguage,
});

const base = { marketplaceId: config.marketplaceId, categoryTypes: [{ name: "ALL_EXCLUDING_MOTORS_VEHICLES" }] };

export const POLICIES = {
  fulfillment: {
    ...base,
    name: "Honey Mommy - Free US shipping",
    description: "Free standard shipping, US addresses only. Ships from US warehouses.",
    handlingTime: { value: 2, unit: "DAY" },
    shipToLocations: { regionIncluded: [{ regionName: "US", regionType: "COUNTRY" }] },
    shippingOptions: [
      {
        optionType: "DOMESTIC",
        costType: "FLAT_RATE",
        shippingServices: [
          {
            sortOrder: 1,
            shippingCarrierCode: "USPS",
            shippingServiceCode: "ShippingMethodStandard",
            freeShipping: true,
            shippingCost: { value: "0.00", currency: "USD" },
          },
        ],
      },
    ],
    globalShipping: false,
  },
  payment: { ...base, name: "Honey Mommy - Immediate payment", immediatePay: true },
  return: {
    ...base,
    name: "Honey Mommy - 30-day US returns",
    returnsAccepted: true,
    returnPeriod: { value: 30, unit: "DAY" },
    returnShippingCostPayer: "BUYER",
    refundMethod: "MONEY_BACK",
    internationalOverride: { returnsAccepted: false },
  },
};

async function ensurePolicy(kind, body) {
  const list = await ebay.call("GET", `/sell/account/v1/${kind}_policy?marketplace_id=${config.marketplaceId}`);
  const found = (list?.[`${kind}Policies`] || []).find((p) => p.name === body.name);
  if (found) return found[`${kind}PolicyId`];
  return (await ebay.call("POST", `/sell/account/v1/${kind}_policy`, body))[`${kind}PolicyId`];
}

try {
  await ebay.call("POST", "/sell/account/v1/program/opt_in", { programType: "SELLING_POLICY_MANAGEMENT" });
} catch (err) {
  if (!(err instanceof HttpError) || err.status !== 409) console.warn(`Opt-in: ${err.message}`);
}

const ids = {};
for (const [kind, body] of Object.entries(POLICIES)) ids[kind] = await ensurePolicy(kind, body);

console.log("Add these as GitHub secrets:\n");
console.log(`EBAY_FULFILLMENT_POLICY_ID=${ids.fulfillment}`);
console.log(`EBAY_PAYMENT_POLICY_ID=${ids.payment}`);
console.log(`EBAY_RETURN_POLICY_ID=${ids.return}`);
