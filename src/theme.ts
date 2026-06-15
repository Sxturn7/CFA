export interface AppTheme {
  preset: "sage" | "oxford" | "crimson" | "midnight" | "nordic" | "custom";
  accent: string;
  accentHover: string;
  accentLight: string;
  bg: string;
  card: string;
  border: string;
  beige: string;
  beigeDark: string;
  textMain: string;
  textDark: string;
  headerBg: string;
  inputBg: string;
}

export const THEME_PRESETS: Record<Exclude<AppTheme["preset"], "custom">, AppTheme> = {
  sage: {
    preset: "sage",
    accent: "#5A6344",
    accentHover: "#4a5137",
    accentLight: "rgba(163, 177, 138, 0.3)",
    bg: "#FDFCF8",
    card: "#F9F8F0",
    border: "#E5E2D0",
    beige: "#F1EFE0",
    beigeDark: "#D9D5C3",
    textMain: "#3D3B30",
    textDark: "#4A3728",
    headerBg: "rgba(253, 252, 248, 0.7)",
    inputBg: "#ffffff",
  },
  oxford: {
    preset: "oxford",
    accent: "#1b365d",
    accentHover: "#112240",
    accentLight: "rgba(27, 54, 93, 0.15)",
    bg: "#FAF9F5",
    card: "#F4F1E8",
    border: "#DFD7C4",
    beige: "#ECE7D5",
    beigeDark: "#D5CBAC",
    textMain: "#22252A",
    textDark: "#0F141C",
    headerBg: "rgba(250, 249, 245, 0.72)",
    inputBg: "#ffffff",
  },
  crimson: {
    preset: "crimson",
    accent: "#9E2A2B",
    accentHover: "#6E1E1F",
    accentLight: "rgba(158, 42, 43, 0.12)",
    bg: "#FDFDFD",
    card: "#F5F5F7",
    border: "#E4E4E7",
    beige: "#FAFAFA",
    beigeDark: "#D4D4D8",
    textMain: "#1E293B",
    textDark: "#0F172A",
    headerBg: "rgba(253, 253, 253, 0.8)",
    inputBg: "#ffffff",
  },
  midnight: {
    preset: "midnight",
    accent: "#10B981", // Emerald highlight
    accentHover: "#059669",
    accentLight: "rgba(16, 185, 129, 0.2)",
    bg: "#0B0F19",
    card: "#111827",
    border: "#1F2937",
    beige: "#1F2937",
    beigeDark: "#374151",
    textMain: "#D1D5DB",
    textDark: "#F3F4F6",
    headerBg: "rgba(11, 15, 25, 0.85)",
    inputBg: "#1F2937",
  },
  nordic: {
    preset: "nordic",
    accent: "#4B5563",
    accentHover: "#374151",
    accentLight: "rgba(75, 85, 99, 0.15)",
    bg: "#F3F4F6",
    card: "#FFFFFF",
    border: "#E5E7EB",
    beige: "#F9FAFB",
    beigeDark: "#D1D5DB",
    textMain: "#1F2937",
    textDark: "#111827",
    headerBg: "rgba(243, 244, 246, 0.75)",
    inputBg: "#FFFFFF",
  }
};

export function applyTheme(theme: AppTheme) {
  const root = document.documentElement;
  root.style.setProperty("--theme-bg", theme.bg);
  root.style.setProperty("--theme-card", theme.card);
  root.style.setProperty("--theme-border", theme.border);
  root.style.setProperty("--theme-beige", theme.beige);
  root.style.setProperty("--theme-beige-dark", theme.beigeDark);
  root.style.setProperty("--theme-text-main", theme.textMain);
  root.style.setProperty("--theme-text-dark", theme.textDark);
  root.style.setProperty("--theme-accent", theme.accent);
  root.style.setProperty("--theme-accent-hover", theme.accentHover);
  root.style.setProperty("--theme-accent-light", theme.accentLight);
  root.style.setProperty("--theme-header-bg", theme.headerBg);
  root.style.setProperty("--theme-input-bg", theme.inputBg);
}
