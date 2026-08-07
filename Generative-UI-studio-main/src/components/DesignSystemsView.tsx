import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Check,
  Copy,
  Code2,
  Type,
  Layout,
  Sliders,
  SlidersHorizontal,
  Wand2,
  Layers,
  Sun,
  Moon,
  Feather,
  Box,
  CornerDownRight,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { motion } from 'motion/react';
import { ThemeConfig } from '../types';
import { getThemeStyles } from '../utils/themeUtils';

export interface DesignSystemsViewProps {
  onApplyThemeToActive?: (themeConfig: ThemeConfig) => void;
  onGenerateWithTheme?: (prompt: string, themeConfig: ThemeConfig) => void;
  currentSchemaTitle?: string;
  activeAppTheme?: ThemeConfig;
}

// Preset Theme Options
interface PresetSystem {
  id: string;
  name: string;
  description: string;
  badge: string;
  config: ThemeConfig;
  colors: {
    bg: string;
    surface: string;
    primary: string;
    border: string;
    text: string;
  };
}

const PRESET_SYSTEMS: PresetSystem[] = [
  {
    id: 'emerald_saas',
    name: 'Emerald SaaS Clean',
    description: 'Vibrant emerald accents, ultra-crisp borders, and balanced whitespace ideal for executive analytics.',
    badge: 'Default System',
    config: {
      accentColor: 'emerald',
      style: 'modern',
      mode: 'light',
      fontFamily: 'Plus Jakarta Sans',
      borderRadius: 'lg',
      primaryHex: '#10b981',
      bgHex: '#fafafa',
      surfaceHex: '#ffffff'
    },
    colors: { bg: '#fafafa', surface: '#ffffff', primary: '#10b981', border: '#e4e4e7', text: '#18181b' }
  },
  {
    id: 'indigo_minimalist',
    name: 'Indigo Minimalist',
    description: 'High-contrast indigo accents with bold typography and crisp border hierarchy.',
    badge: 'Popular',
    config: {
      accentColor: 'indigo',
      style: 'minimal',
      mode: 'slate',
      fontFamily: 'Inter',
      borderRadius: 'md',
      primaryHex: '#4f46e5',
      bgHex: '#f8fafc',
      surfaceHex: '#ffffff'
    },
    colors: { bg: '#f8fafc', surface: '#ffffff', primary: '#4f46e5', border: '#cbd5e1', text: '#0f172a' }
  },
  {
    id: 'slate_tech_dark',
    name: 'Slate Tech Dark',
    description: 'Deep obsidian canvas with high-contrast cyan neon borders for telemetry and dev tools.',
    badge: 'Dark Mode',
    config: {
      accentColor: 'cyan',
      style: 'glass',
      mode: 'dark',
      fontFamily: 'JetBrains Mono',
      borderRadius: 'lg',
      primaryHex: '#06b6d4',
      bgHex: '#090d16',
      surfaceHex: '#111827'
    },
    colors: { bg: '#090d16', surface: '#111827', primary: '#06b6d4', border: '#1f2937', text: '#f9fafb' }
  },
  {
    id: 'corporate_blue',
    name: 'Enterprise Blue',
    description: 'Dense structured grids and authoritative blue tones tailored for corporate financial suites.',
    badge: 'Enterprise',
    config: {
      accentColor: 'sky',
      style: 'dense',
      mode: 'slate',
      fontFamily: 'System UI Sans',
      borderRadius: 'sm',
      primaryHex: '#0284c7',
      bgHex: '#dbe2ef',
      surfaceHex: '#f8fafc'
    },
    colors: { bg: '#dbe2ef', surface: '#f8fafc', primary: '#0284c7', border: '#cbd5e1', text: '#0f172a' }
  },
  {
    id: 'warm_editorial',
    name: 'Warm Editorial Cream',
    description: 'Sophisticated warm neutral canvas with rich terracotta accents and serif typography.',
    badge: 'Editorial',
    config: {
      accentColor: 'coral',
      style: 'modern',
      mode: 'warm',
      fontFamily: 'Playfair Display',
      borderRadius: 'xl',
      primaryHex: '#f97316',
      bgHex: '#f5ede0',
      surfaceHex: '#fffdfa'
    },
    colors: { bg: '#f5ede0', surface: '#fffdfa', primary: '#f97316', border: '#e3d3c1', text: '#2d241e' }
  },
  {
    id: 'royal_violet',
    name: 'Royal Violet Glass',
    description: 'Luminous violet theme with glassmorphic cards and rounded pill controls for AI apps.',
    badge: 'AI Special',
    config: {
      accentColor: 'violet',
      style: 'glass',
      mode: 'light',
      fontFamily: 'Outfit',
      borderRadius: 'full',
      primaryHex: '#8b5cf6',
      bgHex: '#f4f4f5',
      surfaceHex: '#ffffff'
    },
    colors: { bg: '#f4f4f5', surface: '#ffffff', primary: '#8b5cf6', border: '#e4e4e7', text: '#18181b' }
  }
];

const COLOR_OPTIONS = [
  { id: 'emerald', name: 'Emerald Green', hex: '#10b981', bgClass: 'bg-emerald-600', textClass: 'text-emerald-600', ringClass: 'ring-emerald-500', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'indigo', name: 'Indigo Deep', hex: '#4f46e5', bgClass: 'bg-indigo-600', textClass: 'text-indigo-600', ringClass: 'ring-indigo-500', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'violet', name: 'Royal Violet', hex: '#8b5cf6', bgClass: 'bg-violet-600', textClass: 'text-violet-600', ringClass: 'ring-violet-500', badgeClass: 'bg-violet-50 text-violet-700 border-violet-200' },
  { id: 'rose', name: 'Crimson Rose', hex: '#f43f5e', bgClass: 'bg-rose-600', textClass: 'text-rose-600', ringClass: 'ring-rose-500', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: 'cyan', name: 'Cyber Cyan', hex: '#06b6d4', bgClass: 'bg-cyan-500', textClass: 'text-cyan-600', ringClass: 'ring-cyan-400', badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { id: 'sky', name: 'Sky Blue', hex: '#0284c7', bgClass: 'bg-sky-600', textClass: 'text-sky-600', ringClass: 'ring-sky-500', badgeClass: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'amber', name: 'Amber Gold', hex: '#f59e0b', bgClass: 'bg-amber-500', textClass: 'text-amber-600', ringClass: 'ring-amber-400', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'teal', name: 'Electric Teal', hex: '#14b8a6', bgClass: 'bg-teal-600', textClass: 'text-teal-600', ringClass: 'ring-teal-500', badgeClass: 'bg-teal-50 text-teal-700 border-teal-200' },
  { id: 'coral', name: 'Sunset Coral', hex: '#f97316', bgClass: 'bg-orange-500', textClass: 'text-orange-600', ringClass: 'ring-orange-400', badgeClass: 'bg-orange-50 text-orange-700 border-orange-200' }
];

const FONT_OPTIONS = [
  { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans', family: '"Plus Jakarta Sans", sans-serif', desc: 'Modern Clean Sans' },
  { id: 'Inter', label: 'Inter System', family: '"Inter", sans-serif', desc: 'Neutral Technical' },
  { id: 'JetBrains Mono', label: 'JetBrains Mono', family: '"JetBrains Mono", monospace', desc: 'Developer & Code' },
  { id: 'Playfair Display', label: 'Playfair Display', family: '"Playfair Display", serif', desc: 'Editorial Serif' },
  { id: 'Outfit', label: 'Outfit Display', family: '"Outfit", sans-serif', desc: 'SaaS & Mobile' },
  { id: 'Space Grotesk', label: 'Space Grotesk', family: '"Space Grotesk", sans-serif', desc: 'Tech & Web3' }
];

const MODE_OPTIONS = [
  { id: 'light', name: 'Light Crisp', bgHex: '#f4f4f5', cardHex: '#ffffff', borderHex: '#e4e4e7', textHex: '#18181b', desc: 'Pure crisp white on cool gray canvas', icon: Sun },
  { id: 'dark', name: 'Dark Obsidian', bgHex: '#090d16', cardHex: '#111827', borderHex: '#1f2937', textHex: '#f9fafb', desc: 'Deep midnight obsidian canvas', icon: Moon },
  { id: 'warm', name: 'Warm Cream', bgHex: '#f5ede0', cardHex: '#fffdfa', borderHex: '#e3d3c1', textHex: '#2d241e', desc: 'Rich editorial parchment & stone', icon: Feather },
  { id: 'slate', name: 'Slate Executive', bgHex: '#dbe2ef', cardHex: '#f8fafc', borderHex: '#94a3b8', textHex: '#0f172a', desc: 'Cool metallic steel & slate grid', icon: Box }
];

const RADIUS_OPTIONS = [
  { id: 'none', label: 'Sharp (0px)', class: 'rounded-none' },
  { id: 'sm', label: 'Compact (8px)', class: 'rounded-lg' },
  { id: 'lg', label: 'Smooth (16px)', class: 'rounded-2xl' },
  { id: 'full', label: 'Pill (24px)', class: 'rounded-3xl' }
];

const STYLE_OPTIONS = [
  { id: 'modern', label: 'Modern Clean', desc: 'Subtle shadows & balanced padding' },
  { id: 'minimal', label: 'Minimal Stark', desc: 'High contrast crisp hair-lines' },
  { id: 'dense', label: 'Dense Grid', desc: 'Compact metrics for enterprise' },
  { id: 'glass', label: 'Glassmorphism', desc: 'Frosted translucent surfaces' }
];

const SAMPLE_APP_PROMPTS = [
  'Build a Cryptocurrency & Web3 Market Analytics Dashboard',
  'Create an Executive SaaS Monthly Recurring Revenue Tracker',
  'Design an AI Agent Task Orchestration & Workflow Panel',
  'Synthesize a Healthcare Patient Recruitment & Telehealth Portal',
  'Generate an E-Commerce Logistics Inventory & Order Monitor'
];

export const DesignSystemsView: React.FC<DesignSystemsViewProps> = ({
  onApplyThemeToActive,
  onGenerateWithTheme,
  currentSchemaTitle,
  activeAppTheme
}) => {
  // Current active customization state
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>({
    accentColor: 'emerald',
    style: 'modern',
    mode: 'light',
    fontFamily: 'Plus Jakarta Sans',
    borderRadius: 'lg',
    primaryHex: '#10b981',
    bgHex: '#fafafa',
    surfaceHex: '#ffffff'
  });

  const [promptText, setPromptText] = useState('');
  const [copiedToken, setCopiedToken] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const selectedColor = COLOR_OPTIONS.find(c => c.id === activeTheme.accentColor) || COLOR_OPTIONS[0];
  const selectedMode = MODE_OPTIONS.find(m => m.id === (activeTheme.mode || 'light')) || MODE_OPTIONS[0];
  const selectedRadius = RADIUS_OPTIONS.find(r => r.id === (activeTheme.borderRadius || 'lg')) || RADIUS_OPTIONS[2];
  const activeStyles = getThemeStyles(activeTheme);

  const handleSelectPreset = (sys: PresetSystem) => {
    setActiveTheme(sys.config);
    setStatusNotice(`Loaded preset "${sys.name}" into configurator`);
    setTimeout(() => setStatusNotice(null), 2500);
  };

  const handleApplyToActive = () => {
    if (onApplyThemeToActive) {
      onApplyThemeToActive(activeTheme);
      setStatusNotice('Theme applied to active application! Redirecting...');
      setTimeout(() => setStatusNotice(null), 2500);
    }
  };

  const handleGenerateApp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetPrompt = promptText.trim() || 'Create an executive analytics and operational dashboard';
    if (onGenerateWithTheme) {
      onGenerateWithTheme(targetPrompt, activeTheme);
    }
  };

  const handleCopyTokens = () => {
    const tokensJson = JSON.stringify({
      themeName: `${selectedColor.name} ${activeTheme.style}`,
      themeConfig: activeTheme,
      cssVariables: {
        '--color-primary': selectedColor.hex,
        '--color-bg': selectedMode.bgHex,
        '--color-surface': selectedMode.cardHex,
        '--font-family': activeTheme.fontFamily,
        '--border-radius': selectedRadius.label
      }
    }, null, 2);

    navigator.clipboard.writeText(tokensJson);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header Banner */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold mb-1">
            <Palette className="w-4 h-4" />
            <span>Design System Architecture & Tokens</span>
          </div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Design Systems & Theme Configurator
          </h1>
          <p className="text-xs text-zinc-500 mt-1 max-w-2xl">
            Configure themes, color swatches, typography, and card styles. Apply your design system to existing apps or generate a brand new application with your design tokens.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyTokens}
            className="inline-flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer border border-zinc-200"
          >
            {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedToken ? 'Tokens Copied!' : 'Export Tokens'}</span>
          </button>

          {onApplyThemeToActive && (
            <button
              onClick={handleApplyToActive}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply to Current App</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusNotice && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{statusNotice}</span>
          </div>
        </motion.div>
      )}

      {/* Main Studio Grid: Left Configurator, Right Live Interactive Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Configurator Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Theme Canvas Mode */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 uppercase tracking-wider">
              <Sun className="w-4 h-4 text-zinc-500" />
              <span>1. Canvas Mode & Theme Surface</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {MODE_OPTIONS.map((m) => {
                const isSelected = (activeTheme.mode || 'light') === m.id;
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      const updated = { ...activeTheme, mode: m.id as any, bgHex: m.bgHex, surfaceHex: m.cardHex };
                      setActiveTheme(updated);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between h-24 ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/40 text-emerald-950 font-bold shadow-2xs'
                        : 'border-zinc-200/90 hover:border-zinc-300 text-zinc-800 bg-white shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-zinc-500'}`} />
                        <span className="font-semibold text-xs">{m.name}</span>
                      </div>
                      <div
                        className="w-8 h-6 rounded-md border p-0.5 flex items-center justify-center shrink-0 shadow-2xs"
                        style={{ backgroundColor: m.bgHex, borderColor: m.borderHex }}
                      >
                        <div
                          className="w-full h-full rounded border"
                          style={{ backgroundColor: m.cardHex, borderColor: m.borderHex }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-normal line-clamp-1 mt-1">{m.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Primary Brand & Accent Swatch */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 uppercase tracking-wider">
                <Palette className="w-4 h-4 text-zinc-500" />
                <span>2. Accent & Brand Color Palette</span>
              </div>
              <span className="text-xs font-semibold text-emerald-600">{selectedColor.name}</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
              {COLOR_OPTIONS.map((c) => {
                const isSelected = activeTheme.accentColor === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      const updated = { ...activeTheme, accentColor: c.id, primaryHex: c.hex };
                      setActiveTheme(updated);
                    }}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-zinc-900 ring-2 ring-zinc-900/10 font-bold bg-zinc-50 shadow-2xs'
                        : 'border-zinc-200/80 hover:border-zinc-300 text-zinc-700 hover:bg-zinc-50/60'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0 shadow-2xs border border-black/10"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-[11px] truncate">{c.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Typography & Font Family */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 uppercase tracking-wider">
              <Type className="w-4 h-4 text-zinc-500" />
              <span>3. Typography & Font Family</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FONT_OPTIONS.map((f) => {
                const isSelected = (activeTheme.fontFamily || 'Plus Jakarta Sans') === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      const updated = { ...activeTheme, fontFamily: f.id };
                      setActiveTheme(updated);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/30 text-emerald-950 font-bold'
                        : 'border-zinc-200/80 hover:border-zinc-300 text-zinc-700 bg-zinc-50/30'
                    }`}
                  >
                    <span className="font-bold text-sm truncate block" style={{ fontFamily: f.family }}>
                      {f.label}
                    </span>
                    <span className="text-[10px] opacity-70 mt-1 truncate block" style={{ fontFamily: f.family }}>
                      {f.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Component Style & Corner Radius */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Component Style */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                  Component Density & Style
                </span>
                <div className="space-y-1.5">
                  {STYLE_OPTIONS.map((s) => {
                    const isSelected = activeTheme.style === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          const updated = { ...activeTheme, style: s.id as any };
                          setActiveTheme(updated);
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-bold'
                            : 'border-zinc-200/80 hover:border-zinc-300 text-zinc-700'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-[11px]">{s.label}</div>
                          <div className="text-[10px] text-zinc-400">{s.desc}</div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Corner Radius */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                  Corner Radius & Geometry
                </span>
                <div className="space-y-1.5">
                  {RADIUS_OPTIONS.map((r) => {
                    const isSelected = (activeTheme.borderRadius || 'lg') === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          const updated = { ...activeTheme, borderRadius: r.id as any };
                          setActiveTheme(updated);
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-bold'
                            : 'border-zinc-200/80 hover:border-zinc-300 text-zinc-700'
                        }`}
                      >
                        <span className="font-semibold text-[11px]">{r.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Interactive Preview & Generation Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Preview Card */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Live Interactive Preview</span>
              </span>
              <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full font-mono font-medium">
                Real-time Sync
              </span>
            </div>

            {/* Dynamic Canvas Container & Surface styled according to activeTheme */}
            <div className={`p-4 rounded-xl transition-all border ${activeStyles.containerBgClass} ${activeStyles.cardBorderClass}`}>
              <div
                style={activeStyles.fontFamilyStyle}
                className={`p-5 transition-all space-y-4 border ${activeStyles.cardBgClass} ${activeStyles.cardBorderClass} ${activeStyles.cardRadiusClass} ${activeStyles.cardShadowClass}`}
              >
                {/* Header inside card */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-bold text-sm tracking-tight ${activeStyles.textPrimaryClass}`}>Financial Performance</h3>
                    <p className={`text-[11px] ${activeStyles.textSecondaryClass}`}>Live metrics & tier breakdown</p>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold border ${activeStyles.accentBadgeClass} ${activeStyles.cardRadiusClass}`}>
                    +24.8% YoY
                  </span>
                </div>

                {/* Big Metric Display */}
                <div className="space-y-1">
                  <span className={`text-2xl font-extrabold tracking-tight ${activeStyles.textPrimaryClass}`}>$184,250</span>
                  <span className={`text-[10px] ${activeStyles.textSecondaryClass} block`}>Monthly Recurring Revenue (MRR)</span>
                </div>

                {/* Interactive Form Controls */}
                <div className="space-y-2 pt-2 border-t border-black/10 dark:border-white/10">
                  <label className={`text-[11px] font-semibold block ${activeStyles.textPrimaryClass}`}>Select Billing Plan</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      defaultValue="Enterprise Tier ($499/mo)"
                      readOnly
                      className={`w-full text-xs px-3 py-1.5 border bg-transparent focus:outline-none ${activeStyles.cardRadiusClass} ${activeStyles.cardBorderClass} ${activeStyles.textPrimaryClass}`}
                    />
                    <button
                      type="button"
                      className={`px-3 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs ${activeStyles.accentBgClass} ${activeStyles.cardRadiusClass}`}
                    >
                      Upgrade
                    </button>
                  </div>
                </div>

                {/* Mini Visual Bar */}
                <div className="pt-2">
                  <div className={`flex items-center justify-between text-[10px] ${activeStyles.textSecondaryClass} mb-1`}>
                    <span>Quota Usage</span>
                    <span>82%</span>
                  </div>
                  <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: '82%', backgroundColor: activeStyles.primaryColorHex }}
                      className="h-full rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Application Panel */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-2xl p-5 shadow-md border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">
                  Generate App with This Design
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full text-[10px] font-bold">
                {selectedColor.name} Theme
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Describe your desired app, or pick a suggestion below. The AI generator will build a complete interactive dashboard styled with your custom design system.
            </p>

            {/* Prompt Form */}
            <form onSubmit={handleGenerateApp} className="space-y-3">
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="e.g., Build a real-time cryptocurrency portfolio tracker with trading volume, profit/loss calculator, and live order book..."
                rows={3}
                className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
              />

              {/* Prompt Suggestions */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Quick Starter Prompts
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_APP_PROMPTS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPromptText(p)}
                      className="text-[10px] bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white px-2 py-1 rounded-lg border border-zinc-700/60 transition-colors text-left truncate max-w-full cursor-pointer"
                    >
                      + {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                style={{ backgroundColor: selectedColor.hex }}
                className="w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-all cursor-pointer mt-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Application with Design System</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Preset Systems Gallery */}
      <div className="space-y-4 pt-4 border-t border-zinc-200/80">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">
              Curated Design System Presets
            </h2>
            <p className="text-xs text-zinc-500">
              Select any pre-configured design system to load into the configurator or apply to your active workspace.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRESET_SYSTEMS.map((sys) => {
            const isEditingInConfigurator = activeTheme.accentColor === sys.config.accentColor && (activeTheme.mode || 'light') === (sys.config.mode || 'light');
            const isAppliedToWorkspace = activeAppTheme && activeAppTheme.accentColor === sys.config.accentColor && (activeAppTheme.mode || 'light') === (sys.config.mode || 'light');

            return (
              <motion.div
                key={sys.id}
                whileHover={{ y: -2 }}
                onClick={() => handleSelectPreset(sys)}
                className={`bg-white border rounded-2xl p-5 shadow-2xs cursor-pointer transition-all flex flex-col justify-between ${
                  isAppliedToWorkspace
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : isEditingInConfigurator
                    ? 'border-zinc-400 ring-1 ring-zinc-400/20'
                    : 'border-zinc-200/90 hover:border-zinc-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-bold text-sm text-zinc-900">{sys.name}</h3>
                    <div className="flex items-center gap-1.5">
                      {isAppliedToWorkspace && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active App
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
                        {sys.badge}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 mb-4 line-clamp-2">{sys.description}</p>

                  {/* Color Swatch row */}
                  <div className="flex items-center gap-1.5 p-2 bg-zinc-50 rounded-xl border border-zinc-100 mb-3">
                    <div className="w-5 h-5 rounded border border-zinc-200 shadow-2xs" style={{ backgroundColor: sys.colors.bg }} title="Canvas BG" />
                    <div className="w-5 h-5 rounded border border-zinc-200 shadow-2xs" style={{ backgroundColor: sys.colors.surface }} title="Card Surface" />
                    <div className="w-5 h-5 rounded shadow-2xs" style={{ backgroundColor: sys.colors.primary }} title="Primary Color" />
                    <div className="w-5 h-5 rounded border border-zinc-200 shadow-2xs" style={{ backgroundColor: sys.colors.border }} title="Border" />
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs gap-2">
                  <span className="text-zinc-500 text-[10px] font-medium truncate">
                    Font: {sys.config.fontFamily}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPreset(sys);
                      if (onApplyThemeToActive) {
                        onApplyThemeToActive(sys.config);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                      isAppliedToWorkspace
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-2xs'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    <span>{isAppliedToWorkspace ? 'Applied ✓' : 'Use System & Preview'}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
