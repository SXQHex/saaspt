import { test, expect } from "@playwright/test";

const routes = [
  "takvim",
  "kisiler",
  "finans",
  "paketler",
  "etkinlikler",
  "adaylar",
  "raporlar",
  "belgeler",
  "ayarlar",
  "hakedisler",
  "bildirimler",
];
for (const width of [390, 1440]) {
  for (const route of routes) {
    test(`${route} renders without overflow at ${width}px`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.setViewportSize({ width, height: 1000 });
      const response = await page.goto(`/${route}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator(".design-scope-note")).toContainText(
        "Sentetik",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      expect(errors).toEqual([]);
      await page.screenshot({
        path: `/private/tmp/saaspt-${route}-${width}.png`,
        fullPage: true,
      });
    });
  }
}

test("brand and font survive client navigation while the active section changes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Marka ve görünüm", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "Marka ve görünüm" });
  await dialog.getByLabel("Renk paketi", { exact: true }).selectOption("sahne");
  await dialog
    .getByLabel("Font paketi", { exact: true })
    .selectOption("editorial");
  await dialog.getByRole("button", { name: "Programda gör" }).click();
  await page
    .getByRole("navigation", { name: "Ana gezinme" })
    .getByRole("link", { name: "Kişiler", exact: true })
    .click();
  await expect(page).toHaveURL(/\/kisiler$/);
  await expect(page.locator(".preview")).toHaveAttribute(
    "data-direction",
    "sahne",
  );
  await expect(page.locator(".preview")).toHaveAttribute(
    "data-font",
    "editorial",
  );
  await expect(
    page
      .getByRole("navigation", { name: "Ana gezinme" })
      .getByRole("link", { name: "Kişiler", exact: true }),
  ).toHaveAttribute("aria-current", "page");
});

test("attendance requires all sample results and never closes a real session", async ({
  page,
}) => {
  await page.goto("/takvim");
  await page.getByRole("button", { name: "Yoklama tasarımını aç" }).click();
  const dialog = page.getByRole("dialog", {
    name: "Yoklama taslağı",
    exact: true,
  });
  await expect(
    dialog.getByRole("button", { name: "Kapanış özetini incele" }),
  ).toBeDisabled();
  await expect(dialog.getByRole("combobox")).toHaveCount(0);
  const participants = dialog.getByRole("group");
  for (let i = 0; i < (await participants.count()); i++) {
    await expect(
      participants.nth(i).getByRole("radio", { name: "Bekliyor" }),
    ).toBeChecked();
    await participants.nth(i).getByText("Katıldı", { exact: true }).click();
  }
  const first = participants.first();
  await first.getByText("Bekliyor", { exact: true }).click();
  await expect(
    dialog.getByRole("button", { name: "Kapanış özetini incele" }),
  ).toBeDisabled();
  await first.getByRole("radio", { name: "Bekliyor" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    first.getByRole("radio", { name: "Katıldı", exact: true }),
  ).toBeChecked();
  await first.getByText("Gelmedi", { exact: true }).click();
  await dialog.getByRole("button", { name: "Kapanış özetini incele" }).click();
  await expect(dialog.getByRole("status")).toContainText("1 gelmedi");
  await expect(dialog.getByRole("status")).toContainText(
    "Gerçek kapanış yapılmadı",
  );
});

test("people role filters preserve a single multi-role identity", async ({
  page,
}) => {
  await page.goto("/kisiler");
  await page.getByRole("searchbox", { name: "Kişi ara" }).fill("Deniz");
  await expect(
    page.getByRole("region", { name: "Kişi listesi" }).getByRole("button"),
  ).toHaveCount(1);
  await page
    .getByRole("region", { name: "Kişi listesi" })
    .getByRole("button")
    .click();
  await expect(
    page.getByRole("complementary", { name: "Kişi ayrıntısı" }),
  ).toContainText("Eğitmen · Öğrenci");
  await page
    .getByRole("group", { name: "Kişi ilişkisi" })
    .getByRole("button", { name: "Eğitmen", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Kişi listesi" }).getByRole("button"),
  ).toHaveCount(1);
});

test("collection draft does not alter balances and credit stays separate", async ({
  page,
}) => {
  await page.goto("/finans");
  const table = page.getByRole("table");
  const before = await table.innerText();
  await page.getByRole("button", { name: "Tahsilat tasarımını aç" }).click();
  const dialog = page.getByRole("dialog", { name: "Manuel tahsilat taslağı" });
  await dialog.getByLabel("Tahsilat tutarı (TRY)").fill("400");
  await dialog
    .getByRole("button", { name: "Tahsilat taslağını incele" })
    .click();
  await expect(dialog.getByRole("status")).toContainText("bakiye değişmedi");
  await dialog
    .getByRole("button", { name: "Taslağı kapat", exact: true })
    .click();
  expect(await table.innerText()).toBe(before);
});

test("CRM empty state recovers and access state hides prior records", async ({
  page,
}) => {
  await page.goto("/adaylar");
  await page
    .getByRole("group", { name: "Aday durumu" })
    .getByRole("button", { name: "Kapalı", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Eşleşen kayıt yok." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Filtreleri temizle" }).click();
  await expect(
    page.getByRole("complementary", { name: "Aday ayrıntısı" }),
  ).toContainText("Zeynep");
  await page.getByText("Durum örnekleri", { exact: true }).click();
  await page
    .getByRole("group", { name: "Ekran durum örnekleri" })
    .getByRole("button", { name: "Erişim yok", exact: true })
    .click();
  await expect(
    page.getByRole("complementary", { name: "Aday ayrıntısı" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Bu alanı görüntüleme yetkin yok." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "İçerik örneğine dön" }).click();
  await expect(
    page.getByRole("complementary", { name: "Aday ayrıntısı" }),
  ).toBeVisible();
});

test("reports respond to selected day and event preparation does not reserve a seat", async ({
  page,
}) => {
  await page.goto("/raporlar");
  await page
    .getByRole("group", { name: "Rapor günü" })
    .getByRole("button", { name: "24 Ekim" })
    .click();
  await expect(page.locator(".report-bars > div")).toHaveCount(1);
  await page.goto("/etkinlikler");
  await page.getByRole("button", { name: "Kayıt akışını incele" }).click();
  const dialog = page.getByRole("dialog", { name: "Etkinlik kayıt hazırlığı" });
  await expect(dialog).toContainText("Bu adım yer ayırmaz");
  await expect(
    dialog.getByRole("button", { name: /Öde|Onayla ve uygula/ }),
  ).toHaveCount(0);
});

test("mobile record selection focuses details and unknown sections return 404", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/kisiler");
  await page
    .getByRole("region", { name: "Kişi listesi" })
    .getByRole("button", { name: /Mert Aydın/ })
    .click();
  const detail = page.getByRole("complementary", { name: "Kişi ayrıntısı" });
  await expect(detail).toBeFocused();
  await expect(detail).toContainText("Mert Aydın");
  expect((await detail.boundingBox())!.y).toBeGreaterThanOrEqual(
    (await page.locator(".sidebar").boundingBox())!.height,
  );
  const response = await page.goto("/constructor");
  expect(response?.status()).toBe(404);
});
