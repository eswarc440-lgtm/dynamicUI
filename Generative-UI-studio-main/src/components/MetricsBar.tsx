import React from 'react';
import { MetricItem, ThemeConfig } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { getThemeStyles } from '../utils/themeUtils';
import { DynamicIcon } from './DynamicIcon';

interface MetricsBarProps {
  metrics: MetricItem[];
  theme?: ThemeConfig;
  device?: 'desktop' | 'tablet' | 'mobile';
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ metrics, theme, device }) => {
  const styles = getThemeStyles(theme);

  const formatValue = (metric: MetricItem) => {
    if (typeof metric.value === 'number') {
      if (metric.format === 'currency') {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0
        }).format(metric.value);
      }
      if (metric.format === 'percentage') {
        return `${metric.value}%`;
      }
      return metric.value.toLocaleString();
    }
    return metric.value;
  };

  const gridColsClass = device === 'mobile'
    ? 'grid-cols-1 gap-4'
    : device === 'tablet'
    ? 'grid-cols-2 gap-4'
    : `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${styles.densityGapClass}`;

  return (
    <div className={`grid ${gridColsClass} my-6`}>
      {metrics.map((metric, idx) => (
        <motion.div
          key={metric.id || idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: idx * 0.04, ease: "easeOut" }}
          className={`${styles.cardBgClass} border ${styles.cardBorderClass} ${styles.cardRadiusClass} ${styles.densityPaddingClass} ${styles.cardShadowClass} hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between group`}
        >
          <div>
            <div className="flex items-start justify-between gap-2.5 w-full">
              <span className={`text-xs font-semibold uppercase tracking-wider ${styles.textSecondaryClass} line-clamp-1 flex-1 min-w-0`}>
                {metric.label}
              </span>
              {metric.icon && (
                <div className={`p-1.5 rounded-lg bg-zinc-100/60 dark:bg-zinc-800/40 border ${styles.cardBorderClass} shrink-0 -mt-1 -mr-1 transition-colors duration-200`}>
                  <DynamicIcon name={metric.icon} className={`w-3.5 h-3.5 ${styles.accentTextClass}`} />
                </div>
              )}
              {metric.change && (
                <span
                  className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    metric.trend === 'up'
                      ? styles.accentBadgeClass
                      : metric.trend === 'down'
                      ? 'bg-rose-500/10 text-rose-600 border border-rose-500/25 dark:text-rose-400'
                      : 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {metric.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                  {metric.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                  {metric.trend === 'neutral' && <Minus className="w-3 h-3" />}
                  {metric.change.replace(/^[~_\s]+/g, '')}
                </span>
              )}
            </div>

            <div className={`text-2xl font-extrabold mt-2 tracking-tight leading-tight ${styles.textPrimaryClass}`}>
              {formatValue(metric)}
            </div>
          </div>

          <div className={`mt-3.5 pt-3 border-t ${styles.dividerBorderClass} flex items-center justify-between text-xs ${styles.textSecondaryClass}`}>
            <span>{metric.subtext || 'Live metric'}</span>

            {/* Micro Sparkline Visual */}
            {metric.sparkline && metric.sparkline.length > 1 && (
              <div className="flex items-end gap-1 h-4">
                {metric.sparkline.map((val, sIdx) => {
                  const min = Math.min(...metric.sparkline!);
                  const max = Math.max(...metric.sparkline!);
                  const heightPct = max === min ? 50 : Math.max(15, ((val - min) / (max - min)) * 100);
                  return (
                    <div
                      key={sIdx}
                      className="w-1 rounded-full transition-all duration-500 group-hover:opacity-90"
                      style={{ 
                        height: `${heightPct}%`, 
                        backgroundColor: styles.primaryColorHex,
                        transitionDelay: `${sIdx * 30}ms`
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
