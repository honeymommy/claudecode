// eBay Sell APIs: Inventory (listings), Fulfillment (orders), Account (policies), Taxonomy (categories).
import { request, HttpError } from "./http.js";

export const SCOPES = [
  "https://api.ebay.com/oauth/api_scope",
  "https://api.ebay.com/oauth/api_scope/sell.inventory",
  "https://api.ebay.com/oauth/api_scope/sell.account",
  "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
];

export function hosts(sandbox) {
  return sandbox
    ? { api: "https://api.sandbox.ebay.com", auth: "https://auth.sandbox.ebay.com" }
    : { api: "https://api.ebay.com", auth: "https://auth.ebay.com" };
}

export function carrierCode(name = "") {
  const n = name.toLowerCase();
  if (n.includes("usps") || n.includes("postal")) return "USPS";
  if (n.includes("ups")) return "UPS";
  if (n.includes("fedex") || n.includes("fed ex")) return "FedEx";
  if (n.includes("dhl")) return "DHL";
  if (n.includes("ontrac")) return "OnTrac";
  if (n.includes("lasership")) return "LaserShip";
  return name || "Other";
}

export function createEbay({ clientId, clientSecret, refreshToken, sandbox = false, marketplaceId, contentLanguage }) {
  const { api } = hosts(sandbox);
  let token;
  let tokenExpires = 0;

  async function accessToken() {
    if (token && Date.now() < tokenExpires - 60_000) return token;
    const res = await request(`${api}/identity/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken, scope: SCOPES.join(" ") }),
    });
    token = res.access_token;
    tokenExpires = Date.now() + res.expires_in * 1000;
    return token;
  }

  async function call(method, path, body, extraHeaders = {}) {
    return request(`${api}${path}`, {
      method,
      body,
      headers: {
        Authorization: `Bearer ${await accessToken()}`,
        "Content-Language": contentLanguage,
        "Accept-Language": contentLanguage,
        "X-EBAY-C-MARKETPLACE-ID": marketplaceId,
        ...extraHeaders,
      },
    });
  }

  const notFound = (err) => err instanceof HttpError && err.status === 404;

  return {
    call,

    // ---- Inventory locations: the TopDawg warehouse each item ships from.
    async ensureLocation(key, w) {
      try {
        await call("GET", `/sell/inventory/v1/location/${key}`);
        return;
      } catch (err) {
        if (!notFound(err)) throw err;
      }
      await call("POST", `/sell/inventory/v1/location/${key}`, {
        name: `Supplier warehouse ${w.city || ""} ${w.state || ""}`.trim(),
        location: { address: { city: w.city, stateOrProvince: w.state, postalCode: w.postalCode, country: "US" } },
        locationTypes: ["WAREHOUSE"],
        merchantLocationStatus: "ENABLED",
      });
    },

    // ---- Category suggestion from the product title.
    async suggestCategory(query) {
      const res = await call("GET", `/commerce/taxonomy/v1/category_tree/0/get_category_suggestions?q=${encodeURIComponent(query.slice(0, 100))}`);
      return res?.categorySuggestions?.[0]?.category?.categoryId;
    },

    async putInventoryItem(sku, item) {
      await call("PUT", `/sell/inventory/v1/inventory_item/${encodeURIComponent(sku)}`, item);
    },

    async findOffer(sku) {
      try {
        const res = await call("GET", `/sell/inventory/v1/offer?sku=${encodeURIComponent(sku)}&marketplace_id=${marketplaceId}`);
        return res?.offers?.[0];
      } catch (err) {
        if (notFound(err)) return undefined;
        throw err;
      }
    },

    async createOffer(offer) {
      return (await call("POST", "/sell/inventory/v1/offer", offer)).offerId;
    },

    async updateOffer(offerId, offer) {
      await call("PUT", `/sell/inventory/v1/offer/${offerId}`, offer);
    },

    async publishOffer(offerId) {
      return (await call("POST", `/sell/inventory/v1/offer/${offerId}/publish`, {})).listingId;
    },

    // Price/quantity changes, 25 SKUs per call.
    async bulkUpdate(updates) {
      const results = [];
      for (let i = 0; i < updates.length; i += 25) {
        const res = await call("POST", "/sell/inventory/v1/bulk_update_price_quantity", {
          requests: updates.slice(i, i + 25).map((u) => ({
            sku: u.sku,
            shipToLocationAvailability: { quantity: u.quantity },
            offers: [{ offerId: u.offerId, availableQuantity: u.quantity, price: { value: u.price.toFixed(2), currency: "USD" } }],
          })),
        });
        results.push(...(res?.responses || []));
      }
      return results;
    },

    // ---- Orders that are paid and not yet shipped.
    async openOrders() {
      const orders = [];
      let path = "/sell/fulfillment/v1/order?filter=orderfulfillmentstatus:%7BNOT_STARTED%7CIN_PROGRESS%7D&limit=50";
      while (path) {
        const res = await call("GET", path);
        orders.push(...(res?.orders || []));
        path = res?.next ? res.next.replace(/^https:\/\/[^/]+/, "") : null;
      }
      return orders;
    },

    async addTracking(orderId, { lineItems, carrier, trackingNumber }) {
      await call("POST", `/sell/fulfillment/v1/order/${orderId}/shipping_fulfillment`, {
        lineItems: lineItems.map((li) => ({ lineItemId: li.lineItemId, quantity: li.quantity })),
        shippedDate: new Date().toISOString(),
        shippingCarrierCode: carrierCode(carrier),
        trackingNumber,
      });
    },
  };
}
