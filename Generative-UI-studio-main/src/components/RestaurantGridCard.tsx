import React, { useState } from 'react';
import { RestaurantListComponentData, ThemeConfig } from '../types';
import { Star, Clock, Heart, Sparkles, Tag, Check } from 'lucide-react';
import { getThemeStyles } from '../utils/themeUtils';

interface RestaurantGridCardProps {
  component: RestaurantListComponentData;
  theme?: ThemeConfig;
}

export const RestaurantGridCard: React.FC<RestaurantGridCardProps> = ({ component, theme }) => {
  const styles = getThemeStyles(theme);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4">
      {(component.title || component.subtitle) && (
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
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer">
            See All ({component.restaurants?.length || 0})
          </span>
        </div>
      )}

      {/* Grid of Restaurant Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {component.restaurants?.map((rest) => {
          const isFav = favorites[rest.id];
          return (
            <div
              key={rest.id}
              className={`${styles.cardBgClass} border ${styles.cardBorderClass} ${styles.cardRadiusClass} ${styles.cardShadowClass} overflow-hidden group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer relative`}
            >
              {/* Cover Image Container */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={rest.imageUrl}
                  alt={rest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                {/* Offer Badge Overlay */}
                {rest.offerBadge && (
                  <div className="absolute bottom-2 left-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-md shadow-md flex items-center gap-1 uppercase tracking-wider">
                    <Tag className="w-3 h-3" />
                    <span>{rest.offerBadge}</span>
                  </div>
                )}

                {/* Heart Favorite Button */}
                <button
                  onClick={(e) => toggleFavorite(rest.id, e)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all cursor-pointer"
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500 animate-pulse' : 'text-white'}`} />
                </button>

                {/* Promoted Badge */}
                {rest.isPromoted && (
                  <span className="absolute top-2 left-2 bg-zinc-900/80 backdrop-blur-md text-zinc-300 text-[9px] font-mono px-1.5 py-0.5 rounded">
                    Ad
                  </span>
                )}
              </div>

              {/* Card Details */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-sm font-extrabold ${styles.textPrimaryClass} truncate group-hover:text-amber-500 transition-colors`}>
                      {rest.name}
                    </h4>
                    <div className="flex items-center gap-1 bg-emerald-600 text-white font-bold text-[11px] px-1.5 py-0.5 rounded shrink-0 shadow-2xs">
                      <span>{rest.rating}</span>
                      <Star className="w-3 h-3 fill-white text-white" />
                    </div>
                  </div>
                  <p className={`text-xs ${styles.textSecondaryClass} truncate mt-0.5`}>
                    {rest.cuisine}
                  </p>
                </div>

                <div className={`flex items-center justify-between text-[11px] font-medium pt-2 border-t ${styles.dividerBorderClass} ${styles.textSecondaryClass}`}>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 opacity-70" />
                    <span>{rest.deliveryTime}</span>
                    {rest.distance && <span>• {rest.distance}</span>}
                  </div>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {rest.priceForTwo} for two
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
