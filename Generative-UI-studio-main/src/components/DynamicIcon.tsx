import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name?: string;
  className?: string;
  fallback?: React.ReactNode;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className, fallback = null }) => {
  if (!name) return <>{fallback}</>;

  // Check if it's an emoji
  const isEmoji = /[\u0080-\uFFFF]/.test(name) || name.length <= 2;
  if (isEmoji) {
    return <span className={className}>{name}</span>;
  }

  // Normalize dashed names to PascalCase (e.g. dollar-sign -> DollarSign)
  const normalized = name
    .replace(/-([a-z])/g, (g) => g[1].toUpperCase())
    .replace(/^(.)/, (g) => g.toUpperCase());

  const IconComponent = (Icons as any)[normalized] || (Icons as any)[name];

  if (!IconComponent) {
    // Case-insensitive key lookup
    const foundKey = Object.keys(Icons).find(
      (key) => key.toLowerCase() === name.toLowerCase()
    );
    if (foundKey) {
      const LucideIcon = (Icons as any)[foundKey];
      return <LucideIcon className={className} />;
    }
    return <>{fallback}</>;
  }

  return <IconComponent className={className} />;
};
