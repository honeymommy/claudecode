// TopDawg catalog -> eBay listings (create, reprice, restock, end) + website product feed.
import { normalizeProduct, evaluate, ebayTitle, locationKey } from "./catalog.js";

const escapeHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

export function cleanDescription(html) {
  const cleaned = html
    .replace(/<(script|style|iframe|object|form)[\s\S]*?<\/\1>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/https?:\/\/\S*topdawg\S*/gi, "");
  return /<[a-z]/i.test(cleaned) ? cleaned : `<p>${escapeHtml(cleaned).replace(/\n+/g, "</p><p>")}</p>`;
}

export async function syncProducts({ topdawg, ebay, state, config, policies, template, dryRun, log, notify }) {
  const today = new Date().toISOString().slice(0, 10);
  const seen = new Set();
  const candidates = [];
  const skipped = {};

  for await (const raw of topdawg.products()) {
    const product = normalizeProduct(raw);
    const verdict = evaluate(product, config);
    if (!verdict.ok) {
      skipped[verdict.reason] = (skipped[verdict.reason] || 0) + 1;
      continue;
    }
    seen.add(product.sku);
    candidates.push({ product, ...verdict });
  }
  log.info(`TopDawg: ${candidates.length} sellable products. Skipped: ${JSON.stringify(skipped)}`);

  // Keep what's already listed, then fill remaining slots with the best margins.
  candidates.sort((a, b) => (state.listings[b.product.sku] ? 1 : 0) - (state.listings[a.product.sku] ? 1 : 0) || b.price - a.price);
  const selected = candidates.slice(0, config.catalog.maxListings);

  const updates = [];
  const failures = [];
  let created = 0;

  for (const { product, category, price, quantity } of selected) {
    const listing = state.listings[product.sku];
    if (listing?.listingId) {
      listing.cost = product.cost + product.shipping;
      if (listing.price !== price || listing.quantity !== quantity) {
        updates.push({ sku: product.sku, offerId: listing.offerId, price, quantity });
      }
      continue;
    }
    if (quantity === 0) continue;
    if (dryRun) {
      log.info(`[dry run] would list ${product.sku} "${product.title}" at $${price} (${category})`);
      continue;
    }
    try {
      const key = locationKey(product.warehouse);
      await ebay.ensureLocation(key, product.warehouse);
      const categoryId = listing?.categoryId || (await ebay.suggestCategory(product.title));
      if (!categoryId) throw new Error("no eBay category found");
      const brand = product.brand || config.catalog.defaultBrand;
      await ebay.putInventoryItem(product.sku, {
        condition: "NEW",
        availability: { shipToLocationAvailability: { quantity } },
        product: {
          title: ebayTitle(product.title),
          description: product.title,
          imageUrls: product.images.slice(0, 24),
          brand,
          ...(product.mpn && { mpn: String(product.mpn) }),
          ...(product.upc && { upc: [String(product.upc)] }),
          aspects: { Brand: [brand], Type: [category], ...(product.mpn && { MPN: [String(product.mpn)] }) },
        },
      });
      const offer = {
        sku: product.sku,
        marketplaceId: config.marketplaceId,
        format: "FIXED_PRICE",
        availableQuantity: quantity,
        categoryId,
        listingDescription: template.replace("{{DESCRIPTION}}", cleanDescription(product.description || product.title)),
        listingPolicies: policies,
        merchantLocationKey: key,
        pricingSummary: { price: { value: price.toFixed(2), currency: config.currency } },
      };
      const existing = listing?.offerId ? { offerId: listing.offerId } : await ebay.findOffer(product.sku);
      const offerId = existing?.offerId || (await ebay.createOffer(offer));
      if (existing?.offerId) await ebay.updateOffer(offerId, offer);
      // Remember the offer before publishing so a failed publish is retried, not duplicated.
      state.listings[product.sku] = { offerId, categoryId, price, quantity, cost: product.cost + product.shipping, category, title: product.title, image: product.images[0] };
      const listingId = await ebay.publishOffer(offerId);
      state.listings[product.sku].listingId = listingId;
      created++;
      log.info(`Listed ${product.sku} -> eBay item ${listingId} at $${price}`);
    } catch (err) {
      failures.push(`- \`${product.sku}\` ${product.title}: ${err.message}`);
      log.error(`Could not list ${product.sku}: ${err.message}`);
    }
  }

  // Anything listed that TopDawg no longer offers (or no longer qualifies) goes to 0 stock.
  for (const [sku, listing] of Object.entries(state.listings)) {
    if (!seen.has(sku) && listing.offerId && listing.quantity !== 0) {
      updates.push({ sku, offerId: listing.offerId, price: listing.price, quantity: 0 });
    }
  }

  if (updates.length && !dryRun) {
    const results = await ebay.bulkUpdate(updates);
    const failed = new Set(results.filter((r) => r.statusCode >= 400).map((r) => r.sku));
    for (const u of updates) {
      if (failed.has(u.sku)) {
        failures.push(`- \`${u.sku}\`: price/stock update failed`);
      } else {
        Object.assign(state.listings[u.sku], { price: u.price, quantity: u.quantity });
      }
    }
  }
  log.info(`eBay: ${created} new listings, ${updates.length} price/stock updates${dryRun ? " (dry run)" : ""}.`);

  if (failures.length) {
    notify.alert(
      `listing-failures:${today}`,
      `${failures.length} product(s) could not be listed or updated on eBay`,
      `The automation will retry on its next run. If the same products keep failing, the error usually says which eBay field is missing.\n\n${failures.slice(0, 50).join("\n")}`,
    );
  }
  return { created, updated: updates.length, failures: failures.length };
}

export function siteFeed(state) {
  return Object.values(state.listings)
    .filter((l) => l.listingId && l.quantity > 0)
    .map((l) => ({ title: l.title, price: l.price, image: l.image, category: l.category, url: `https://www.ebay.com/itm/${l.listingId}` }));
}
