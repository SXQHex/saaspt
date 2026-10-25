import { test, expect } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`reservation draft requires person right and mode at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/takvim");
    await page
      .getByRole("button", {
        name: "Rezervasyon tasarımını incele",
        exact: true,
      })
      .click();
    const dialog = page.getByRole("dialog", {
      name: "Rezervasyon taslağı",
      exact: true,
    });
    await expect(
      dialog.getByRole("button", { name: "Hak seçimine geç" }),
    ).toBeDisabled();
    await dialog
      .getByRole("searchbox", { name: "Rezervasyon için öğrenci ara" })
      .fill("ELİF");
    await expect(dialog.getByRole("radio")).toHaveCount(1);
    await dialog.getByRole("radio", { name: /Elif Aksoy/ }).check();
    await dialog.getByRole("button", { name: "Hak seçimine geç" }).click();
    await expect(dialog.locator(".flow-content")).toBeFocused();
    await expect(
      dialog.getByRole("button", { name: "Kontrol özetini incele" }),
    ).toBeDisabled();
    await dialog.getByRole("radio", { name: /Salsa ders hakkı/ }).check();
    await expect(
      dialog.getByRole("button", { name: "Kontrol özetini incele" }),
    ).toBeDisabled();
    await dialog.getByRole("radio", { name: /^Esnek/ }).check();
    await dialog
      .getByRole("button", { name: "Kontrol özetini incele" })
      .click();
    await expect(dialog).toContainText("Henüz rezervasyon oluşmadı.");
    await expect(dialog).toContainText("Salsa ders hakkı");
    await expect(dialog).toContainText("Kontrol");
    expect(
      await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
    await dialog.getByRole("button", { name: "Seçimleri düzenle" }).click();
    await expect(
      dialog.getByRole("radio", { name: /Salsa ders hakkı/ }),
    ).toBeChecked();
    await dialog.getByRole("button", { name: "Öğrenciye dön" }).click();
    await dialog.getByRole("searchbox").fill("Deniz");
    await dialog.getByRole("radio", { name: /Deniz Kaya/ }).check();
    await dialog.getByRole("button", { name: "Hak seçimine geç" }).click();
    await expect(dialog.locator("input:checked")).toHaveCount(0);
    await expect(
      dialog.getByRole("button", { name: "Kontrol özetini incele" }),
    ).toBeDisabled();
  });
}

test("booking search empty recovery and full capacity do not promise a seat", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Güç ve denge/ }).click();
  await page
    .getByRole("button", { name: "Rezervasyon tasarımını incele", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Rezervasyon taslağı",
    exact: true,
  });
  await dialog.getByRole("searchbox").fill("olmayan");
  await expect(
    dialog.getByText("Bu aramada öğrenci bulunamadı."),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Aramayı temizle" }).click();
  await dialog.getByRole("radio", { name: /Selin Yıldız/ }).check();
  await dialog.getByRole("button", { name: "Hak seçimine geç" }).click();
  await dialog
    .getByRole("radio", { name: /Uygun hakkı işlem sırasında belirle/ })
    .check();
  await dialog.getByRole("radio", { name: /^Esnek/ }).check();
  await dialog.getByRole("button", { name: "Kontrol özetini incele" }).click();
  await expect(dialog).toContainText("Örnek kontenjan dolu.");
  await expect(dialog).toContainText("İşlem sırasında belirlenecek");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("complementary", { name: "Ders ayrıntısı" }),
  ).toContainText("10 / 10");
  await page.getByRole("button", { name: /Temelden Salsa/ }).click();
  await page
    .getByRole("button", { name: "Rezervasyon tasarımını incele", exact: true })
    .click();
  await expect(
    dialog.getByRole("button", { name: "Hak seçimine geç" }),
  ).toBeDisabled();
});

test("reservation cancellation requires a record and reason and does not issue a refund", async ({
  page,
}) => {
  await page.goto("/takvim");
  await page.getByText("Kayıt ve düzeltme örnekleri", { exact: true }).click();
  await page
    .getByRole("button", { name: "Rezervasyon iptal örneği", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Rezervasyon iptal taslağı",
    exact: true,
  });
  await expect(
    dialog.getByRole("button", { name: "İptal isteğini incele" }),
  ).toBeDisabled();
  await dialog.getByRole("radio", { name: /Elif Aksoy/ }).check();
  await dialog.getByRole("textbox", { name: "İptal gerekçesi" }).fill("   ");
  await expect(
    dialog.getByRole("button", { name: "İptal isteğini incele" }),
  ).toBeDisabled();
  await dialog
    .getByRole("textbox", { name: "İptal gerekçesi" })
    .fill("Örnek program değişikliği");
  await dialog.getByRole("button", { name: "İptal isteğini incele" }).click();
  await expect(dialog.getByRole("status")).toBeFocused();
  await expect(dialog.getByRole("status")).toContainText(
    "İptal henüz gerçekleşmedi",
  );
  await expect(dialog.getByRole("status")).toContainText(
    "nakit iade yapıldığı anlamına gelmez",
  );
  await dialog
    .getByRole("textbox", { name: "İptal gerekçesi" })
    .fill("Yeni gerekçe");
  await expect(dialog.getByRole("status")).toHaveCount(0);
});

test("closed attendance correction preserves history and requires a changed result", async ({
  page,
}) => {
  await page.goto("/takvim");
  await page.getByText("Kayıt ve düzeltme örnekleri", { exact: true }).click();
  await page
    .getByRole("button", {
      name: "Kapanmış yoklama düzeltme örneği",
      exact: true,
    })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Kapanmış yoklama düzeltme taslağı",
    exact: true,
  });
  await dialog.getByRole("radio", { name: /Elif Aksoy/ }).check();
  await dialog
    .getByRole("group", { name: "Yeni sonuç" })
    .getByRole("radio", { name: /Katıldı/ })
    .check();
  await dialog
    .getByRole("textbox", { name: "Düzeltme gerekçesi" })
    .fill("Örnek yanlış işaretleme");
  await expect(
    dialog.getByRole("button", { name: "Düzeltme isteğini incele" }),
  ).toBeDisabled();
  await dialog
    .getByRole("group", { name: "Yeni sonuç" })
    .getByRole("radio", { name: "Gelmedi", exact: true })
    .check();
  await dialog
    .getByRole("button", { name: "Düzeltme isteğini incele" })
    .click();
  const summary = dialog.getByRole("status");
  await expect(summary).toBeFocused();
  await expect(summary).toContainText("Kapanıştaki sonuçKatıldı");
  await expect(summary).toContainText("Önerilen sonuçGelmedi");
  await expect(summary).toContainText("seansı yeniden açmaz");
  await expect(summary).toContainText("Gerçek düzeltme yapılmadı");
  await dialog.getByRole("radio", { name: /Mert Aydın/ }).check();
  await expect(summary).toHaveCount(0);
  await expect(
    dialog.getByRole("group", { name: "Yeni sonuç" }).locator("input:checked"),
  ).toHaveCount(0);
});

test("reservation selection fits narrow RTL and closes back to the trigger", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/takvim");
  await page.getByRole("button", { name: "RTL denemesi" }).click();
  const opener = page.getByRole("button", {
    name: "Rezervasyon tasarımını incele",
    exact: true,
  });
  await opener.click();
  const dialog = page.getByRole("dialog", {
    name: "Rezervasyon taslağı",
    exact: true,
  });
  expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
    true,
  );
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
});
