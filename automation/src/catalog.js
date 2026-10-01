// Turns raw TopDawg products into Honey Mommy listings and decides what to sell.
import { priceFor } from "./pricing.js";

const first = (...values) => values.find((v) => v !== undefined && v !== null && v !== "");
const num = (v) => (v === undefined || v === null || v === "" ? undefined : Number(v));

// TopDawg field names vary between feed versions; accept the common spellings.
export function normalizeProduct(raw) {
  const wh = first(raw.warehouse, raw.ship_from, raw.shipFrom, raw.supplier?.warehouse, raw.supplier) || {};
  const images = first(raw.images, raw.image_urls, raw.imageUrls, raw.image ? [raw.image] : undefined) || [];
  return {
    sku: String(first(raw.sku, raw.SKU, raw.product_sku, raw.id) ?? ""),
    title: String(first(raw.title, raw.name, raw.product_name) ?? "").trim(),
    description: String(first(raw.description, raw.body_html, raw.long_description, "") ?? ""),
    brand: first(raw.brand, raw.manufacturer),
    upc: first(raw.upc, raw.UPC, raw.barcode, raw.gtin),
    mpn: first(raw.mpn, raw.model),
    category: String(first(raw.category, raw.category_name, raw.categories?.join?.(" > "), "") ?? ""),
    cost: num(first(raw.cost, raw.wholesale_price, raw.wholesalePrice, raw.price)),
    shipping: num(first(raw.shipping_cost, raw.shippingCost, raw.shipping_price, 0)) ?? 0,
    quantity: num(first(raw.quantity, raw.qty, raw.stock, raw.inventory, 0)) ?? 0,
    images: images.map((i) => (typeof i === "string" ? i : first(i.url, i.src))).filter(Boolean),
    warehouse: {
      city: first(wh.city, raw.ship_from_city),
      state: first(wh.state, wh.state_code, wh.region, raw.ship_from_state),
      postalCode: first(wh.zip, wh.postal_code, wh.postalCode, raw.ship_from_zip),
      country: String(first(wh.country, wh.country_code, raw.ship_from_country, raw.country_of_origin_shipping, "US")).toUpperCase(),
    },
  };
}

const has = (text, words) => words.find((w) => new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}s?\\b`, "i").test(text));

export function classify(product, config) {
  const text = `${product.title} ${product.category}`;
  const banned = has(`${text} ${product.description}`, config.banned);
  if (banned) return { ok: false, reason: `banned keyword "${banned}"` };
  const category = config.categories.find((c) => has(text, c.keywords));
  if (!category) return { ok: false, reason: "not a pregnancy/baby product" };
  return { ok: true, category: category.name };
}

// Decides whether a product is listed, and at which price.
export function evaluate(product, config) {
  if (!product.sku || !product.title) return { ok: false, reason: "missing SKU or title" };
  if (!["US", "USA", "UNITED STATES"].includes(product.warehouse.country)) {
    return { ok: false, reason: `ships from ${product.warehouse.country}, not the US` };
  }
  if (!product.images.length) return { ok: false, reason: "no image" };
  if (!(product.cost > 0)) return { ok: false, reason: "no cost" };
  const c = classify(product, config);
  if (!c.ok) return c;
  const landed = product.cost + product.shipping;
  if (landed < config.catalog.minCost) return { ok: false, reason: `cost ${landed} below minimum` };
  const price = priceFor(landed, config.pricing);
  if (price === null) return { ok: false, reason: "profit too small" };
  const quantity = product.quantity >= config.catalog.minStock ? Math.min(product.quantity, 50) : 0;
  return { ok: true, category: c.category, price, quantity };
}

// eBay titles are capped at 80 characters.
export const ebayTitle = (t) => (t.length <= 80 ? t : t.slice(0, 80).replace(/\s+\S*$/, ""));

// SKU-safe key for an eBay inventory location ("TopDawg warehouse in Dallas, TX").
export function locationKey(w) {
  return `td-${w.state || "xx"}-${w.postalCode || "00000"}`.toLowerCase().replace(/[^a-z0-9-]/g, "");
}
