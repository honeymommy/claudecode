// One-time: get the eBay refresh token that lets the automation act for Honey Mommy.
//   1) node src/ebay-auth.js url          -> open the printed link, sign in, accept
//   2) node src/ebay-auth.js code "<code>" -> prints EBAY_REFRESH_TOKEN (valid 18 months)
// Needs EBAY_CLIENT_ID, EBAY_CLIENT_SECRET and EBAY_RUNAME (eBay developer account).
import { request } from "./http.js";
import { SCOPES, hosts } from "./ebay.js";

const { EBAY_CLIENT_ID, EBAY_CLIENT_SECRET, EBAY_RUNAME, EBAY_SANDBOX } = process.env;
const { api, auth } = hosts(EBAY_SANDBOX === "true");
const [cmd, code] = process.argv.slice(2);

if (!EBAY_CLIENT_ID || !EBAY_CLIENT_SECRET || !EBAY_RUNAME) {
  console.error("Set EBAY_CLIENT_ID, EBAY_CLIENT_SECRET and EBAY_RUNAME first.");
  process.exit(1);
}

if (cmd === "url") {
  const params = new URLSearchParams({ client_id: EBAY_CLIENT_ID, redirect_uri: EBAY_RUNAME, response_type: "code", scope: SCOPES.join(" ") });
  console.log(`Open this link, sign in to the Honey Mommy eBay account and click "Agree":\n\n${auth}/oauth2/authorize?${params}\n`);
  console.log('Then copy the "code" value from the address bar of the page you land on and run:\n  node src/ebay-auth.js code "<code>"');
} else if (cmd === "code" && code) {
  const res = await request(`${api}/identity/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${EBAY_CLIENT_ID}:${EBAY_CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code: decodeURIComponent(code), redirect_uri: EBAY_RUNAME }),
  });
  console.log(`EBAY_REFRESH_TOKEN=${res.refresh_token}`);
  console.log(`(expires in ${Math.round(res.refresh_token_expires_in / 86400)} days: put a reminder in your calendar to redo this step)`);
} else {
  console.error('Usage: node src/ebay-auth.js url | code "<code>"');
  process.exit(1);
}
