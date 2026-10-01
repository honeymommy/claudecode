// fetch with JSON handling and retries on rate limits / server errors.
export class HttpError extends Error {
  constructor(method, url, status, body) {
    super(`${method} ${url} -> ${status}: ${typeof body === "string" ? body : JSON.stringify(body)}`.slice(0, 1000));
    this.status = status;
    this.body = body;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function request(url, { method = "GET", headers = {}, body, retries = 3, retryDelayMs = 1000 } = {}) {
  const init = { method, headers: { Accept: "application/json", ...headers } };
  if (body !== undefined) {
    if (typeof body === "string" || body instanceof URLSearchParams) {
      init.body = body;
    } else {
      init.body = JSON.stringify(body);
      init.headers["Content-Type"] ??= "application/json";
    }
  }
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, init);
    const text = await res.text();
    let data = text;
    try { data = text ? JSON.parse(text) : null; } catch { /* keep text */ }
    if (res.ok) return data;
    if ((res.status === 429 || res.status >= 500) && attempt < retries) {
      await sleep(retryDelayMs * 2 ** attempt);
      continue;
    }
    throw new HttpError(method, url, res.status, data);
  }
}
