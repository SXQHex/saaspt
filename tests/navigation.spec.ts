import { test, expect } from "@playwright/test";

test("mobile navigation opens real design routes and more closes on navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Mobil alt menü" });
  await expect(nav.getByRole("link", { name: "Bugün" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await nav.getByRole("link", { name: "Kişiler" }).click();
  await expect(page).toHaveURL(/\/kisiler$/);
  await expect(nav.getByRole("link", { name: "Kişiler" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await nav.getByRole("button", { name: "Daha", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Diğer bölümler" });
  await dialog.getByRole("link", { name: "Belgeler" }).click();
  await expect(page).toHaveURL(/\/belgeler$/);
  await expect(dialog).not.toBeVisible();
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  const footer = await page.locator(".page-footer").boundingBox();
  const bar = await nav.boundingBox();
  expect(footer!.y + footer!.height).toBeLessThanOrEqual(bar!.y);
});

test("desktop and mobile shell adapt while an open more menu stays usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const desktop = page.getByRole("navigation", { name: "Ana gezinme" });
  await expect(desktop.getByRole("link", { name: "Bugün" })).toBeVisible();
  await expect(desktop.getByRole("link", { name: "Adaylar" })).toHaveAttribute(
    "href",
    "/adaylar",
  );
  await expect(page.locator(".mobile-navigation")).not.toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "RTL denemesi" }).click();
  await page
    .getByRole("navigation", { name: "Mobil alt menü" })
    .getByRole("button", { name: "Daha", exact: true })
    .click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  const dialog = page.getByRole("dialog", { name: "Diğer bölümler" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Programa dön" }).click();
  await expect(dialog).not.toBeVisible();
});

test("desktop sidebar collapses without losing accessible navigation names", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const original = await page.locator(".main").boundingBox();
  await page.getByRole("button", { name: "Yan menüyü daralt" }).click();
  await expect(
    page.getByRole("button", { name: "Yan menüyü genişlet" }),
  ).toHaveAttribute("aria-expanded", "false");
  expect((await page.locator(".sidebar").boundingBox())!.width).toBe(78);
  expect((await page.locator(".main").boundingBox())!.width).toBeGreaterThan(
    original!.width,
  );
  const nav = page.getByRole("navigation", { name: "Ana gezinme" });
  await expect(
    nav.getByRole("link", { name: "Bugün", exact: true }),
  ).toBeVisible();
  await expect(nav.getByRole("link", { name: "Takvim" })).toHaveAttribute(
    "href",
    "/takvim",
  );
  await page.getByRole("button", { name: "RTL denemesi" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Yan menüyü genişlet" }).click();
  await expect(
    page.getByRole("button", { name: "Yan menüyü daralt" }),
  ).toHaveAttribute("aria-expanded", "true");
});

test("mobile shortcut transfers focus below the sticky header", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".mobile-context")).toContainText("Merkez Stüdyo");
  await page.getByRole("link", { name: "Ders programına geç" }).click();
  const schedule = page.getByRole("region", { name: "Ders programı" });
  await expect(schedule).toBeFocused();
  const header = await page.locator(".sidebar").boundingBox();
  const content = await schedule.boundingBox();
  expect(content!.y).toBeGreaterThanOrEqual(header!.y + header!.height);
  await page
    .getByRole("navigation", { name: "Mobil alt menü" })
    .getByRole("link", { name: "Bugün" })
    .click();
  await expect(page.locator("#program")).toBeFocused();
});
