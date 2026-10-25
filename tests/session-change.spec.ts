import { test, expect } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`session change reviews values and series scope without changing the lesson at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/takvim");
    await page
      .getByRole("button", { name: "Ders değişikliğini tasarla", exact: true })
      .click();
    const dialog = page.getByRole("dialog", {
      name: "Ders değişikliği taslağı",
      exact: true,
    });
    const submit = dialog.getByRole("button", {
      name: "Değişiklik özetini incele",
    });
    await expect(submit).toBeDisabled();
    await dialog.getByLabel("Başlangıç saati", { exact: true }).fill("18:00");
    await dialog.getByLabel("Bitiş saati", { exact: true }).fill("19:00");
    await dialog.getByLabel("Örnek salon", { exact: true }).selectOption("B");
    await dialog.getByRole("radio", { name: /Bu ve sonraki dersler/ }).check();
    await expect(submit).toBeDisabled();
    await dialog
      .getByRole("textbox", { name: "Değişiklik gerekçesi" })
      .fill("Örnek salon ve saat düzenlemesi");
    await submit.click();
    const summary = dialog.getByRole("status");
    await expect(summary).toBeFocused();
    await expect(summary.getByRole("row", { name: /Salon/ })).toContainText(
      "Salon A",
    );
    await expect(summary.getByRole("row", { name: /Salon/ })).toContainText(
      "Salon B",
    );
    await expect(summary).toContainText("Bu ve sonraki dersler");
    await expect(summary).toContainText("Canlı etki önizlemesi bekleniyor.");
    await expect(summary).toContainText("Gerçek değişiklik yapılmadı.");
    expect(
      await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
    await dialog
      .getByRole("button", { name: "Değişiklikleri geri al" })
      .click();
    await expect(summary).toHaveCount(0);
    await expect(
      dialog.getByLabel("Başlangıç saati", { exact: true }),
    ).toHaveValue("17:00");
    await expect(submit).toBeDisabled();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("complementary", { name: "Seans ayrıntısı" }),
    ).toContainText("17:00–18:00");
  });
}

test("session time validation allows a next-day end without normalizing it", async ({
  page,
}) => {
  await page.goto("/takvim");
  await page
    .getByRole("button", { name: "Ders değişikliğini tasarla", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Ders değişikliği taslağı",
    exact: true,
  });
  await dialog.getByLabel("Başlangıç saati", { exact: true }).fill("23:00");
  await dialog.getByLabel("Bitiş saati", { exact: true }).fill("01:00");
  await dialog
    .getByRole("textbox", { name: "Değişiklik gerekçesi" })
    .fill("Örnek gece programı");
  await dialog
    .getByRole("button", { name: "Değişiklik özetini incele" })
    .click();
  await expect(dialog.getByRole("alert")).toContainText(
    "bitiş tarihini ilerlet",
  );
  await expect(
    dialog.getByLabel("Bitiş tarihi", { exact: true }),
  ).toBeFocused();
  await dialog.getByLabel("Bitiş tarihi", { exact: true }).fill("2026-10-24");
  await dialog
    .getByRole("button", { name: "Değişiklik özetini incele" })
    .click();
  await expect(dialog.getByRole("status")).toContainText("24 Ekim 2026 01:00");
});

test("standalone lessons disable series scope and capacity editing waits for the contract", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Güç ve denge/ }).click();
  await page
    .getByRole("button", { name: "Ders değişikliğini tasarla", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Ders değişikliği taslağı",
    exact: true,
  });
  await expect(
    dialog.getByRole("radio", { name: /Bu ve sonraki dersler/ }),
  ).toBeDisabled();
  await expect(dialog.getByRole("spinbutton")).toHaveCount(0);
  await expect(
    dialog.getByLabel("Yeni kapasite modeli örnekleri"),
  ).toContainText("50 kişi");
  await expect(
    dialog.getByLabel("Yeni kapasite modeli örnekleri"),
  ).toContainText("10 erkek + 10 kadın");
  await dialog.getByLabel("Örnek salon", { exact: true }).selectOption("A");
  await dialog
    .getByRole("textbox", { name: "Değişiklik gerekçesi" })
    .fill("Örnek salon değişikliği");
  await dialog
    .getByRole("button", { name: "Değişiklik özetini incele" })
    .click();
  await expect(dialog.getByRole("status")).toContainText("Yalnız bu ders");
  await expect(dialog.getByRole("status")).toContainText(
    "Gerçek değişiklik yapılmadı",
  );
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("complementary", { name: "Ders ayrıntısı" }),
  ).toContainText("10 / 10");
});

test("changing proposal invalidates review and changing lesson clears its draft", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/takvim");
  await page.getByRole("button", { name: "RTL denemesi" }).click();
  await page
    .getByRole("button", { name: "Ders değişikliğini tasarla", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Ders değişikliği taslağı",
    exact: true,
  });
  await dialog.getByLabel("Örnek salon", { exact: true }).selectOption("B");
  await dialog
    .getByRole("textbox", { name: "Değişiklik gerekçesi" })
    .fill("Örnek salon düzenlemesi");
  await dialog
    .getByRole("button", { name: "Değişiklik özetini incele" })
    .click();
  expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
    true,
  );
  await dialog
    .getByRole("textbox", { name: "Değişiklik gerekçesi" })
    .fill("Yeni gerekçe");
  await expect(dialog.getByRole("status")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Ders listesine dön" }).click();
  await page.locator(".agenda-row").filter({ hasText: "Güç ve denge" }).click();
  await page
    .getByRole("button", { name: "Ders değişikliğini tasarla", exact: true })
    .click();
  await expect(
    dialog.getByRole("textbox", { name: "Değişiklik gerekçesi" }),
  ).toHaveValue("");
  await expect(dialog.getByLabel("Örnek salon", { exact: true })).toHaveValue(
    "B",
  );
});
