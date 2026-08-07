import React, { useState, useEffect } from 'react';
import { WorkflowItem, ThemeConfig } from '../types';
import { Workflow, PauseCircle, Play } from 'lucide-react';
import { getThemeStyles } from '../utils/themeUtils';

interface WorkflowPanelProps {
  workflows?: WorkflowItem[];
  theme?: ThemeConfig;
}

export const WorkflowPanel: React.FC<WorkflowPanelProps> = ({ workflows = [], theme }) => {
  const [items, setItems] = useState<WorkflowItem[]>(workflows);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const styles = getThemeStyles(theme);

  useEffect(() => {
    setItems(workflows);
  }, [workflows]);

  if (!items || items.length === 0) return null;

  const toggleStatus = (id: string) => {
    setItems(prev =>
      prev.map(w => {
        if (w.id === id) {
          const nextStatus = w.status === 'active' ? 'paused' : 'active';
          showToast(`Workflow "${w.name}" set to ${nextStatus.toUpperCase()}`);
          return { ...w, status: nextStatus };
        }
        return w;
      })
    );
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className={`${styles.cardBgClass} border ${styles.cardBorderClass} ${styles.cardRadiusClass} ${styles.densityPaddingClass} ${styles.cardShadowClass} space-y-3 relative transition-all my-6`}>
      {toastMsg && (
        <div className="absolute top-3 right-3 bg-zinc-900 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-md animate-fade-in z-10">
          {toastMsg}
        </div>
      )}

      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Workflow className={`w-4 h-4 ${styles.accentTextClass}`} />
          <h3 className={`text-sm font-semibold ${styles.textPrimaryClass}`}>Automated Workflow Triggers</h3>
        </div>
        <span className={`text-[11px] font-mono ${styles.textSecondaryClass} font-medium`}>
          {items.filter(i => i.status === 'active').length} Active Rules
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map(wf => (
          <div
            key={wf.id}
            className="bg-zinc-50/80 border border-zinc-200/80 rounded-lg p-3 flex items-center justify-between gap-3 hover:border-zinc-300 transition-colors"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-900">{wf.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium border ${
                  wf.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                }`}>
                  {wf.status}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">Trigger: {wf.trigger}</p>
              {wf.lastRun && (
                <p className="text-[10px] text-zinc-400">Last run: {wf.lastRun}</p>
              )}
            </div>

            <button
              onClick={() => toggleStatus(wf.id)}
              className="p-1.5 rounded-lg text-xs font-medium border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 transition-colors cursor-pointer"
              title={wf.status === 'active' ? 'Pause Workflow' : 'Activate Workflow'}
            >
              {wf.status === 'active' ? <PauseCircle className="w-4 h-4 text-emerald-600" /> : <Play className="w-4 h-4 text-zinc-600" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
