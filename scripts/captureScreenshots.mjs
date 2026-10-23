import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OUTPUT_DIR = path.resolve(process.cwd(), "docs/screenshots");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const routes = [
  { name: "landing", path: "/" },
  { name: "dashboard", path: "/dashboard" },
  { name: "data-centre", path: "/data-centre" },
  { name: "reconciliation", path: "/reconciliation" },
  { name: "ai-workspace", path: "/ai-workspace" },
  { name: "experiments", path: "/experiments" },
  { name: "reviews", path: "/reviews" },
  { name: "location", path: "/location" },
  { name: "public-profile", path: "/public-profile" },
  { name: "funding", path: "/funding" },
  { name: "admin", path: "/admin" },
  { name: "settings", path: "/settings" },
];

const viewports = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 375, height: 812 },
];

async function run() {
  console.log("Launching Chromium for visual verification...");
  const browser = await chromium.launch({ headless: true });

  for (const vp of viewports) {
    for (const theme of ["light", "dark"]) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await context.newPage();

      // For key screens, capture across light and dark
      const targetRoutes = (vp.name === "desktop" && theme === "light")
        ? routes
        : [routes[0], routes[1], routes[3], routes[4], routes[9], routes[11]]; // Landing, Dashboard, Reconciliation, AI, Funding, Settings

      for (const r of targetRoutes) {
        const url = `${BASE_URL}${r.path}`;
        try {
          await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
          if (theme === "dark") {
            await page.evaluate(() => {
              document.documentElement.setAttribute("data-theme", "dark");
              document.documentElement.style.colorScheme = "dark";
            });
          } else {
            await page.evaluate(() => {
              document.documentElement.removeAttribute("data-theme");
              document.documentElement.style.colorScheme = "light";
            });
          }
          await page.waitForTimeout(300);

          const fileName = `${r.name}_${vp.width}px_${theme}.png`;
          const filePath = path.join(OUTPUT_DIR, fileName);
          await page.screenshot({ path: filePath, fullPage: false });
          console.log(`Saved screenshot: ${fileName}`);
        } catch (err) {
          console.error(`Failed ${r.name} at ${vp.width}px ${theme}:`, err.message);
        }
      }
      await context.close();
    }
  }

  await browser.close();
  console.log("Visual verification complete!");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
