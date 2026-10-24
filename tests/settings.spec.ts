import { test, expect } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`settings separate brand and personal previews at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/ayarlar");
    const scope = page.getByRole("group", { name: "Ayar kapsamı" });
    const preview = page.locator(".preview");
    await page
      .getByRole("button", { name: "Marka paketlerini dene", exact: true })
      .click();
    const brand = page.getByRole("dialog", {
      name: "Marka paketlerini dene",
      exact: true,
    });
    await expect(brand.getByLabel("Görünüm", { exact: true })).toHaveCount(0);
    await brand.getByLabel("Renk paketi").selectOption("sahne");
    await brand.getByLabel("Font paketi").selectOption("editorial");
    await brand.getByRole("button", { name: "Ekranda gör" }).click();
    await expect(preview).toHaveAttribute("data-direction", "sahne");
    await expect(
      page.getByRole("region", { name: "Organizasyon ayarları" }),
    ).toContainText("Sahne");
    await scope.getByRole("button", { name: "Kişisel", exact: true }).click();
    await page
      .getByRole("button", { name: "Kişisel görünümü dene", exact: true })
      .click();
    const personal = page.getByRole("dialog", {
      name: "Kişisel görünümü dene",
      exact: true,
    });
    await expect(personal.getByLabel("Renk paketi")).toHaveCount(0);
    await personal.getByLabel("Görünüm", { exact: true }).selectOption("light");
    await personal.getByRole("button", { name: "Ekranda gör" }).click();
    await expect(preview).toHaveAttribute("data-direction", "sahne");
    await expect(preview).toHaveAttribute("data-font", "editorial");
    await expect(preview).toHaveAttribute("data-appearance", "light");
    await page
      .getByRole("button", { name: "Marka ve görünüm", exact: true })
      .click();
    const all = page.getByRole("dialog", {
      name: "Marka ve görünüm",
      exact: true,
    });
    await expect(all.getByLabel("Görünüm", { exact: true })).toHaveValue(
      "light",
    );
    await all
      .getByRole("button", { name: "Markayı başlangıca döndür" })
      .click();
    await expect(all.getByLabel("Görünüm", { exact: true })).toHaveValue(
      "light",
    );
    await page.keyboard.press("Escape");
    const duplicateIds = await page.locator("[id]").evaluateAll((elements) => {
      const ids = elements.map((el) => el.id);
      return ids.filter((id, index) => ids.indexOf(id) !== index);
    });
    expect(duplicateIds).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  });
}

test("profile draft validates, reviews and resets without changing the account", async ({
  page,
}) => {
  await page.goto("/ayarlar");
  await page
    .getByRole("group", { name: "Ayar kapsamı" })
    .getByRole("button", { name: "Kişisel", exact: true })
    .click();
  const opener = page.getByRole("button", { name: "Görünen adı düzenle" });
  await opener.click();
  const dialog = page.getByRole("dialog", {
    name: "Profil adı taslağı",
    exact: true,
  });
  const input = dialog.getByRole("textbox", {
    name: "Görünen ad",
    exact: true,
  });
  await expect(
    dialog.getByRole("button", { name: "Değişikliği incele" }),
  ).toBeDisabled();
  await input.fill("   ");
  await dialog.getByRole("button", { name: "Değişikliği incele" }).click();
  await expect(input).toBeFocused();
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(dialog.getByRole("alert")).toContainText("boş olamaz");
  await input.fill("Yeni örnek ad");
  await dialog.getByRole("button", { name: "Değişikliği incele" }).click();
  await expect(dialog.getByRole("status")).toBeFocused();
  await expect(dialog.getByRole("status")).toContainText("Yeni örnek ad");
  await expect(dialog.getByRole("status")).toContainText(
    "gerçek kayıt yapılmadı",
  );
  await dialog.getByRole("button", { name: "Taslağı geri al" }).click();
  await expect(input).toHaveValue("Örnek yönetici");
  await expect(dialog.getByRole("status")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
  await expect(
    page.getByRole("region", { name: "Kişisel ayarları" }),
  ).toContainText("Örnek yönetici");
});

test("center scope explains business time and navigates to existing screens", async ({
  page,
}) => {
  await page.goto("/ayarlar");
  await page
    .getByRole("group", { name: "Ayar kapsamı" })
    .getByRole("button", { name: "Merkez", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Merkez ayarları" }),
  ).toContainText("Europe/Istanbul");
  await expect(
    page.getByRole("complementary", { name: "Ayarın etki alanı" }),
  ).toContainText("iş zamanı");
  await page.getByRole("link", { name: "Merkez takvimini aç" }).click();
  await expect(page).toHaveURL(/\/takvim$/);
});

test("personal settings and scoped appearance fit narrow RTL", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/ayarlar");
  await page.getByRole("button", { name: "RTL denemesi" }).click();
  await page
    .getByRole("group", { name: "Ayar kapsamı" })
    .getByRole("button", { name: "Kişisel", exact: true })
    .click();
  await page.getByText("İletişim değişirse ne olur?", { exact: true }).click();
  await expect(
    page.getByText(/Yeni e-posta veya telefon doğrulanana kadar/),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Kişisel görünümü dene", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Kişisel görünümü dene",
    exact: true,
  });
  expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
    true,
  );
  await page.keyboard.press("Escape");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
