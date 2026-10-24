"use client";

import { createContext, use } from "react";
import type { Palette, FontPackage, Appearance } from "./theme-config";

export type AppearancePreview = {
  palette: Palette;
  font: FontPackage;
  appearance: Appearance;
  onPaletteChange: (value: Palette) => void;
  onFontChange: (value: FontPackage) => void;
  onAppearanceChange: (value: Appearance) => void;
};

export const AppearancePreviewContext = createContext<AppearancePreview | null>(
  null,
);

export function useAppearancePreview() {
  const value = use(AppearancePreviewContext);
  if (!value) throw new Error("Appearance preview requires AppShell");
  return value;
}
