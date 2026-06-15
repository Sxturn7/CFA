import React, { useState, useEffect } from "react";
import { X, Sparkles, Palette, Check, RefreshCw, Layout, Smartphone } from "lucide-react";
import { AppTheme, THEME_PRESETS, applyTheme } from "../theme";

interface DesignCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
}

export default function DesignCustomizer({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
}: DesignCustomizerProps) {
  // Temporary dynamic state for the custom design options
  const [customAccent, setCustomAccent] = useState<string>(currentTheme.accent);
  const [customBg, setCustomBg] = useState<string>(currentTheme.bg);
  const [customCard, setCustomCard] = useState<string>(currentTheme.card);
  const [customText, setCustomText] = useState<string>(currentTheme.textMain);
  const [customTextDark, setCustomTextDark] = useState<string>(currentTheme.textDark);

  useEffect(() => {
    if (currentTheme.preset !== "custom") {
      setCustomAccent(currentTheme.accent);
      setCustomBg(currentTheme.bg);
      setCustomCard(currentTheme.card);
      setCustomText(currentTheme.textMain);
      setCustomTextDark(currentTheme.textDark);
    }
  }, [currentTheme]);

  if (!isOpen) return null;

  const handleSelectPreset = (presetKey: keyof typeof THEME_PRESETS) => {
    const selected = THEME_PRESETS[presetKey];
    onThemeChange(selected);
  };

  const handleCustomAccentChange = (hex: string) => {
    setCustomAccent(hex);
    triggerCustomThemeUpdate({ accent: hex });
  };

  const handleCustomBgTemplate = (base: "slate" | "warm" | "light" | "paper") => {
    let bg = "#FDFCF8";
    let card = "#F9F8F0";
    let border = "#E5E2D0";
    let beige = "#F1EFE0";
    let beigeDark = "#D9D5C3";
    let textMain = "#3D3B30";
    let textDark = "#4A3728";

    if (base === "slate") {
      bg = "#0B0F19";
      card = "#111827";
      border = "#1F2937";
      beige = "#1F2937";
      beigeDark = "#374151";
      textMain = "#D1D5DB";
      textDark = "#F3F4F6";
    } else if (base === "light") {
      bg = "#F3F4F6";
      card = "#FFFFFF";
      border = "#E5E7EB";
      beige = "#F9FAFB";
      beigeDark = "#D1D5DB";
      textMain = "#1F2937";
      textDark = "#111827";
    } else if (base === "paper") {
      bg = "#FFFFFF";
      card = "#FAFBFD";
      border = "#E2E8F0";
      beige = "#F1F5F9";
      beigeDark = "#CBD5E1";
      textMain = "#334155";
      textDark = "#0F172A";
    }

    setCustomBg(bg);
    setCustomCard(card);
    setCustomText(textMain);
    setCustomTextDark(textDark);

    triggerCustomThemeUpdate({
      bg,
      card,
      border,
      beige,
      beigeDark,
      textMain,
      textDark,
      headerBg: bg === "#0B0F19" ? "rgba(11, 15, 25, 0.85)" : `rgba(${hexToRgb(bg)}, 0.75)`,
      inputBg: bg === "#0B0F19" ? "#1F2937" : "#FFFFFF",
    });
  };

  function hexToRgb(hex: string): string {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const cleanHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "253, 252, 248";
  }

  const triggerCustomThemeUpdate = (overrides: Partial<AppTheme>) => {
    // Generate a full custom theme based on overrides and current values
    const updatedTheme: AppTheme = {
      preset: "custom",
      accent: overrides.accent ?? customAccent,
      accentHover: darkenColor(overrides.accent ?? customAccent),
      accentLight: hexToRgba(overrides.accent ?? customAccent, 0.15),
      bg: overrides.bg ?? customBg,
      card: overrides.card ?? customCard,
      border: overrides.border ?? (customBg === "#0B0F19" ? "#1F2937" : "#E5E2D0"),
      beige: overrides.beige ?? (customBg === "#0B0F19" ? "#1F2937" : "#F1EFE0"),
      beigeDark: overrides.beigeDark ?? (customBg === "#0B0F19" ? "#374151" : "#D9D5C3"),
      textMain: overrides.textMain ?? customText,
      textDark: overrides.textDark ?? customTextDark,
      headerBg: overrides.headerBg ?? (customBg === "#0B0F19" ? "rgba(11, 15, 25, 0.85)" : "rgba(255, 255, 255, 0.7)"),
      inputBg: overrides.inputBg ?? (customBg === "#0B0F19" ? "#1F2937" : "#ffffff"),
    };
    onThemeChange(updatedTheme);
  };

  function darkenColor(hex: string): string {
    // Basic color darken fallback for hover state
    try {
      const rgb = hexToRgb(hex).split(",").map((x) => Math.max(0, parseInt(x.trim(), 10) - 25));
      return `#${rgb.map((x) => x.toString(16).padStart(2, "0")).join("")}`;
    } catch {
      return hex;
    }
  }

  function hexToRgba(hex: string, alpha: number): string {
    return `rgba(${hexToRgb(hex)}, ${alpha})`;
  }

  return (
    <>
      {/* Overlay Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-all"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-sm bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-slideIn">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-850 rounded-lg text-amber-500">
              <Palette size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-serif">Runway Design Studio</h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Completely customize colors, ambiance, & accents
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Preset Theme Selector */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              🎨 PRESET FLIGHT SHADES
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset("sage")}
                className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between h-20 ${
                  currentTheme.preset === "sage"
                    ? "border-[#5A6344] bg-[#5A6344]/5 text-slate-100"
                    : "border-slate-800 bg-slate-950 hover:border-slate-700"
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-xs font-bold font-serif text-[#5A6344]">Sage Garden</span>
                  {currentTheme.preset === "sage" && <Check size={12} className="text-[#5A6344]" />}
                </div>
                <div className="flex gap-1 items-center mt-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#5A6344] border border-white/20 inline-block" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FDFCF8] border border-slate-700 inline-block" />
                  <span className="text-[9px] text-slate-500 font-mono">Organic</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset("oxford")}
                className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between h-20 ${
                  currentTheme.preset === "oxford"
                    ? "border-blue-500 bg-blue-950/10 text-slate-100"
                    : "border-slate-800 bg-slate-950 hover:border-slate-700"
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-xs font-bold font-serif text-[#1b365d]">Oxford Navy</span>
                  {currentTheme.preset === "oxford" && <Check size={12} className="text-blue-500" />}
                </div>
                <div className="flex gap-1 items-center mt-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#1b365d] border border-white/20 inline-block" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FAF9F5] border border-slate-700 inline-block" />
                  <span className="text-[9px] text-slate-500 font-mono">Academic</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset("crimson")}
                className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between h-20 ${
                  currentTheme.preset === "crimson"
                    ? "border-rose-500 bg-rose-950/10 text-slate-100"
                    : "border-slate-800 bg-slate-950 hover:border-slate-700"
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-xs font-bold font-serif text-[#9E2A2B]">Editorial Red</span>
                  {currentTheme.preset === "crimson" && <Check size={12} className="text-rose-500" />}
                </div>
                <div className="flex gap-1 items-center mt-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#9E2A2B] border border-white/20 inline-block" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FDFDFD] border border-slate-700 inline-block" />
                  <span className="text-[9px] text-slate-500 font-mono">Wealth</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset("midnight")}
                className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between h-20 ${
                  currentTheme.preset === "midnight"
                    ? "border-emerald-500 bg-emerald-950/10 text-slate-100"
                    : "border-slate-800 bg-slate-950 hover:border-slate-700"
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-xs font-bold font-mono text-[#10B981]">Midnight Dark</span>
                  {currentTheme.preset === "midnight" && <Check size={12} className="text-emerald-500" />}
                </div>
                <div className="flex gap-1 items-center mt-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#10B981] border border-white/20 inline-block" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#0B0F19] border border-slate-700 inline-block" />
                  <span className="text-[9px] text-slate-500 font-mono">Sleek</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset("nordic")}
                className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between h-20 ${
                  currentTheme.preset === "nordic"
                    ? "border-slate-400 bg-slate-800/10 text-slate-100"
                    : "border-slate-800 bg-slate-950 hover:border-slate-700"
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-xs font-bold font-sans text-slate-400">Nordic Cool</span>
                  {currentTheme.preset === "nordic" && <Check size={12} className="text-slate-400" />}
                </div>
                <div className="flex gap-1 items-center mt-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#4B5563] border border-white/20 inline-block" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#F3F4F6] border border-slate-700 inline-block" />
                  <span className="text-[9px] text-slate-500 font-mono">Minimalist</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerCustomThemeUpdate({});
                }}
                className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between h-20 ${
                  currentTheme.preset === "custom"
                    ? "border-amber-400 bg-amber-950/10 text-slate-100"
                    : "border-slate-800 bg-slate-950 hover:border-slate-700"
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                    <Sparkles size={11} className="animate-spin" /> Custom Canvas
                  </span>
                  {currentTheme.preset === "custom" && <Check size={12} className="text-amber-400" />}
                </div>
                <div className="flex gap-1 items-center mt-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-rose-500 via-amber-400 to-sky-400 border border-white/20 inline-block" stroke="none" />
                  <span className="text-[9px] text-amber-500 font-mono">Create your own</span>
                </div>
              </button>
            </div>
          </div>

          {/* Color & Accent fine-tuning settings panel */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-[11px] font-bold font-mono text-slate-400 uppercase tracking-wider">
              ⚙️ DEEP DESIGN CUSTOMIZATION
            </h4>

            {/* Custom Accent Picker */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-300">Primary Accent Spotlight Color</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">{customAccent}</span>
              </div>
              <div className="flex gap-3 items-center bg-slate-950/40 p-2.5 rounded-xl border border-slate-850">
                <input
                  type="color"
                  value={customAccent}
                  onChange={(e) => handleCustomAccentChange(e.target.value)}
                  className="w-10 h-10 rounded border-none cursor-pointer outline-none bg-transparent flex-shrink-0"
                />
                <div className="text-[11px] text-slate-400 font-sans">
                  Instantly changes buttons, progress indicators, achievements highlights, and menu selections.
                </div>
              </div>
            </div>

            {/* Background Style Presets */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">Background Canvas Atmosphere</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleCustomBgTemplate("warm")}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition flex items-center gap-1.5 justify-center ${
                    customBg === "#FDFCF8"
                      ? "border-amber-400/60 bg-amber-950/10 text-slate-200"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  🌾 Warm Cream
                </button>
                <button
                  type="button"
                  onClick={() => handleCustomBgTemplate("slate")}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition flex items-center gap-1.5 justify-center ${
                    customBg === "#0B0F19"
                      ? "border-emerald-500/60 bg-emerald-950/10 text-slate-200"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  🌌 Slate Midnight
                </button>
                <button
                  type="button"
                  onClick={() => handleCustomBgTemplate("light")}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition flex items-center gap-1.5 justify-center ${
                    customBg === "#F3F4F6"
                      ? "border-slate-400/60 bg-slate-800/10 text-slate-200"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  ❄️ Cool Silver
                </button>
                <button
                  type="button"
                  onClick={() => handleCustomBgTemplate("paper")}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition flex items-center gap-1.5 justify-center ${
                    customBg === "#FFFFFF"
                      ? "border-slate-400/60 bg-slate-800/10 text-slate-200"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  📄 Paper White
                </button>
              </div>
            </div>

            {/* Quick Palette Recommendations */}
            <div className="space-y-2 pt-2 bg-slate-950/20 p-3 rounded-xl border border-slate-850/40">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Pro Designer Accent Presets</span>
              <div className="flex gap-2">
                {["#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#EF4444"].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleCustomAccentChange(color)}
                    style={{ backgroundColor: color }}
                    className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 active:scale-95 transition"
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex gap-2 font-sans">
          <button
            type="button"
            onClick={() => handleSelectPreset("sage")}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 px-3 rounded-lg transition text-center flex items-center justify-center gap-1"
          >
            <RefreshCw size={12} /> Reset to Organic Sage
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#5A6344] hover:bg-opacity-90 text-white text-xs py-2 px-4 rounded-lg transition"
          >
            Apply Design
          </button>
        </div>
      </div>
    </>
  );
}
