// eBay orders -> TopDawg orders, then TopDawg tracking -> eBay.
const DAY = 24 * 60 * 60 * 1000;

export function shipToAddress(order) {
  const shipTo = order.fulfillmentStartInstructions?.[0]?.shippingStep?.shipTo;
  if (!shipTo) return null;
  const a = shipTo.contactAddress || {};
  return {
    name: shipTo.fullName,
    address1: a.addressLine1,
    address2: a.addressLine2,
    city: a.city,
    state: a.stateOrProvince,
    postalCode: a.postalCode,
    country: a.countryCode,
    phone: shipTo.primaryPhone?.phoneNumber,
    email: shipTo.email,
  };
}

async function forwardNewOrders({ topdawg, ebay, state, config, dryRun, log, notify }) {
  let forwarded = 0;
  for (const order of await ebay.openOrders()) {
    const id = order.orderId;
    if (state.orders[id]) continue;
    if (order.orderPaymentStatus !== "PAID") continue;
    if (order.cancelStatus?.cancelState && order.cancelStatus.cancelState !== "NONE_REQUESTED") continue;

    const shipTo = shipToAddress(order);
    if (!shipTo || !config.orders.shipToCountries.includes(shipTo.country)) {
      notify.alert(`order-country:${id}`, `Order ${id} ships outside the US`, `eBay order ${id} ships to ${shipTo?.country ?? "an unknown address"}. Honey Mommy ships to the US only: cancel and refund it in eBay Seller Hub.`);
      continue;
    }
    const lines = order.lineItems.map((li) => ({ ...li, listing: state.listings[li.sku] }));
    const unknown = lines.filter((l) => !l.listing);
    if (unknown.length) {
      notify.alert(`order-sku:${id}`, `Order ${id} has an item the automation doesn't know`, `SKU(s) ${unknown.map((l) => l.sku || l.title).join(", ")} were not listed by the automation, so they were not ordered from TopDawg. Place this order by hand in TopDawg.`);
      continue;
    }
    const cost = lines.reduce((sum, l) => sum + (l.listing.cost ?? 0) * l.quantity, 0);
    const revenue = Number(order.pricingSummary?.total?.value ?? 0);
    if (cost > config.orders.maxOrderCost) {
      notify.alert(`order-cost:${id}`, `Order ${id} needs your OK ($${cost.toFixed(2)} at TopDawg)`, `This order costs more than the $${config.orders.maxOrderCost} safety limit in config.js. Check it and place it by hand in TopDawg, or raise the limit.`);
      continue;
    }
    if (revenue && cost > revenue) {
      notify.alert(`order-loss:${id}`, `Order ${id} would lose money`, `TopDawg cost $${cost.toFixed(2)} vs. buyer paid $${revenue.toFixed(2)}. Not forwarded: check the TopDawg price, then place it by hand or cancel it.`);
      continue;
    }

    const items = lines.map((l) => ({ sku: l.sku, quantity: l.quantity }));
    if (dryRun) {
      log.info(`[dry run] would order ${JSON.stringify(items)} from TopDawg for eBay order ${id} (${shipTo.city}, ${shipTo.state})`);
      continue;
    }
    try {
      const topdawgOrderId = await topdawg.createOrder({ reference: `EBAY-${id}`, shipTo, items });
      state.orders[id] = {
        topdawgOrderId,
        status: "forwarded",
        forwardedAt: new Date().toISOString(),
        lineItems: order.lineItems.map((li) => ({ lineItemId: li.lineItemId, quantity: li.quantity })),
      };
      forwarded++;
      log.info(`eBay order ${id} -> TopDawg order ${topdawgOrderId}`);
    } catch (err) {
      notify.alert(`order-fail:${id}`, `Order ${id} could not be sent to TopDawg`, `Error: ${err.message}\n\nThe automation will keep retrying every run. If this persists, place the order by hand in TopDawg (usually: card declined or auto-pay off).`);
    }
  }
  return forwarded;
}

async function pushTracking({ topdawg, ebay, state, dryRun, log, notify }) {
  let shipped = 0;
  for (const [id, o] of Object.entries(state.orders)) {
    if (o.status !== "forwarded") continue;
    let td;
    try {
      td = await topdawg.getOrder(o.topdawgOrderId);
    } catch (err) {
      log.error(`Could not read TopDawg order ${o.topdawgOrderId}: ${err.message}`);
      continue;
    }
    if (td.cancelled) {
      o.status = "cancelled";
      notify.alert(`order-cancelled:${id}`, `TopDawg cancelled the item(s) for order ${id}`, `TopDawg order ${o.topdawgOrderId} is "${td.status}". Message the buyer, then cancel and refund the order in eBay Seller Hub (Orders -> Cancel order). The listing's stock will be corrected on the next product sync.`);
      continue;
    }
    const shipment = td.shipments[0];
    if (!shipment) {
      if (Date.now() - Date.parse(o.forwardedAt) > 4 * DAY) {
        notify.alert(`order-late:${id}`, `Order ${id} has no tracking after 4 days`, `TopDawg order ${o.topdawgOrderId} is still "${td.status}". Contact TopDawg support so the buyer doesn't open a case.`);
      }
      continue;
    }
    if (dryRun) {
      log.info(`[dry run] would add ${shipment.carrier} ${shipment.trackingNumber} to eBay order ${id}`);
      continue;
    }
    try {
      await ebay.addTracking(id, { lineItems: o.lineItems, ...shipment });
      Object.assign(o, { status: "shipped", shippedAt: new Date().toISOString(), tracking: shipment });
      shipped++;
      log.info(`eBay order ${id} marked shipped (${shipment.carrier} ${shipment.trackingNumber})`);
    } catch (err) {
      log.error(`Could not add tracking to ${id}: ${err.message}`);
    }
  }
  return shipped;
}

function prune(state) {
  for (const [id, o] of Object.entries(state.orders)) {
    const done = o.shippedAt || (o.status === "cancelled" && o.forwardedAt);
    if (done && Date.now() - Date.parse(done) > 120 * DAY) delete state.orders[id];
  }
}

export async function syncOrders(ctx) {
  const forwarded = await forwardNewOrders(ctx);
  const shipped = await pushTracking(ctx);
  prune(ctx.state);
  ctx.log.info(`Orders: ${forwarded} sent to TopDawg, ${shipped} tracking numbers sent to eBay${ctx.dryRun ? " (dry run)" : ""}.`);
  return { forwarded, shipped };
}
