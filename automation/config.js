// Honey Mommy business rules. Change these values, not the code.
export default {
  marketplaceId: "EBAY_US",
  currency: "USD",
  contentLanguage: "en-US",

  pricing: {
    multiplier: 1.6, // price = (TopDawg cost + shipping) x 1.6
    ebayFeeRate: 0.136, // eBay final value fee (most Baby categories)
    ebayFixedFee: 0.4, // per-order fee
    minProfit: 5, // never list an item that earns less than this
    roundTo: 0.99, // 23.40 -> 23.99
  },

  catalog: {
    minCost: 15, // skip cheap items (cost + shipping)
    minStock: 5,
    maxListings: 200,
    defaultBrand: "Unbranded",
  },

  categories: [
    { name: "Pregnancy", keywords: ["maternity", "pregnancy", "belly band", "belly support", "stretch mark", "prenatal"] },
    { name: "Nursing", keywords: ["nursing", "breast pump", "breastfeeding", "breast pad", "nipple cream", "milk storage"] },
    { name: "Baby clothing", keywords: ["onesie", "bodysuit", "romper", "swaddle", "sleep sack", "newborn outfit", "baby socks", "baby hat", "infant clothing"] },
    { name: "Bath & care", keywords: ["baby bath", "hooded towel", "baby lotion", "baby brush", "baby shampoo", "diaper cream", "baby nail"] },
    { name: "Feeding", keywords: ["baby bottle", "bib", "sippy cup", "high chair", "baby spoon", "bottle warmer", "baby food"] },
    { name: "Play & development", keywords: ["teether", "teething", "rattle", "play mat", "baby gym", "baby mobile", "sensory toy", "infant toy"] },
  ],

  // Never sold: heavily regulated by the CPSC and the most frequent recalls.
  banned: [
    "car seat", "crib", "bassinet", "cradle", "sleep positioner", "infant sleeper", "inclined sleeper",
    "baby walker", "bath seat", "bumper pad", "crib bumper", "sids", "drop-side", "infant carrier",
    "baby carrier", "stroller", "bunk bed", "magnet", "button battery", "medicine", "formula",
  ],

  orders: {
    shipToCountries: ["US"], // only US addresses (50 states, DC, APO/FPO)
    maxOrderCost: 300, // anything above needs a manual check
  },

  // TopDawg API (Premier plan). Paths come from your TopDawg API docs:
  // TopDawg dashboard -> Integrations -> Custom Integration / API.
  topdawg: {
    baseUrl: process.env.TOPDAWG_API_URL || "https://topdawg.com/api",
    productsPath: process.env.TOPDAWG_PRODUCTS_PATH || "/products",
    createOrderPath: process.env.TOPDAWG_CREATE_ORDER_PATH || "/orders",
    orderPath: process.env.TOPDAWG_ORDER_PATH || "/orders/{id}",
    pageSize: 100,
  },
};
