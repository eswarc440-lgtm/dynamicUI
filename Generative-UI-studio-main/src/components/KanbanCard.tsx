import React, { useState } from 'react';
import { KanbanComponentData, KanbanItem, ThemeConfig } from '../types';
import { Plus, MoreHorizontal, User } from 'lucide-react';
import { getThemeStyles } from '../utils/themeUtils';

interface KanbanCardProps {
  component: KanbanComponentData;
  theme?: ThemeConfig;
  device?: 'desktop' | 'tablet' | 'mobile';
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ component, theme, device }) => {
  const [columns] = useState(component.columns || []);
  const [items, setItems] = useState<KanbanItem[]>(component.items || []);
  const styles = getThemeStyles(theme);

  const moveItem = (itemId: string, newColumnId: string) => {
    setItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, columnId: newColumnId } : item))
    );
  };

  return (
    <div className={`${styles.cardBgClass} border ${styles.cardBorderClass} ${styles.cardRadiusClass} ${styles.densityPaddingClass} ${styles.cardShadowClass} space-y-4 transition-all`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-sm font-semibold ${styles.textPrimaryClass}`}>{component.title}</h3>
          <p className={`text-xs ${styles.textSecondaryClass}`}>Interactive Kanban Workflow Board</p>
        </div>
      </div>

      <div className={`grid ${device === 'mobile' ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-3 gap-5'}`}>
        {columns.map(col => {
          const colItems = items.filter(i => i.columnId === col.id);
          return (
            <div
              key={col.id}
              className={`${styles.subCardBgClass} border ${styles.subCardBorderClass} rounded-xl p-4 flex flex-col space-y-3 min-h-[260px] transition-colors duration-200`}
            >
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: col.color || '#18181b' }} />
                  <span className={`text-xs font-bold ${styles.textPrimaryClass}`}>{col.title}</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 ${styles.inputBgClass} border ${styles.inputBorderClass} ${styles.textSecondaryClass} rounded-full`}>
                  {colItems.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {colItems.map(item => (
                  <div
                    key={item.id}
                    className={`${styles.cardBgClass} border ${styles.cardBorderClass} rounded-xl p-3.5 shadow-xs hover:shadow-sm hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200 space-y-2.5 cursor-grab active:cursor-grabbing`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-xs font-bold tracking-tight leading-snug ${styles.textPrimaryClass}`}>{item.title}</h4>
                      {item.priority && (
                        <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border ${
                          item.priority === 'high'
                            ? 'bg-rose-500/10 text-rose-600 border-rose-500/25 dark:text-rose-400'
                            : item.priority === 'medium'
                            ? 'bg-amber-500/10 text-amber-600 border-amber-500/25 dark:text-amber-400'
                            : 'bg-zinc-500/10 text-zinc-600 border-zinc-500/25 dark:text-zinc-400'
                        }`}>
                          {item.priority}
                        </span>
                      )}
                    </div>

                    {item.subtitle && (
                      <p className={`text-[11px] leading-relaxed ${styles.textSecondaryClass}`}>{item.subtitle}</p>
                    )}

                    <div className={`flex items-center justify-between pt-2.5 border-t ${styles.dividerBorderClass} text-[11px] ${styles.textSecondaryClass}`}>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 opacity-70" />
                        <span className="font-medium">{item.assignee || 'Unassigned'}</span>
                      </div>

                      <select
                        value={item.columnId}
                        onChange={e => moveItem(item.id, e.target.value)}
                        className={`${styles.inputBgClass} border ${styles.inputBorderClass} ${styles.inputTextClass} ${styles.inputFocusClass} text-[10px] rounded-lg px-2 py-0.5 cursor-pointer focus:outline-none font-semibold transition-all`}
                      >
                        {columns.map(c => (
                          <option key={c.id} value={c.id}>
                            → {c.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
