import React from 'react';
import { ThemeConfig } from '../types';

export interface ThemeStyles {
  containerBgClass: string;
  cardBgClass: string;
  cardBorderClass: string;
  cardShadowClass: string;
  cardRadiusClass: string;
  textPrimaryClass: string;
  textSecondaryClass: string;
  accentBgClass: string;
  accentTextClass: string;
  accentBadgeClass: string;
  accentBorderClass: string;
  fontFamilyStyle: React.CSSProperties;
  primaryColorHex: string;
  isDark: boolean;
  isWarm: boolean;
  isSlate: boolean;
  densityPaddingClass: string;
  densityGapClass: string;
  subCardBgClass: string;
  subCardBorderClass: string;
  inputBgClass: string;
  inputBorderClass: string;
  inputTextClass: string;
  inputFocusClass: string;
  gridStrokeHex: string;
  axisStrokeHex: string;
  tooltipBgHex: string;
  tooltipBorderHex: string;
  tooltipTextHex: string;
  tableHeaderBgClass: string;
  tableHeaderBorderClass: string;
  tableHeaderTextColorClass: string;
  tableRowHoverClass: string;
  dividerBorderClass: string;
}

export function getThemeStyles(theme?: ThemeConfig): ThemeStyles {
  const mode = theme?.mode || 'light';
  const style = theme?.style || 'modern';
  const fontFamily = theme?.fontFamily || 'Plus Jakarta Sans';
  const borderRadius = theme?.borderRadius || 'lg';
  const accent = theme?.accentColor || 'emerald';

  const isDark = mode === 'dark';
  const isWarm = mode === 'warm';
  const isSlate = mode === 'slate';

  // 1. Default Style Declarations
  let containerBgClass = 'bg-[#f4f4f5] text-zinc-900';
  let cardBgClass = 'bg-white';
  let cardBorderClass = 'border-zinc-200/90';
  let textPrimaryClass = 'text-zinc-900';
  let textSecondaryClass = 'text-zinc-500';

  let subCardBgClass = 'bg-zinc-50';
  let subCardBorderClass = 'border-zinc-200';
  let inputBgClass = 'bg-zinc-50';
  let inputBorderClass = 'border-zinc-200 focus:border-zinc-400';
  let inputTextClass = 'text-zinc-900';
  let inputFocusClass = 'focus:ring-1 focus:ring-zinc-300';
  let gridStrokeHex = '#e4e4e7';
  let axisStrokeHex = '#a1a1aa';
  let tooltipBgHex = '#ffffff';
  let tooltipBorderHex = '#e4e4e7';
  let tooltipTextHex = '#18181b';
  let tableHeaderBgClass = 'bg-zinc-50';
  let tableHeaderBorderClass = 'border-zinc-200/80';
  let tableHeaderTextColorClass = 'text-zinc-500';
  let tableRowHoverClass = 'hover:bg-zinc-50/80';
  let dividerBorderClass = 'border-zinc-150';

  if (isDark) {
    containerBgClass = 'bg-[#090d16] text-zinc-100';
    cardBgClass = 'bg-[#111827]';
    cardBorderClass = 'border-zinc-800';
    textPrimaryClass = 'text-zinc-100';
    textSecondaryClass = 'text-zinc-400';
    
    subCardBgClass = 'bg-zinc-900/60';
    subCardBorderClass = 'border-zinc-800/80';
    inputBgClass = 'bg-zinc-950/60';
    inputBorderClass = 'border-zinc-800 focus:border-zinc-650';
    inputTextClass = 'text-zinc-100';
    inputFocusClass = 'focus:ring-1 focus:ring-zinc-600';
    gridStrokeHex = '#1e293b';
    axisStrokeHex = '#64748b';
    tooltipBgHex = '#0f172a';
    tooltipBorderHex = '#1e293b';
    tooltipTextHex = '#f8fafc';
    tableHeaderBgClass = 'bg-zinc-900/60';
    tableHeaderBorderClass = 'border-zinc-850';
    tableHeaderTextColorClass = 'text-zinc-400';
    tableRowHoverClass = 'hover:bg-zinc-800/20';
    dividerBorderClass = 'border-zinc-800/80';
  } else if (isWarm) {
    containerBgClass = 'bg-[#f5ede0] text-[#2d241e]';
    cardBgClass = 'bg-[#fffdfa]';
    cardBorderClass = 'border-[#e3d3c1]';
    textPrimaryClass = 'text-[#2d241e]';
    textSecondaryClass = 'text-[#786354]';
    
    subCardBgClass = 'bg-[#f7ebd9]/55';
    subCardBorderClass = 'border-[#dfcfbd]';
    inputBgClass = 'bg-[#fcf7ed]';
    inputBorderClass = 'border-[#dfcfbd] focus:border-[#c4ab93]';
    inputTextClass = 'text-[#2d241e]';
    inputFocusClass = 'focus:ring-1 focus:ring-[#c4ab93]';
    gridStrokeHex = '#dfcfbd';
    axisStrokeHex = '#8c7662';
    tooltipBgHex = '#fffdfa';
    tooltipBorderHex = '#dfcfbd';
    tooltipTextHex = '#2d241e';
    tableHeaderBgClass = 'bg-[#f0e4d2]';
    tableHeaderBorderClass = 'border-[#dfcfbd]';
    tableHeaderTextColorClass = 'text-[#786354]';
    tableRowHoverClass = 'hover:bg-[#f6ebd9]/50';
    dividerBorderClass = 'border-[#dfcfbd]';
  } else if (isSlate) {
    containerBgClass = 'bg-[#dbe2ef] text-slate-900';
    cardBgClass = 'bg-[#f8fafc]';
    cardBorderClass = 'border-slate-300';
    textPrimaryClass = 'text-slate-900';
    textSecondaryClass = 'text-slate-600';
    
    subCardBgClass = 'bg-slate-200/50';
    subCardBorderClass = 'border-slate-350';
    inputBgClass = 'bg-white';
    inputBorderClass = 'border-slate-300 focus:border-slate-400';
    inputTextClass = 'text-slate-900';
    inputFocusClass = 'focus:ring-1 focus:ring-slate-400';
    gridStrokeHex = '#cbd5e1';
    axisStrokeHex = '#64748b';
    tooltipBgHex = '#f8fafc';
    tooltipBorderHex = '#cbd5e1';
    tooltipTextHex = '#0f172a';
    tableHeaderBgClass = 'bg-slate-100';
    tableHeaderBorderClass = 'border-slate-250';
    tableHeaderTextColorClass = 'text-slate-500';
    tableRowHoverClass = 'hover:bg-slate-150/40';
    dividerBorderClass = 'border-slate-250';
  }

  // 2. Component Style & Glassmorphic Effects
  let cardShadowClass = 'shadow-2xs';
  if (style === 'minimal') {
    cardShadowClass = 'shadow-none border-2';
  } else if (style === 'glass') {
    cardShadowClass = 'shadow-lg backdrop-blur-md';
    if (isDark) {
      cardBgClass = 'bg-zinc-900/80';
      cardBorderClass = 'border-zinc-700/60';
    } else if (isWarm) {
      cardBgClass = 'bg-[#fffdfa]/85';
      cardBorderClass = 'border-[#e3d3c1]/80';
    } else if (isSlate) {
      cardBgClass = 'bg-[#f8fafc]/85';
      cardBorderClass = 'border-slate-300/80';
    } else {
      cardBgClass = 'bg-white/85';
      cardBorderClass = 'border-white/60';
    }
  } else if (style === 'dense') {
    cardShadowClass = 'shadow-2xs';
  }

  // 3. Border Radius
  let cardRadiusClass = 'rounded-2xl';
  if (borderRadius === 'none') {
    cardRadiusClass = 'rounded-none';
  } else if (borderRadius === 'sm') {
    cardRadiusClass = 'rounded-lg';
  } else if (borderRadius === 'full') {
    cardRadiusClass = 'rounded-3xl';
  } else {
    cardRadiusClass = 'rounded-2xl'; // 'lg' default
  }

  // 4. Accent Color Classes & Primary Hex
  let primaryColorHex = theme?.primaryHex || '#10b981';
  let accentBgClass = 'bg-emerald-600 hover:bg-emerald-700 text-white';
  let accentTextClass = 'text-emerald-600';
  let accentBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let accentBorderClass = 'border-emerald-500';

  switch (accent) {
    case 'indigo':
      primaryColorHex = '#4f46e5';
      accentBgClass = 'bg-indigo-600 hover:bg-indigo-700 text-white';
      accentTextClass = 'text-indigo-600 dark:text-indigo-400';
      accentBadgeClass = 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800';
      accentBorderClass = 'border-indigo-500';
      break;
    case 'violet':
      primaryColorHex = '#8b5cf6';
      accentBgClass = 'bg-violet-600 hover:bg-violet-700 text-white';
      accentTextClass = 'text-violet-600 dark:text-violet-400';
      accentBadgeClass = 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800';
      accentBorderClass = 'border-violet-500';
      break;
    case 'rose':
      primaryColorHex = '#f43f5e';
      accentBgClass = 'bg-rose-600 hover:bg-rose-700 text-white';
      accentTextClass = 'text-rose-600 dark:text-rose-400';
      accentBadgeClass = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800';
      accentBorderClass = 'border-rose-500';
      break;
    case 'cyan':
      primaryColorHex = '#06b6d4';
      accentBgClass = 'bg-cyan-500 hover:bg-cyan-600 text-black font-semibold';
      accentTextClass = 'text-cyan-600 dark:text-cyan-400';
      accentBadgeClass = 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800';
      accentBorderClass = 'border-cyan-500';
      break;
    case 'sky':
      primaryColorHex = '#0284c7';
      accentBgClass = 'bg-sky-600 hover:bg-sky-700 text-white';
      accentTextClass = 'text-sky-600 dark:text-sky-400';
      accentBadgeClass = 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800';
      accentBorderClass = 'border-sky-500';
      break;
    case 'amber':
      primaryColorHex = '#f59e0b';
      accentBgClass = 'bg-amber-500 hover:bg-amber-600 text-black font-semibold';
      accentTextClass = 'text-amber-600 dark:text-amber-400';
      accentBadgeClass = 'bg-[#fef3c7] text-[#92400e] border-[#fde68a] dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800';
      accentBorderClass = 'border-amber-500';
      break;
    case 'teal':
      primaryColorHex = '#14b8a6';
      accentBgClass = 'bg-teal-600 hover:bg-teal-700 text-white';
      accentTextClass = 'text-teal-600 dark:text-teal-400';
      accentBadgeClass = 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800';
      accentBorderClass = 'border-teal-500';
      break;
    case 'coral':
      primaryColorHex = '#f97316';
      accentBgClass = 'bg-orange-500 hover:bg-orange-600 text-white';
      accentTextClass = 'text-orange-600 dark:text-orange-400';
      accentBadgeClass = 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800';
      accentBorderClass = 'border-orange-500';
      break;
    default:
      primaryColorHex = '#10b981';
      accentBgClass = 'bg-emerald-600 hover:bg-emerald-700 text-white';
      accentTextClass = 'text-emerald-600 dark:text-emerald-400';
      accentBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';
      accentBorderClass = 'border-emerald-500';
  }

  // 5. Density & Spacing
  let densityPaddingClass = 'p-5 sm:p-6';
  let densityGapClass = 'gap-5';
  if (style === 'dense') {
    densityPaddingClass = 'p-3.5 sm:p-4';
    densityGapClass = 'gap-3';
  }

  // 6. Font Family Inline Style
  const fontFamilyStyle: React.CSSProperties = {
    fontFamily: `"${fontFamily}", system-ui, -apple-system, sans-serif`
  };

  return {
    containerBgClass,
    cardBgClass,
    cardBorderClass,
    cardShadowClass,
    cardRadiusClass,
    textPrimaryClass,
    textSecondaryClass,
    accentBgClass,
    accentTextClass,
    accentBadgeClass,
    accentBorderClass,
    fontFamilyStyle,
    primaryColorHex,
    isDark,
    isWarm,
    isSlate,
    densityPaddingClass,
    densityGapClass,
    subCardBgClass,
    subCardBorderClass,
    inputBgClass,
    inputBorderClass,
    inputTextClass,
    inputFocusClass,
    gridStrokeHex,
    axisStrokeHex,
    tooltipBgHex,
    tooltipBorderHex,
    tooltipTextHex,
    tableHeaderBgClass,
    tableHeaderBorderClass,
    tableHeaderTextColorClass,
    tableRowHoverClass,
    dividerBorderClass
  };
}
