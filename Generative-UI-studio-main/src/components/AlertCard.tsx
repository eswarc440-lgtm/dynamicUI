import React from 'react';
import { AlertCardComponentData, ThemeConfig } from '../types';
import { AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';
import { getThemeStyles } from '../utils/themeUtils';

interface AlertCardProps {
  component: AlertCardComponentData;
  theme?: ThemeConfig;
}

export const AlertCard: React.FC<AlertCardProps> = ({ component, theme }) => {
  const severity = component.severity || 'info';
  const themeStyles = getThemeStyles(theme);

  const severityStyles = {
    info: 'bg-blue-50/80 border-blue-200 text-blue-900 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-200',
    warning: 'bg-amber-50/80 border-amber-200 text-amber-900 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-200',
    error: 'bg-rose-50/80 border-rose-200 text-rose-900 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-200',
    success: 'bg-emerald-50/80 border-emerald-200 text-emerald-900 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-200'
  };

  const icons = {
    info: <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
    error: <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
  };

  return (
    <div className={`border ${themeStyles.cardRadiusClass} p-4 ${themeStyles.cardShadowClass} flex items-start justify-between gap-3 ${severityStyles[severity]}`}>
      <div className="flex items-start gap-2.5">
        {icons[severity]}
        <div className="space-y-1">
          <h4 className="text-xs font-semibold">{component.title}</h4>
          <p className="text-xs opacity-90">{component.message}</p>
        </div>
      </div>

      {component.actionLabel && (
        <button className="px-2.5 py-1 bg-white/80 hover:bg-white dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700 rounded-lg text-xs font-medium shrink-0 shadow-2xs transition-colors cursor-pointer">
          {component.actionLabel}
        </button>
      )}
    </div>
  );
};
