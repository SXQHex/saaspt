// Local design catalog, not a published backend enum or organization setting.
export const palettes = {
  akis: {
    name: "Akış",
    description: "Gece mavisi ve açık mavi.",
    light: {
      bg: "#f3f7fc",
      surface: "#ffffff",
      elevated: "#e8eff9",
      line: "#b8c7db",
      text: "#18283b",
      muted: "#4c6079",
      accent: "#244f85",
      accentText: "#ffffff",
      wash: "#dfebfa",
    },
  },
  sahne: {
    name: "Sahne",
    description: "Mürdüm ve şampanya.",
    light: {
      bg: "#f9f5fa",
      surface: "#ffffff",
      elevated: "#eee6f0",
      line: "#cab9cf",
      text: "#302238",
      muted: "#6b5273",
      accent: "#70501c",
      accentText: "#ffffff",
      wash: "#f2e6cb",
    },
  },
  atolye: {
    name: "Atölye",
    description: "Petrol ve kayısı.",
    light: {
      bg: "#f1f8f5",
      surface: "#ffffff",
      elevated: "#e0eee7",
      line: "#b1ccc1",
      text: "#19352c",
      muted: "#45685a",
      accent: "#854328",
      accentText: "#ffffff",
      wash: "#f9e4d8",
    },
  },
} as const;
export const fontPackages = {
  balanced: { name: "Dengeli", description: "Başlık ve gövdede sade sans." },
  editorial: {
    name: "Editoryal",
    description: "Serif başlık, sade sans gövde.",
  },
  humanist: {
    name: "Yumuşak",
    description: "Başlık ve gövdede hümanist sans.",
  },
} as const;
export type Palette = keyof typeof palettes;
export type FontPackage = keyof typeof fontPackages;
export type Appearance = "dark" | "light" | "system";
