import React, { useState } from 'react';
import { ActionListComponentData, ThemeConfig } from '../types';
import { Check, ArrowRight } from 'lucide-react';
import { getThemeStyles } from '../utils/themeUtils';
import { DynamicIcon } from './DynamicIcon';

interface ActionListCardProps {
  component: ActionListComponentData;
  theme?: ThemeConfig;
}

export const ActionListCard: React.FC<ActionListCardProps> = ({ component, theme }) => {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const styles = getThemeStyles(theme);

  const toggleComplete = (id: string) => {
    setCompletedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className={`${styles.cardBgClass} border ${styles.cardBorderClass} ${styles.cardRadiusClass} ${styles.densityPaddingClass} ${styles.cardShadowClass} space-y-3.5 transition-all`}>
      <div className={`border-b ${styles.dividerBorderClass} pb-2.5`}>
        <h3 className={`text-sm font-semibold ${styles.textPrimaryClass}`}>{component.title}</h3>
      </div>

      <div className="space-y-2.5">
        {component.actions?.map(act => {
          const isDone = completedIds.includes(act.id);
          return (
            <div
              key={act.id}
              onClick={() => toggleComplete(act.id)}
              className={`p-3.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all duration-200 ${
                isDone
                  ? `${styles.subCardBgClass} ${styles.subCardBorderClass} text-zinc-400 line-through opacity-70`
                  : `${styles.cardBgClass} ${styles.cardBorderClass} ${styles.textPrimaryClass} hover:border-zinc-450 dark:hover:border-zinc-600 hover:shadow-2xs`
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                    isDone ? `${styles.accentBgClass} border-transparent` : `${styles.inputBorderClass} ${styles.inputBgClass}`
                  }`}
                >
                  {isDone && <Check className="w-3 h-3 text-white" />}
                </div>
                {act.icon && (
                  <div className={`p-1 rounded-md bg-zinc-100/60 dark:bg-zinc-850/40 border ${styles.cardBorderClass} shrink-0`}>
                    <DynamicIcon name={act.icon} className={`w-3.5 h-3.5 ${styles.accentTextClass}`} />
                  </div>
                )}
                <div>
                  <span className="font-semibold block">{act.title}</span>
                  {act.description && (
                    <p className={`text-[10px] ${isDone ? 'text-zinc-400 dark:text-zinc-500' : styles.textSecondaryClass} mt-0.5`}>
                      {act.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {act.category && (
                  <span className={`px-2 py-0.5 rounded-md ${styles.subCardBgClass} border ${styles.subCardBorderClass} ${styles.textSecondaryClass} text-[9px] font-bold tracking-wide`}>
                    {act.category}
                  </span>
                )}
                <span className={`text-[10px] ${styles.textSecondaryClass} flex items-center gap-1 font-semibold`}>
                  {act.buttonText || 'Complete'} <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
