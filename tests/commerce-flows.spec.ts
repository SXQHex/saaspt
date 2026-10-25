import { test, expect } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`sale requires explicit student and dates without collecting payment at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/paketler");
    await page
      .getByRole("button", { name: "Satış tasarımını incele", exact: true })
      .click();
    const dialog = page.getByRole("dialog", {
      name: "Paket satış taslağı",
      exact: true,
    });
    await expect(
      dialog.getByRole("button", { name: "Geçerliliği belirle" }),
    ).toBeDisabled();
    await dialog.getByRole("searchbox").fill("olmayan");
    await expect(
      dialog.getByText("Bu aramada öğrenci bulunamadı."),
    ).toBeVisible();
    await dialog.getByRole("button", { name: "Aramayı temizle" }).click();
    await dialog.getByRole("radio", { name: /Elif Aksoy/ }).check();
    await dialog.getByRole("button", { name: "Geçerliliği belirle" }).click();
    await expect(
      dialog.getByLabel("Başlangıç tarihi", { exact: true }),
    ).toHaveValue("");
    await expect(
      dialog.getByLabel("Bitiş sınırı", { exact: true }),
    ).toHaveValue("");
    await dialog
      .getByLabel("Başlangıç tarihi", { exact: true })
      .fill("2026-10-24");
    await dialog.getByLabel("Bitiş sınırı", { exact: true }).fill("2026-10-24");
    await dialog.getByRole("button", { name: "Satış isteğini incele" }).click();
    await expect(dialog.getByRole("alert")).toContainText("başlangıçtan sonra");
    await expect(
      dialog.getByLabel("Bitiş sınırı", { exact: true }),
    ).toBeFocused();
    await dialog.getByLabel("Bitiş sınırı", { exact: true }).fill("2026-11-24");
    await dialog.getByRole("button", { name: "Satış isteğini incele" }).click();
    await expect(dialog.locator(".flow-content")).toBeFocused();
    await expect(dialog).toContainText("24 Kasım 2026");
    await expect(dialog).toContainText(
      "Gerçek satış önizlemesi henüz alınmadı.",
    );
    await expect(dialog).toContainText("Bu akışta tahsilat yapılmadı");
    expect(
      await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
    await dialog
      .getByRole("button", { name: "Satış seçimlerini düzenle" })
      .click();
    await expect(
      dialog.getByLabel("Başlangıç tarihi", { exact: true }),
    ).toHaveValue("2026-10-24");
    await dialog.getByRole("button", { name: "Öğrenciye dön" }).click();
    await dialog.getByRole("radio", { name: /Mert Aydın/ }).check();
    await dialog.getByRole("button", { name: "Geçerliliği belirle" }).click();
    await expect(
      dialog.getByLabel("Başlangıç tarihi", { exact: true }),
    ).toHaveValue("");
  });
}

test("collection preserves comma cents, multiple debt selection and invalidates edited summaries", async ({
  page,
}) => {
  await page.goto("/finans");
  const balances = page.getByRole("table");
  const before = await balances.innerText();
  await page
    .getByRole("button", { name: "Tahsilat tasarımını aç", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Manuel tahsilat taslağı",
    exact: true,
  });
  await expect(
    dialog.getByRole("button", { name: "Tahsilat taslağını incele" }),
  ).toBeDisabled();
  for (const checkbox of await dialog.getByRole("checkbox").all())
    await checkbox.check();
  await dialog
    .getByLabel("Tahsilat tutarı (TRY)", { exact: true })
    .fill("400,50");
  await dialog
    .getByLabel("Tahsilat zamanı (Europe/Istanbul)", { exact: true })
    .fill("2026-10-24T14:30");
  await dialog
    .getByRole("textbox", { name: "Açıklama", exact: true })
    .fill("Örnek elden tahsilat");
  await dialog
    .getByRole("button", { name: "Tahsilat taslağını incele" })
    .click();
  const summary = dialog.getByRole("status");
  await expect(summary).toBeFocused();
  await expect(summary).toContainText("₺400,50");
  await expect(summary).toContainText("Örnek ders satış borcu");
  await expect(summary).toContainText("Örnek elden tahsilat");
  await expect(summary).toContainText("bakiye değişmedi");
  await dialog
    .getByRole("textbox", { name: "Açıklama", exact: true })
    .fill("Düzeltilen açıklama");
  await expect(summary).toHaveCount(0);
  await dialog
    .getByRole("button", { name: "Tahsilat taslağını incele" })
    .click();
  await dialog.getByRole("checkbox").first().uncheck();
  await expect(summary).toHaveCount(0);
  await page.keyboard.press("Escape");
  expect(await balances.innerText()).toBe(before);
});

test("collection rejects nonpositive amounts and flags excess without calculating credit", async ({
  page,
}) => {
  await page.goto("/finans");
  await page
    .getByRole("button", { name: "Tahsilat tasarımını aç", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Manuel tahsilat taslağı",
    exact: true,
  });
  await dialog.getByRole("checkbox").first().check();
  const amount = dialog.getByLabel("Tahsilat tutarı (TRY)", { exact: true });
  await amount.fill("0,00");
  await dialog
    .getByLabel("Tahsilat zamanı (Europe/Istanbul)", { exact: true })
    .fill("2026-10-24T14:30");
  await dialog
    .getByRole("button", { name: "Tahsilat taslağını incele" })
    .click();
  await expect(dialog.getByRole("alert")).toContainText("Sıfırdan büyük");
  await expect(amount).toBeFocused();
  await amount.fill("900,01");
  await expect(
    dialog.getByText("Tutar, seçili örnek borç toplamından fazla.", {
      exact: true,
    }),
  ).toBeVisible();
  await dialog
    .getByRole("button", { name: "Tahsilat taslağını incele" })
    .click();
  await expect(dialog.getByRole("status")).toContainText("₺900,01");
  await expect(dialog.getByRole("status")).toContainText(
    "varsa alacak sonucu sunucudan",
  );
});

test("zero-debt example explains the limited collection path", async ({
  page,
}) => {
  await page.goto("/finans");
  await page
    .getByRole("row", { name: /Deniz Kaya/ })
    .getByRole("button")
    .click();
  await page
    .getByRole("button", { name: "Tahsilat tasarımını aç", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Manuel tahsilat taslağı",
    exact: true,
  });
  await expect(dialog).toContainText("Bu örnekte seçilecek açık borç yok.");
  await expect(
    dialog.getByRole("button", { name: "Tahsilat taslağını incele" }),
  ).toHaveCount(0);
});

test("sale and collection drafts fit narrow RTL", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/paketler");
  await page.getByRole("button", { name: "RTL denemesi" }).click();
  await page
    .getByRole("button", { name: "Satış tasarımını incele", exact: true })
    .click();
  const sale = page.getByRole("dialog", {
    name: "Paket satış taslağı",
    exact: true,
  });
  expect(await sale.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
    true,
  );
  await page.keyboard.press("Escape");
  await page.goto("/finans");
  await page.getByRole("button", { name: "RTL denemesi" }).click();
  await page
    .getByRole("button", { name: "Tahsilat tasarımını aç", exact: true })
    .click();
  const collection = page.getByRole("dialog", {
    name: "Manuel tahsilat taslağı",
    exact: true,
  });
  expect(
    await collection.evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
});
