import { test, expect } from "@playwright/test";
test("cash correction records a difference and keeps original history", async ({
  page,
}) => {
  await page.goto("/finans");
  await page.getByRole("button", { name: "Hareketler", exact: true }).click();
  const before = await page.locator(".history-list").innerText();
  await page
    .getByRole("button", { name: "Tahsilat düzeltmesini incele" })
    .click();
  const d = page.getByRole("dialog", {
    name: "Tahsilat fark düzeltmesi taslağı",
    exact: true,
  });
  await d.getByRole("radio", { name: "Azalt", exact: true }).check();
  await d.getByLabel("Fark tutarı (TRY)").fill("25,50");
  await d.getByLabel("Düzeltme gerçekleşme zamanı").fill("2026-10-25T12:00");
  await d.getByLabel("Düzeltme gerekçesi").fill("Örnek kayıt hatası");
  await d.getByRole("button", { name: "Fark isteğini incele" }).click();
  await expect(d.getByRole("status")).toContainText("₺25,50");
  await expect(d.getByRole("status")).toContainText("Yeni toplam hesaplanmadı");
  await page.keyboard.press("Escape");
  expect(await page.locator(".history-list").innerText()).toBe(before);
});
test("refund and offset remain separate", async ({ page }) => {
  await page.goto("/finans");
  await page.getByRole("button", { name: "Alacak işlemlerini incele" }).click();
  const d = page.getByRole("dialog", {
    name: "Öğrenci alacağı işlem taslağı",
    exact: true,
  });
  await d.getByRole("button", { name: "Borca mahsup", exact: true }).click();
  await d.getByLabel("Alacak işlem tutarı (TRY)").fill("100,25");
  await expect(
    d.getByRole("button", { name: "Alacak isteğini incele" }),
  ).toBeDisabled();
  await d.getByRole("checkbox").check();
  await d.getByRole("button", { name: "Alacak isteğini incele" }).click();
  await expect(d.getByRole("status")).toContainText("₺100,25");
  await d.getByRole("button", { name: "Nakit iade", exact: true }).click();
  await expect(d.getByRole("status")).toHaveCount(0);
  await expect(d.getByLabel("Nakit iade gerekçesi")).toBeVisible();
});
test("new person checks duplicates without creating account or relationship", async ({
  page,
}) => {
  await page.goto("/kisiler");
  const list = page.getByRole("region", { name: "Kişi listesi" });
  const before = await list.innerText();
  await page.getByRole("button", { name: "Yeni kişi taslağı hazırla" }).click();
  const d = page.getByRole("dialog", {
    name: "Yeni kişi taslağı",
    exact: true,
  });
  await d.getByRole("searchbox").fill("Elif");
  await expect(d).toContainText("1 örnek eşleşme");
  await d.getByLabel("Kişinin görünen adı").fill("Yeni örnek kişi");
  await d.getByLabel("E-posta (isteğe bağlı)").fill("new@example.test");
  await expect(
    d.getByRole("button", { name: "Kişi isteğini incele" }),
  ).toBeDisabled();
  await d.getByRole("checkbox").check();
  await d.getByRole("button", { name: "Kişi isteğini incele" }).click();
  await expect(d.getByRole("status")).toContainText(
    "gerçek kişi kaydı yapılmadı",
  );
  await page.keyboard.press("Escape");
  expect(await list.innerText()).toBe(before);
});
test("person edit can be reverted and student deactivation requires reason", async ({
  page,
}) => {
  await page.goto("/kisiler");
  await page.getByRole("button", { name: "Kişi bilgisini düzenle" }).click();
  const d = page.getByRole("dialog", {
    name: "Kişi düzenleme taslağı",
    exact: true,
  });
  await d.getByLabel("Önerilen görünen ad").fill("Elif örnek ad");
  await d.getByRole("button", { name: "Kişi değişikliğini incele" }).click();
  await expect(d.getByRole("status")).toContainText("Elif örnek ad");
  await d.getByRole("button", { name: "Geri al", exact: true }).click();
  await expect(d.getByRole("status")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Öğrenci ilişkisini incele" }).click();
  const r = page.getByRole("dialog", {
    name: "Öğrenci ilişkisi taslağı",
    exact: true,
  });
  await expect(
    r.getByRole("button", { name: "İlişki isteğini incele" }),
  ).toBeDisabled();
  await r.getByLabel("Pasife alma gerekçesi").fill("Örnek değerlendirme");
  await r.getByRole("button", { name: "İlişki isteğini incele" }).click();
  await expect(r.getByRole("status")).toContainText("kendiliğinden silinmez");
});
test("merge direction and access request do not prove identity or send invitations", async ({
  page,
}) => {
  await page.goto("/kisiler");
  await page.getByRole("button", { name: "Mükerrer kişi incelemesi" }).click();
  const d = page.getByRole("dialog", {
    name: "Kişi birleştirme incelemesi",
    exact: true,
  });
  await d.getByRole("radio", { name: "Mert Aydın", exact: true }).check();
  await d.getByRole("checkbox").check();
  await d.getByRole("button", { name: "Birleştirme isteğini incele" }).click();
  await expect(d.getByRole("status")).toContainText(
    "hiçbir kayıt birleştirilmedi",
  );
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Hesap erişimini incele" }).click();
  const a = page.getByRole("dialog", {
    name: "Hesap erişimi incelemesi",
    exact: true,
  });
  await a.getByRole("checkbox").check();
  await a.getByRole("button", { name: "Erişim isteğini incele" }).click();
  await expect(a.getByRole("status")).toContainText("e-posta gönderilmedi");
});
test("lead conversion keeps existing person and converted leads cannot convert again", async ({
  page,
}) => {
  await page.goto("/adaylar");
  await page.getByRole("button", { name: "Öğrenciye dönüşümü incele" }).click();
  const d = page.getByRole("dialog", {
    name: "Aday dönüşüm isteği",
    exact: true,
  });
  await expect(d.getByRole("combobox")).toHaveCount(0);
  await expect(d.getByRole("radio")).toHaveCount(0);
  await d.getByRole("checkbox").check();
  await d.getByRole("button", { name: "Dönüşüm isteğini incele" }).click();
  await expect(d.getByRole("status")).toContainText("gerçek dönüşüm yapılmadı");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Dönüştü", exact: true }).click();
  await page.locator(".lead-record").click();
  await expect(
    page.getByRole("button", { name: "Öğrenciye dönüşümü incele" }),
  ).toHaveCount(0);
});
test("followup is a separate activity and editing invalidates summary", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/adaylar");
  await page.getByRole("button", { name: "Görüşme tasarımını aç" }).click();
  const d = page.getByRole("dialog", {
    name: "Görüşme notu taslağı",
    exact: true,
  });
  await d.getByRole("button", { name: "Takip", exact: true }).click();
  await d.getByLabel("Görüşme notu").fill("Örnek takip");
  await d.getByLabel("Takip zamanı (Europe/Istanbul)").fill("2026-10-26T15:00");
  await d.getByRole("button", { name: "Aktivite isteğini incele" }).click();
  await expect(d.getByRole("status")).toContainText(
    "adayın durumunu kendiliğinden değiştirmez",
  );
  await d.getByLabel("Görüşme notu").fill("Yeni not");
  await expect(d.getByRole("status")).toHaveCount(0);
  expect(await d.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
});

test("changing person identity fields invalidates duplicate confirmation", async ({
  page,
}) => {
  await page.goto("/kisiler");
  await page.getByRole("button", { name: "Yeni kişi taslağı hazırla" }).click();
  const d = page.getByRole("dialog", {
    name: "Yeni kişi taslağı",
    exact: true,
  });
  await d.getByLabel("Kişinin görünen adı").fill("Örnek kişi");
  await d.getByRole("checkbox").check();
  await d.getByLabel("E-posta (isteğe bağlı)").fill("changed@example.test");
  await expect(d.getByRole("checkbox")).not.toBeChecked();
  await expect(
    d.getByRole("button", { name: "Kişi isteğini incele" }),
  ).toBeDisabled();
});
