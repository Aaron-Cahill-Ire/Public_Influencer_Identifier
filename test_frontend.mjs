// Playwright smoke test: loads index.html, verifies the ranking renders
// correctly, and saves a screenshot.
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const url = pathToFileURL(resolve("index.html")).href;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(url);

const items = await page.$$eval("#ranking li", (lis) =>
  lis.map((li) => ({
    handle: li.querySelector(".handle").textContent,
    score: li.querySelector(".score").textContent,
  }))
);

console.log("Rendered ranking:");
items.forEach((it, i) => console.log(`  ${i + 1}. ${it.handle} — ${it.score}`));

// Assertions: 3 rows, ordered carol > alice > bob (matches Python output).
const expected = ["@carol", "@alice", "@bob"];
const actual = items.map((it) => it.handle);

let ok = true;
if (items.length !== 3) {
  console.error(`FAIL: expected 3 rows, got ${items.length}`);
  ok = false;
}
if (JSON.stringify(actual) !== JSON.stringify(expected)) {
  console.error(`FAIL: expected order ${expected.join(", ")}, got ${actual.join(", ")}`);
  ok = false;
}
if (!items[0].score.includes("505,000")) {
  console.error(`FAIL: expected top score 505,000, got "${items[0].score}"`);
  ok = false;
}

await page.screenshot({ path: "frontend-screenshot.png", fullPage: true });
console.log("Saved screenshot to frontend-screenshot.png");

await browser.close();

if (ok) {
  console.log("\nPASS: all assertions passed");
  process.exit(0);
} else {
  console.error("\nTEST FAILED");
  process.exit(1);
}
