// Small JSON memory committed back to the repo after each run, so an
// order is never forwarded twice and listings keep their eBay IDs.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

export const emptyState = () => ({ listings: {}, orders: {}, alerts: {} });

export function loadState(path) {
  try {
    return { ...emptyState(), ...JSON.parse(readFileSync(path, "utf8")) };
  } catch (err) {
    if (err.code === "ENOENT") return emptyState();
    throw err;
  }
}

export function saveState(path, state) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(state, null, 2) + "\n");
}
