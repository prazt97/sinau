import { expect, test } from "@playwright/test";
test("healthcheck tersedia", async ({ request }) => { const response = await request.get("/api/health"); await expect(response).toBeOK(); });
test("halaman login tersedia", async ({ page }) => { await page.goto("/auth/login"); await expect(page.getByRole("heading", { name: "Masuk ke Sinau" })).toBeVisible(); });
