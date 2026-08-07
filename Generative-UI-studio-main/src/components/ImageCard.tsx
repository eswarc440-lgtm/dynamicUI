import React from 'react';
import { ImageComponentData, ThemeConfig } from '../types';
import { getThemeStyles } from '../utils/themeUtils';

interface ImageCardProps {
  component: ImageComponentData;
  theme?: ThemeConfig;
  device?: 'desktop' | 'tablet' | 'mobile';
}

export const ImageCard: React.FC<ImageCardProps> = ({ component, theme }) => {
  const styles = getThemeStyles(theme);

  const aspectClass = 
    component.aspectRatio === 'video' ? 'aspect-video' :
    component.aspectRatio === 'square' ? 'aspect-square' :
    component.aspectRatio === 'wide' ? 'aspect-[21/9]' :
    'aspect-auto';

  return (
    <div className={`${styles.cardBgClass} border ${styles.cardBorderClass} ${styles.cardRadiusClass} ${styles.cardShadowClass} overflow-hidden flex flex-col justify-between group transition-all duration-300 relative`}>
      {/* Bleed-to-edge Image Container */}
      <div className={`relative ${aspectClass} overflow-hidden w-full bg-zinc-150 dark:bg-zinc-800`}>
        <img
          src={component.url}
          alt={component.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Subtle top/bottom glass gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-90" />
        
        {/* Floating title text over image */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xs sm:text-sm font-bold tracking-tight drop-shadow-sm">{component.title}</h3>
          {component.description && (
            <p className="text-[10px] sm:text-[11px] text-zinc-200/90 mt-0.5 line-clamp-2 drop-shadow-sm">{component.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
