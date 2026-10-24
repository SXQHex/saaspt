import { test, expect } from "@playwright/test";

test("manager finds a lesson, changes days and recovers an empty result", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Günün ritmi." }),
  ).toBeVisible();
  await page
    .getByRole("group", { name: "Salon filtresi" })
    .getByRole("button", { name: "Salon B" })
    .click();
  await page
    .getByRole("textbox", { name: "Ders veya eğitmen ara" })
    .fill("güç");
  await page.getByRole("button", { name: /Güç ve denge/ }).click();
  await expect(
    page
      .getByRole("complementary", { name: "Ders ayrıntısı" })
      .getByRole("heading", { name: "Güç ve denge" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Sonraki gün" }).click();
  await expect(
    page.getByRole("heading", { name: "Bu görünümde ders yok." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Filtreleri temizle" }).click();
  await expect(
    page.getByRole("button", { name: /Hafta sonu akışı/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Örnek güne dön" }).click();
  await expect(
    page.getByRole("button", { name: /Temelden Salsa/ }),
  ).toBeVisible();
});

test("mobile layout supports themes and RTL without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Sahne", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Sahne", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "RTL denemesi" }).click();
  await expect(page.locator(".workspace")).toHaveAttribute("dir", "rtl");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: /Temelden Salsa/ }).click();
  await expect(
    page.getByRole("heading", { name: "Temelden Salsa" }),
  ).toBeVisible();
});

test("manager inspects pending attendance and keeps debt separate from credit", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Dersi incele", exact: true })
    .first()
    .click();
  await expect(
    page
      .getByRole("complementary", { name: "Ders ayrıntısı" })
      .getByRole("heading", { name: "Güne hareketle başla" }),
  ).toBeVisible();
  await expect(
    page.getByRole("complementary", { name: "Ders ayrıntısı" }),
  ).toBeFocused();
  await page.getByRole("button", { name: /Açık borçlar incelenmeli/ }).click();
  const row = page.getByRole("row", { name: /Örnek öğrenci A/ });
  await expect(row.getByRole("cell").nth(0)).toContainText("1.200");
  await expect(row.getByRole("cell").nth(1)).toContainText("300");
  await expect(page.getByRole("table")).toContainText("2.450");
});

test("stale effects are hidden and unknown outcome never claims success", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: /İptal etkisi yeniden incelenmeli/ })
    .click();
  const opener = page.getByRole("button", {
    name: "İptal etkisini incele",
    exact: true,
  });
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "İptalin etkisi" });
  await expect(
    dialog.getByRole("heading", { name: "Ödeme bilgisi değişti." }),
  ).toBeVisible();
  await expect(dialog.getByText("Kaldırılacak kalan borç")).toHaveCount(0);
  await dialog.getByRole("button", { name: "Örnek önizlemeyi yenile" }).click();
  await expect(dialog.getByText("Kaldırılacak kalan borç")).toBeVisible();
  await expect(
    dialog.getByText("Uygulama bu önizlemede kapalı."),
  ).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: /Onayla|Uygula/ }),
  ).toHaveCount(0);
  await dialog.getByRole("combobox").selectOption("unknown");
  await expect(
    dialog.getByRole("heading", { name: "İşlemin sonucu henüz bilinmiyor." }),
  ).toBeVisible();
  await expect(dialog.getByText("Kaldırılacak kalan borç")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test("mobile RTL cancellation preview fits and can be dismissed", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "RTL denemesi" }).click();
  await page
    .getByRole("button", { name: /İptal etkisi yeniden incelenmeli/ })
    .click();
  await page
    .getByRole("button", { name: "İptal etkisini incele", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Örnek önizlemeyi yenile" }).click();
  expect(
    await dialog.evaluate(
      (element) => element.scrollWidth <= element.clientWidth,
    ),
  ).toBe(true);
  await dialog
    .getByRole("button", { name: "Önizlemeyi kapat", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
});

test("daily attendance shares direct choices and resets for another lesson", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Yoklama tasarımını aç" }).click();
  const dialog = page.getByRole("dialog", {
    name: "Yoklama taslağı",
    exact: true,
  });
  await expect(dialog).toContainText("Temelden Salsa");
  await dialog
    .getByRole("group")
    .first()
    .getByText("Katıldı", { exact: true })
    .click();
  await expect(dialog).toContainText("1 / 4 sonuç işaretlendi.");
  expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
    true,
  );
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Yoklama tasarımını aç" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Ders listesine dön" }).click();
  await expect(
    page.getByRole("region", { name: "Ders programı" }),
  ).toBeFocused();
  await page.getByRole("button", { name: /Güç ve denge/ }).click();
  await expect(
    page.getByRole("complementary", { name: "Ders ayrıntısı" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Yoklama tasarımını aç" }).click();
  await expect(dialog).toContainText("Güç ve denge");
  await expect(dialog).toContainText("0 / 4 sonuç işaretlendi.");
  await expect(
    dialog.getByRole("button", { name: "Kapanış özetini incele" }),
  ).toBeDisabled();
});
