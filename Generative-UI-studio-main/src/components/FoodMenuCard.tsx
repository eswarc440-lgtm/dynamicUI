import React, { useState } from 'react';
import { FoodMenuComponentData, ThemeConfig } from '../types';
import { Star, Plus, Minus, Check, ShoppingBag } from 'lucide-react';
import { getThemeStyles } from '../utils/themeUtils';

interface FoodMenuCardProps {
  component: FoodMenuComponentData;
  theme?: ThemeConfig;
}

export const FoodMenuCard: React.FC<FoodMenuCardProps> = ({ component, theme }) => {
  const styles = getThemeStyles(theme);
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({});

  const updateQuantity = (id: string, delta: number) => {
    setCartQuantities(prev => {
      const current = prev[id] || 0;
      const updated = Math.max(0, current + delta);
      if (updated === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: updated };
    });
  };

  const totalCartCount = Object.values(cartQuantities).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-base font-bold tracking-tight ${styles.textPrimaryClass}`}>
            {component.title}
          </h3>
          {component.subtitle && (
            <p className={`text-xs ${styles.textSecondaryClass} mt-0.5`}>
              {component.subtitle}
            </p>
          )}
        </div>

        {totalCartCount > 0 && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-md animate-bounce">
            <ShoppingBag className="w-4 h-4" />
            <span>{totalCartCount} items in cart</span>
          </div>
        )}
      </div>

      {/* Menu Item Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {component.items?.map((item) => {
          const qty = cartQuantities[item.id] || 0;
          return (
            <div
              key={item.id}
              className={`${styles.cardBgClass} border ${styles.cardBorderClass} p-4 rounded-2xl ${styles.cardShadowClass} flex justify-between gap-4 transition-all duration-300 hover:border-amber-500/40 relative group`}
            >
              {/* Item Info */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  {/* Veg / Non-Veg Indicator Icon */}
                  <div className={`w-4 h-4 border-2 flex items-center justify-center p-0.5 rounded ${item.isVeg ? 'border-emerald-600' : 'border-rose-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                  </div>
                  
                  {item.isBestseller && (
                    <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200/50">
                      Bestseller
                    </span>
                  )}
                </div>

                <h4 className={`text-sm font-bold ${styles.textPrimaryClass} group-hover:text-amber-500 transition-colors`}>
                  {item.name}
                </h4>

                <div className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100">
                  ${item.price.toFixed(2)}
                </div>

                {item.rating && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{item.rating}</span>
                  </div>
                )}

                <p className={`text-xs ${styles.textSecondaryClass} line-clamp-2 leading-relaxed`}>
                  {item.description}
                </p>
              </div>

              {/* Item Image & ADD Button */}
              <div className="flex flex-col items-center justify-between shrink-0 space-y-2">
                {item.imageUrl && (
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-2xs">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                )}

                {/* Add / Quantity Button */}
                {qty === 0 ? (
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-24 bg-white dark:bg-zinc-900 border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs py-1.5 rounded-xl shadow-2xs hover:bg-emerald-600 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1 uppercase tracking-wider"
                  >
                    <span>ADD</span>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="w-24 bg-emerald-600 text-white font-extrabold text-xs py-1 rounded-xl shadow-md flex items-center justify-between px-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-emerald-700 rounded cursor-pointer">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span>{qty}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-emerald-700 rounded cursor-pointer">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
