// In-memory fake eBay + TopDawg served through a mocked global fetch.
export function installFakes({ products = [], orders = [], topdawgOrders = {} } = {}) {
  const calls = [];
  const ebay = { locations: new Set(), items: {}, offers: {}, published: {}, tracking: {}, nextOffer: 1 };
  const td = { created: [], orders: topdawgOrders };

  const json = (status, body) => new Response(status === 204 || body === undefined ? null : JSON.stringify(body), { status });

  globalThis.fetch = async (url, init = {}) => {
    const u = new URL(url);
    const method = init.method || "GET";
    const body = init.body && typeof init.body === "string" ? JSON.parse(init.body) : undefined;
    calls.push({ method, path: u.pathname, body });
    const p = u.pathname;

    // TopDawg
    if (u.hostname === "td.test") {
      if (p === "/api/products") {
        const page = Number(u.searchParams.get("page"));
        return json(200, { data: page === 1 ? products : [], next_page_url: null });
      }
      if (p === "/api/orders" && method === "POST") {
        const id = `TD${td.created.length + 1}`;
        td.created.push({ id, ...body });
        return json(200, { order_id: id });
      }
      const m = p.match(/^\/api\/orders\/(.+)$/);
      if (m) return json(200, { data: td.orders[m[1]] || { status: "processing" } });
    }

    // eBay
    if (p === "/identity/v1/oauth2/token") return json(200, { access_token: "tok", expires_in: 7200 });
    let m;
    if ((m = p.match(/^\/sell\/inventory\/v1\/location\/(.+)$/))) {
      if (method === "GET") return ebay.locations.has(m[1]) ? json(200, {}) : json(404, { errors: [] });
      ebay.locations.add(m[1]);
      return json(204);
    }
    if (p.startsWith("/commerce/taxonomy/")) return json(200, { categorySuggestions: [{ category: { categoryId: "20433" } }] });
    if ((m = p.match(/^\/sell\/inventory\/v1\/inventory_item\/(.+)$/))) {
      ebay.items[decodeURIComponent(m[1])] = body;
      return json(204);
    }
    if (p === "/sell/inventory/v1/offer" && method === "GET") {
      const sku = u.searchParams.get("sku");
      const offers = Object.entries(ebay.offers).filter(([, o]) => o.sku === sku).map(([offerId, o]) => ({ offerId, ...o }));
      return offers.length ? json(200, { offers }) : json(404, { errors: [] });
    }
    if (p === "/sell/inventory/v1/offer" && method === "POST") {
      const offerId = String(ebay.nextOffer++);
      ebay.offers[offerId] = body;
      return json(201, { offerId });
    }
    if ((m = p.match(/^\/sell\/inventory\/v1\/offer\/(\d+)$/)) && method === "PUT") {
      ebay.offers[m[1]] = body;
      return json(204);
    }
    if ((m = p.match(/^\/sell\/inventory\/v1\/offer\/(\d+)\/publish$/))) {
      ebay.published[m[1]] = `11000${m[1]}`;
      return json(200, { listingId: ebay.published[m[1]] });
    }
    if (p === "/sell/inventory/v1/bulk_update_price_quantity") {
      return json(200, { responses: body.requests.map((r) => ({ sku: r.sku, statusCode: 200 })) });
    }
    if (p === "/sell/fulfillment/v1/order") return json(200, { orders });
    if ((m = p.match(/^\/sell\/fulfillment\/v1\/order\/(.+)\/shipping_fulfillment$/))) {
      ebay.tracking[m[1]] = body;
      return json(201, {});
    }
    return json(500, { error: `fake: unhandled ${method} ${p}` });
  };

  return { calls, ebay, td };
}
