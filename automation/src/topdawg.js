// TopDawg API client (Premier plan, "Custom Integration").
// TopDawg does not publish its API docs, so every path lives in config.js and
// every response is read defensively. If TopDawg's docs use other paths or
// field names, adjust config.js / the read* helpers below — nothing else.
import { request } from "./http.js";

const pick = (obj, ...keys) => {
  for (const k of keys) {
    const v = k.split(".").reduce((o, part) => (o == null ? undefined : o[part]), obj);
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
};

export function readProductPage(res) {
  const items = Array.isArray(res) ? res : pick(res, "data", "products", "items", "results", "data.products") || [];
  const next = Array.isArray(res) ? undefined : pick(res, "next_page_url", "links.next", "meta.next_page", "next");
  return { items, hasMore: Boolean(next) };
}

export function readOrderId(res) {
  const id = pick(res, "order_id", "orderId", "id", "data.order_id", "data.id", "order.id");
  if (id === undefined) throw new Error(`TopDawg did not return an order id: ${JSON.stringify(res).slice(0, 300)}`);
  return String(id);
}

export function readOrderStatus(res) {
  const order = pick(res, "data.order", "order", "data") || res;
  const status = String(pick(order, "status", "order_status", "state") || "unknown").toLowerCase();
  const raw = pick(order, "shipments", "tracking", "fulfillments") || [];
  const list = Array.isArray(raw) ? raw : [raw];
  const single = pick(order, "tracking_number", "trackingNumber");
  if (single) list.push({ tracking_number: single, carrier: pick(order, "carrier", "shipping_carrier") });
  const shipments = list
    .map((s) => ({
      trackingNumber: pick(s, "tracking_number", "trackingNumber", "number"),
      carrier: pick(s, "carrier", "carrier_name", "shipping_carrier", "company"),
    }))
    .filter((s) => s.trackingNumber);
  const cancelled = /cancel|reject|refund/.test(status);
  return { status, cancelled, shipments };
}

export function createTopDawg({ apiKey, config }) {
  const base = config.baseUrl.replace(/\/$/, "");
  const headers = { Authorization: `Bearer ${apiKey}` };

  return {
    async *products() {
      for (let page = 1; ; page++) {
        const res = await request(`${base}${config.productsPath}?page=${page}&per_page=${config.pageSize}`, { headers });
        const { items, hasMore } = readProductPage(res);
        yield* items;
        if (!hasMore || items.length === 0) return;
      }
    },

    async createOrder({ reference, shipTo, items }) {
      const body = {
        po_number: reference,
        reference,
        shipping_address: {
          name: shipTo.name,
          address1: shipTo.address1,
          address2: shipTo.address2 || "",
          city: shipTo.city,
          state: shipTo.state,
          zip: shipTo.postalCode,
          country: shipTo.country,
          phone: shipTo.phone || "",
          email: shipTo.email || "",
        },
        items: items.map((i) => ({ sku: i.sku, quantity: i.quantity })),
      };
      return readOrderId(await request(`${base}${config.createOrderPath}`, { method: "POST", headers, body }));
    },

    async getOrder(id) {
      return readOrderStatus(await request(`${base}${config.orderPath.replace("{id}", encodeURIComponent(id))}`, { headers }));
    },
  };
}
