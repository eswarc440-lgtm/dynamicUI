import React from 'react';
import { FoodCategoryGridComponentData, ThemeConfig } from '../types';
import { getThemeStyles } from '../utils/themeUtils';
import { DynamicIcon } from './DynamicIcon';

interface FoodCategoryGridProps {
  component: FoodCategoryGridComponentData;
  theme?: ThemeConfig;
}

export const FoodCategoryGrid: React.FC<FoodCategoryGridProps> = ({ component, theme }) => {
  const styles = getThemeStyles(theme);

  return (
    <div className="space-y-3">
      {component.title && (
        <h3 className={`text-base font-bold tracking-tight ${styles.textPrimaryClass}`}>
          {component.title}
        </h3>
      )}

      {/* Horizontal / Grid Scrollable Category Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {component.categories?.map((cat) => (
          <div
            key={cat.id}
            className={`${styles.cardBgClass} border ${styles.cardBorderClass} p-3 rounded-2xl ${styles.cardShadowClass} hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center group cursor-pointer space-y-1.5`}
          >
            {cat.imageUrl ? (
              <div className="w-12 h-12 rounded-full overflow-hidden bg-amber-50 dark:bg-amber-950/40 p-1 border border-amber-200/50 group-hover:scale-110 transition-transform">
                <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover rounded-full" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <DynamicIcon name={cat.icon || 'Utensils'} className="w-6 h-6" />
              </div>
            )}

            <span className={`text-xs font-bold ${styles.textPrimaryClass} group-hover:text-amber-500 transition-colors`}>
              {cat.name}
            </span>

            {cat.offerText && (
              <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200/40">
                {cat.offerText}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
