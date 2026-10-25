import { test, expect } from "@playwright/test";
test("event preparation and full-capacity scenario preserve payment and registration boundaries", async ({
  page,
}) => {
  await page.goto("/etkinlikler");
  await page.getByRole("button", { name: "Kayıt akışını incele" }).click();
  const d = page.getByRole("dialog", {
    name: "Etkinlik kayıt hazırlığı",
    exact: true,
  });
  await expect(
    d.getByRole("button", { name: "Kayıt adımını incele" }),
  ).toBeDisabled();
  await d.getByRole("radio", { name: "Elif Aksoy", exact: true }).check();
  await d.getByRole("button", { name: "Kayıt adımını incele" }).click();
  await expect(d.getByRole("status")).toContainText("yer ayırmaz");
  await d
    .getByRole("button", { name: "Yer doldu örneği", exact: true })
    .click();
  await expect(d.getByRole("status")).toHaveCount(0);
  await d.getByRole("button", { name: "Kayıt adımını incele" }).click();
  await expect(d.getByRole("status")).toContainText(
    "Nakit iade otomatik değildir",
  );
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Etkinlik iptalini incele" }).click();
  const cancel = page.getByRole("dialog", {
    name: "Merkez etkinlik iptali taslağı",
    exact: true,
  });
  await cancel
    .getByLabel("Etkinlik iptal gerekçesi")
    .fill("Örnek merkez iptali");
  await cancel.getByRole("button", { name: "İptal kontrolünü incele" }).click();
  await expect(cancel.getByRole("status")).toContainText("Gerçek iptal");
});
test("document publication keeps file local and preserves old acceptance evidence", async ({
  page,
}) => {
  const writes: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "POST" && r.url().includes("/functions/v1/"))
      writes.push(r.url());
  });
  await page.goto("/belgeler");
  await page
    .getByRole("button", { name: "Yeni sürüm isteğini hazırla" })
    .click();
  const d = page.getByRole("dialog", {
    name: "Belge yayımlama taslağı",
    exact: true,
  });
  await d.getByLabel("Yerel dosya örneği").setInputFiles({
    name: "sentetik-belge.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Synthetic design test only"),
  });
  await d.getByLabel("Yeni sürüm etiketi").fill("v3-örnek");
  await d.getByRole("checkbox", { name: "Rezervasyon", exact: true }).check();
  await d
    .getByRole("checkbox", { name: "Yenilenmiş kabul gereksinimini incele" })
    .check();
  await d.getByRole("button", { name: "Yayımlama isteğini incele" }).click();
  await expect(d.getByRole("status")).toContainText(
    "Eski sürüm ve kabul kanıtı korunur",
  );
  await expect(d.getByRole("status")).toContainText("sürüm yayımlanmadı");
  expect(writes).toEqual([]);
  await d.getByLabel("Yeni sürüm etiketi").fill("v4-örnek");
  await expect(d.getByRole("status")).toHaveCount(0);
});
test("report job examples expose no fake file and recheck access", async ({
  page,
}) => {
  await page.goto("/raporlar");
  await page
    .getByRole("button", { name: "Dışa aktarım tasarımını incele" })
    .click();
  const d = page.getByRole("dialog", {
    name: "Rapor dışa aktarım akışı",
    exact: true,
  });
  await d.getByLabel("Rapor başlangıcı").fill("2026-10-01");
  await d.getByLabel("Rapor bitiş sınırı").fill("2026-10-01");
  await d.getByRole("button", { name: "Rapor isteğini incele" }).click();
  await expect(d.getByRole("alert")).toContainText("sonra olmalı");
  await d.getByLabel("Rapor bitiş sınırı").fill("2026-11-01");
  await d.getByRole("button", { name: "Rapor isteğini incele" }).click();
  await d
    .getByRole("button", { name: "Dosya hazır örneği", exact: true })
    .click();
  await expect(d.getByRole("status")).toContainText(
    "gerçek dosya veya indirme bağlantısı yok",
  );
  await expect(d.getByRole("link")).toHaveCount(0);
  await d
    .getByRole("button", { name: "Erişim değişti örneği", exact: true })
    .click();
  await expect(d.getByRole("status")).toContainText(
    "Eski dosya bağlantısı erişim vermez",
  );
});
test("person finance link selects the same person and unknown link never selects another person", async ({
  page,
}) => {
  await page.goto("/kisiler");
  await page
    .getByRole("region", { name: "Kişi listesi" })
    .getByRole("button")
    .filter({ hasText: "Deniz Kaya" })
    .click();
  await page.getByRole("link", { name: "Finansı incele", exact: true }).click();
  await expect(page).toHaveURL(/person=person-c/);
  await expect(
    page.getByRole("complementary", { name: "Finans ayrıntısı" }),
  ).toContainText("Deniz Kaya");
  await page.goto("/finans?person=unknown");
  await expect(
    page.getByRole("complementary", { name: "Finans ayrıntısı" }),
  ).not.toContainText("Elif Aksoy");
});
for (const [route, list, label, record] of [
  ["kisiler", "Kişi listesi", "Kişi listesine dön", ".person-record"],
  ["adaylar", "Aday listesi", "Aday listesine dön", ".lead-record"],
  ["paketler", "Paket kataloğu", "Paket listesine dön", ".product-record"],
  [
    "etkinlikler",
    "Etkinlik listesi",
    "Etkinlik listesine dön",
    ".event-record",
  ],
  ["belgeler", "Belge listesi", "Belge listesine dön", ".document-record"],
])
  test(`mobile ${route} returns focus to list`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${route}`);
    await page.locator(record!).first().click();
    await page.getByRole("button", { name: label!, exact: true }).click();
    await expect(
      page.getByRole("region", { name: list!, exact: true }),
    ).toBeFocused();
  });

test("removing all document gates clears renewed acceptance without reopening it", async ({
  page,
}) => {
  await page.goto("/belgeler");
  await page
    .getByRole("button", { name: "Yeni sürüm isteğini hazırla" })
    .click();
  const d = page.getByRole("dialog", {
    name: "Belge yayımlama taslağı",
    exact: true,
  });
  const renew = d.getByRole("checkbox", {
    name: "Yenilenmiş kabul gereksinimini incele",
  });
  const gate = d.getByRole("checkbox", { name: "Rezervasyon", exact: true });
  await expect(renew).toBeDisabled();
  await gate.check();
  await renew.check();
  await gate.uncheck();
  await expect(renew).not.toBeChecked();
  await expect(renew).toBeDisabled();
  await gate.check();
  await expect(renew).not.toBeChecked();
});
