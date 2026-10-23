import { test, expect } from "@playwright/test";

test("brand and personal appearance reset independently without persistence", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Marka ve görünüm", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "Marka ve görünüm" });
  await dialog.getByLabel("Renk paketi", { exact: true }).selectOption("sahne");
  await dialog
    .getByLabel("Font paketi", { exact: true })
    .selectOption("editorial");
  await dialog.getByLabel("Görünüm", { exact: true }).selectOption("light");
  await dialog
    .getByRole("button", { name: "Markayı başlangıca döndür" })
    .click();
  await expect(page.locator(".preview")).toHaveAttribute(
    "data-direction",
    "akis",
  );
  await expect(page.locator(".preview")).toHaveAttribute(
    "data-font",
    "balanced",
  );
  await expect(page.locator(".preview")).toHaveAttribute(
    "data-appearance",
    "light",
  );
  await dialog
    .getByLabel("Renk paketi", { exact: true })
    .selectOption("atolye");
  await dialog
    .getByLabel("Font paketi", { exact: true })
    .selectOption("humanist");
  await dialog
    .getByRole("button", { name: "Görünümü başlangıca döndür" })
    .click();
  await expect(page.locator(".preview")).toHaveAttribute(
    "data-direction",
    "atolye",
  );
  await expect(page.locator(".preview")).toHaveAttribute(
    "data-font",
    "humanist",
  );
  await expect(page.locator(".preview")).toHaveAttribute(
    "data-appearance",
    "dark",
  );
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Marka ve görünüm", exact: true }),
  ).toBeFocused();
  await page.reload();
  await expect(page.locator(".preview")).toHaveAttribute(
    "data-direction",
    "akis",
  );
  await expect(page.locator(".preview")).toHaveAttribute(
    "data-font",
    "balanced",
  );
});

test("palette contrast and system status colors hold across light and dark", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Marka ve görünüm", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "Marka ve görünüm" });
  const statusByMode = new Map<string, string>();
  for (const mode of ["dark", "light"]) {
    await dialog.getByLabel("Görünüm", { exact: true }).selectOption(mode);
    for (const palette of ["akis", "sahne", "atolye"]) {
      await dialog
        .getByLabel("Renk paketi", { exact: true })
        .selectOption(palette);
      const result = await page.locator(".preview").evaluate((element) => {
        const css = getComputedStyle(element);
        const value = (token: string) => css.getPropertyValue(token).trim();
        const luminance = (hex: string) => {
          const rgb = hex
            .replace("#", "")
            .match(/../g)!
            .map((part) => parseInt(part, 16) / 255)
            .map((c) =>
              c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
            );
          return rgb[0]! * 0.2126 + rgb[1]! * 0.7152 + rgb[2]! * 0.0722;
        };
        const contrast = (a: string, b: string) => {
          const l = [luminance(value(a)), luminance(value(b))].sort(
            (x, y) => y - x,
          );
          return (l[0]! + 0.05) / (l[1]! + 0.05);
        };
        return {
          text: ["--bg", "--surface", "--wash", "--elevated"].flatMap((bg) =>
            ["--text", "--muted", "--accent"].map((fg) => contrast(fg, bg)),
          ),
          button: contrast("--accent-text", "--accent"),
          focus: ["--bg", "--surface", "--wash"].map((bg) =>
            contrast("--focus", bg),
          ),
          status: [
            "--status-success",
            "--status-warning",
            "--status-error",
            "--status-info",
          ].map((fg) => contrast(fg, "--surface")),
          statusColors: [
            "--status-success",
            "--status-warning",
            "--status-error",
            "--status-info",
            "--focus",
          ]
            .map(value)
            .join(","),
        };
      });
      for (const ratio of [...result.text, result.button, ...result.status])
        expect(
          ratio,
          `${palette}/${mode} text contrast`,
        ).toBeGreaterThanOrEqual(4.5);
      for (const ratio of result.focus)
        expect(
          ratio,
          `${palette}/${mode} focus contrast`,
        ).toBeGreaterThanOrEqual(3);
      if (!statusByMode.has(mode)) statusByMode.set(mode, result.statusColors);
      expect(result.statusColors).toBe(statusByMode.get(mode));
    }
  }
});

test("system appearance follows device changes and font choice fits mobile RTL", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.getByRole("button", { name: "RTL denemesi" }).click();
  await page
    .getByRole("button", { name: "Marka ve görünüm", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "Marka ve görünüm" });
  await dialog.getByLabel("Görünüm", { exact: true }).selectOption("system");
  const scheme = () =>
    page
      .locator(".preview")
      .evaluate((element) => getComputedStyle(element).colorScheme);
  expect(await scheme()).toBe("light");
  await page.emulateMedia({ colorScheme: "dark" });
  expect(await scheme()).toBe("dark");
  for (const font of ["balanced", "editorial", "humanist"]) {
    await dialog.getByLabel("Font paketi", { exact: true }).selectOption(font);
    expect(
      await dialog.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
  }
  expect(
    await dialog.evaluate((element) => getComputedStyle(element).direction),
  ).toBe("rtl");
  await dialog.getByRole("button", { name: "Programda gör" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
