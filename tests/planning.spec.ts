import { test, expect } from "@playwright/test";
test("finite program request stays blocked on the unresolved capacity contract", async ({
  page,
}) => {
  await page.goto("/takvim");
  await page.getByRole("button", { name: "Program planını hazırla" }).click();
  const d = page.getByRole("dialog", {
    name: "Sonlu program taslağı",
    exact: true,
  });
  await d.getByLabel("Program başlangıcı", { exact: true }).fill("2026-11-01");
  await d
    .getByLabel("Program bitiş sınırı", { exact: true })
    .fill("2026-12-01");
  await d.getByLabel("Yerel başlangıç saati", { exact: true }).fill("18:00");
  await d.getByLabel("Ders süresi (dakika)", { exact: true }).fill("60");
  await d.getByRole("button", { name: "Program isteğini incele" }).click();
  await expect(d.getByRole("alert")).toContainText("En az bir");
  await d.getByRole("checkbox", { name: "Salı", exact: true }).check();
  await d.getByRole("button", { name: "Program isteğini incele" }).click();
  await expect(d.getByRole("status")).toContainText(
    "Kapasite sözleşmesi bekleniyor.",
  );
  await expect(d.getByRole("status")).toContainText(
    "seans veya rezervasyon üretmedi",
  );
});
test("waitlist and expired offer never become a confirmed booking", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/takvim");
  await page.getByRole("button", { name: "Bekleme listesini incele" }).click();
  const d = page.getByRole("dialog", {
    name: "Bekleme ve yer teklifi taslağı",
    exact: true,
  });
  await d.getByRole("radio", { name: "Elif Aksoy", exact: true }).check();
  await d.getByRole("button", { name: "Sıraya giriş isteğini incele" }).click();
  await expect(d.getByRole("status")).toContainText("yer garantisi verilmedi");
  await d.getByRole("button", { name: "Yer teklifi", exact: true }).click();
  await d
    .getByRole("button", { name: "Süresi geçmiş teklif örneği", exact: true })
    .click();
  await expect(d).toContainText("Süresi geçmiş teklif kabul edilemez");
  await expect(d.getByRole("button", { name: /Kabul et/ })).toHaveCount(0);
  expect(await d.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
});
