import { test } from "node:test";
import assert from "node:assert/strict";
import config from "../config.js";
import { salePrice, profit, priceFor } from "../src/pricing.js";
import { normalizeProduct, evaluate, ebayTitle } from "../src/catalog.js";
import { createEbay } from "../src/ebay.js";
import { createTopDawg } from "../src/topdawg.js";
import { emptyState } from "../src/state.js";
import { syncProducts, siteFeed, cleanDescription } from "../src/sync-products.js";
import { syncOrders } from "../src/sync-orders.js";
import { installFakes } from "./fakes.js";

const quiet = { info() {}, warn() {}, error() {} };

const raw = (over = {}) => ({
  sku: "TD-100",
  name: "Maternity Pregnancy Pillow U-Shape",
  description: "Full body support.\nRemovable cover.",
  wholesale_price: "22.50",
  shipping_cost: "5.00",
  quantity: 40,
  brand: "Cozy",
  images: [{ url: "https://img.test/1.jpg" }],
  warehouse: { city: "Dallas", state: "TX", zip: "75201", country: "US" },
  ...over,
});

function setup(fakes) {
  const f = installFakes(fakes);
  const state = emptyState();
  const alerts = [];
  const ctx = {
    ebay: createEbay({ clientId: "id", clientSecret: "s", refreshToken: "r", marketplaceId: "EBAY_US", contentLanguage: "en-US" }),
    topdawg: createTopDawg({ apiKey: "k", config: { ...config.topdawg, baseUrl: "https://td.test/api" } }),
    state,
    config,
    dryRun: false,
    log: quiet,
    notify: { alert: (key, title) => alerts.push({ key, title }) },
    policies: { fulfillmentPolicyId: "F", paymentPolicyId: "P", returnPolicyId: "R" },
    template: "<div>{{DESCRIPTION}}</div>",
  };
  return { ...f, state, alerts, ctx };
}

test("pricing rounds to .99 and checks profit", () => {
  assert.equal(salePrice(27.5, config.pricing), 44.99);
  assert.ok(profit(44.99, 27.5, config.pricing) >= config.pricing.minProfit);
  assert.equal(priceFor(5, config.pricing), null);
});

test("catalog keeps only US-shipped pregnancy/baby items", () => {
  const ok = evaluate(normalizeProduct(raw()), config);
  assert.deepEqual([ok.ok, ok.category, ok.price, ok.quantity], [true, "Pregnancy", 44.99, 40]);
  assert.match(evaluate(normalizeProduct(raw({ name: "Infant Car Seat with base" })), config).reason, /car seat/);
  assert.match(evaluate(normalizeProduct(raw({ name: "Dog leash" })), config).reason, /not a pregnancy/);
  assert.match(evaluate(normalizeProduct(raw({ warehouse: { country: "CN" } })), config).reason, /CN/);
  assert.equal(evaluate(normalizeProduct(raw({ quantity: 2 })), config).quantity, 0);
  assert.ok(ebayTitle("x ".repeat(60)).length <= 80);
});

test("descriptions are cleaned", () => {
  assert.equal(cleanDescription("a & b\nc"), "<p>a &amp; b</p><p>c</p>");
  assert.equal(cleanDescription('<p onclick="x()">hi</p><script>bad()</script>'), "<p>hi</p>");
});

test("products: lists, reprices, then zeroes discontinued items", async () => {
  const s = setup({ products: [raw(), raw({ sku: "TD-200", name: "Dog bed" })] });
  await syncProducts(s.ctx);
  assert.deepEqual(Object.keys(s.ebay.items), ["TD-100"]);
  const offer = Object.values(s.ebay.offers)[0];
  assert.equal(offer.pricingSummary.price.value, "44.99");
  assert.equal(offer.merchantLocationKey, "td-tx-75201");
  assert.deepEqual(offer.listingPolicies, s.ctx.policies);
  assert.ok(s.ebay.locations.has("td-tx-75201"));
  assert.equal(s.state.listings["TD-100"].listingId, "110001");
  assert.deepEqual(siteFeed(s.state)[0].url, "https://www.ebay.com/itm/110001");

  // Second run: same data -> no new listing, no update.
  const before = Object.keys(s.ebay.offers).length;
  const r2 = await syncProducts(s.ctx);
  assert.deepEqual([r2.created, r2.updated, Object.keys(s.ebay.offers).length], [0, 0, before]);

  // Cost goes up -> repriced.
  const s3 = setup({ products: [raw({ wholesale_price: "30" })] });
  s3.ctx.state.listings = s.state.listings;
  const r3 = await syncProducts(s3.ctx);
  assert.equal(r3.updated, 1);
  assert.equal(s3.ctx.state.listings["TD-100"].price, 56.99);

  // Product gone from TopDawg -> quantity 0.
  const s4 = setup({ products: [] });
  s4.ctx.state.listings = s.state.listings;
  await syncProducts(s4.ctx);
  assert.equal(s4.ctx.state.listings["TD-100"].quantity, 0);
});

test("products: a failed publish is retried on the same offer", async () => {
  const s = setup({ products: [raw()] });
  s.ebay.offers["7"] = { sku: "TD-100" };
  s.state.listings["TD-100"] = { offerId: "7", categoryId: "20433", price: 44.99, quantity: 40 };
  await syncProducts(s.ctx);
  assert.deepEqual(Object.keys(s.ebay.offers), ["7"]);
  assert.equal(s.state.listings["TD-100"].listingId, "110007");
});

test("products: dry run writes nothing", async () => {
  const s = setup({ products: [raw()] });
  s.ctx.dryRun = true;
  await syncProducts(s.ctx);
  assert.equal(s.calls.filter((c) => c.method !== "GET").length, 0);
  assert.deepEqual(s.state.listings, {});
});

const order = (over = {}) => ({
  orderId: "12-345",
  orderPaymentStatus: "PAID",
  cancelStatus: { cancelState: "NONE_REQUESTED" },
  pricingSummary: { total: { value: "44.99" } },
  lineItems: [{ lineItemId: "L1", sku: "TD-100", quantity: 1 }],
  fulfillmentStartInstructions: [{ shippingStep: { shipTo: {
    fullName: "Jane Doe",
    contactAddress: { addressLine1: "1 Main St", city: "Austin", stateOrProvince: "TX", postalCode: "78701", countryCode: "US" },
    primaryPhone: { phoneNumber: "5125550100" },
  } } }],
  ...over,
});

const listed = { "TD-100": { offerId: "1", listingId: "110001", price: 44.99, quantity: 40, cost: 27.5 } };

test("orders: forwards a paid US order once, then pushes tracking", async () => {
  const s = setup({ orders: [order()] });
  s.state.listings = structuredClone(listed);
  await syncOrders(s.ctx);
  await syncOrders(s.ctx);
  assert.equal(s.td.created.length, 1);
  assert.equal(s.td.created[0].shipping_address.zip, "78701");
  assert.deepEqual(s.td.created[0].items, [{ sku: "TD-100", quantity: 1 }]);
  assert.equal(s.state.orders["12-345"].status, "forwarded");

  s.td.orders.TD1 = { status: "shipped", tracking_number: "9400111", carrier: "USPS Ground Advantage" };
  await syncOrders(s.ctx);
  assert.equal(s.ebay.tracking["12-345"].trackingNumber, "9400111");
  assert.equal(s.ebay.tracking["12-345"].shippingCarrierCode, "USPS");
  assert.equal(s.state.orders["12-345"].status, "shipped");
});

test("orders: guards against non-US, unpaid, unknown SKU, losses and big orders", async () => {
  const intl = order({ orderId: "A" });
  intl.fulfillmentStartInstructions[0].shippingStep.shipTo.contactAddress.countryCode = "CA";
  const s = setup({
    orders: [
      intl,
      order({ orderId: "B", orderPaymentStatus: "PENDING" }),
      order({ orderId: "C", cancelStatus: { cancelState: "CANCEL_REQUESTED" } }),
      order({ orderId: "D", lineItems: [{ lineItemId: "L", sku: "MANUAL-1", quantity: 1 }] }),
      order({ orderId: "E", pricingSummary: { total: { value: "10.00" } } }),
      order({ orderId: "F", lineItems: [{ lineItemId: "L", sku: "TD-100", quantity: 20 }], pricingSummary: { total: { value: "900" } } }),
    ],
  });
  s.state.listings = structuredClone(listed);
  await syncOrders(s.ctx);
  assert.equal(s.td.created.length, 0);
  assert.deepEqual(s.alerts.map((a) => a.key).sort(), ["order-cost:F", "order-country:A", "order-loss:E", "order-sku:D"]);
});

test("orders: a TopDawg cancellation raises an alert", async () => {
  const s = setup({ orders: [], topdawgOrders: { TD9: { status: "Cancelled" } } });
  s.state.orders["X"] = { topdawgOrderId: "TD9", status: "forwarded", forwardedAt: new Date().toISOString(), lineItems: [] };
  await syncOrders(s.ctx);
  assert.equal(s.state.orders.X.status, "cancelled");
  assert.equal(s.alerts[0].key, "order-cancelled:X");
});
