import React, { useState } from 'react';
import { TableComponentData, ThemeConfig } from '../types';
import { Search, Download, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { getThemeStyles } from '../utils/themeUtils';

interface TableCardProps {
  component: TableComponentData;
  theme?: ThemeConfig;
}

export const TableCard: React.FC<TableCardProps> = ({ component, theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const styles = getThemeStyles(theme);

  const columns = component.columns || [];
  let data = component.data || [];

  if (searchTerm) {
    data = data.filter(row =>
      Object.values(row).some(
        val => val && String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  if (sortKey) {
    data = [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const exportCSV = () => {
    if (!data.length) return;
    const headers = columns.map(c => c.label).join(',');
    const rows = data
      .map(row => columns.map(c => `"${row[c.key] ?? ''}"`).join(','))
      .join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${component.title || 'export'}.csv`;
    a.click();
  };

  return (
    <div className={`${styles.cardBgClass} border ${styles.cardBorderClass} ${styles.cardRadiusClass} ${styles.densityPaddingClass} ${styles.cardShadowClass} space-y-4 transition-all`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className={`text-sm font-semibold ${styles.textPrimaryClass}`}>{component.title}</h3>
          <p className={`text-xs ${styles.textSecondaryClass}`}>Showing {data.length} records</p>
        </div>

        <div className="flex items-center gap-2">
          {component.searchable !== false && (
            <div className="relative">
              <Search className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 ${styles.textSecondaryClass} opacity-60`} />
              <input
                type="text"
                placeholder="Filter table..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={`${styles.inputBgClass} border ${styles.inputBorderClass} ${styles.inputTextClass} ${styles.inputFocusClass} rounded-lg pl-8 pr-3 py-1.5 text-xs placeholder-zinc-400 focus:outline-none transition-all`}
              />
            </div>
          )}

          {component.exportable !== false && (
            <button
              onClick={exportCSV}
              className={`${styles.inputBgClass} border ${styles.inputBorderClass} ${styles.inputTextClass} ${styles.inputFocusClass} hover:opacity-80 p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer`}
              title="Export CSV"
            >
              <Download className="w-3.5 h-3.5 opacity-70" />
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className={`overflow-x-auto border ${styles.subCardBorderClass} rounded-xl`}>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className={`${styles.tableHeaderBgClass} border-b ${styles.tableHeaderBorderClass} ${styles.tableHeaderTextColorClass} font-medium`}>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-3.5 py-2.5 font-semibold cursor-pointer ${styles.tableRowHoverClass} transition-colors select-none`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.label}</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${styles.dividerBorderClass} ${styles.cardBgClass}`}>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={`px-4 py-8 text-center ${styles.textSecondaryClass} opacity-60`}>
                  No records match your query
                </td>
              </tr>
            ) : (
              data.map((row, rIdx) => (
                <tr key={rIdx} className={`${styles.tableRowHoverClass} transition-colors`}>
                  {columns.map(col => {
                    const rawVal = row[col.key];

                    if (col.type === 'badge') {
                      const badgeStyle = col.badgeColorMap?.[rawVal] || 'bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 border-zinc-500/25';
                      return (
                        <td key={col.key} className="px-3.5 py-2.5">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold border ${badgeStyle}`}>
                            {rawVal}
                          </span>
                        </td>
                      );
                    }

                    if (col.type === 'currency') {
                      return (
                        <td key={col.key} className={`px-3.5 py-2.5 font-mono font-medium ${styles.textPrimaryClass}`}>
                          ${Number(rawVal || 0).toLocaleString()}
                        </td>
                      );
                    }

                    if (col.type === 'progress') {
                      const pct = Math.min(100, Math.max(0, Number(rawVal) || 0));
                      return (
                        <td key={col.key} className="px-3.5 py-2.5 min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <span className={`font-mono text-[11px] font-semibold ${styles.textPrimaryClass} w-8`}>{pct}%</span>
                            <div className={`flex-1 h-1.5 ${styles.subCardBgClass} rounded-full overflow-hidden border ${styles.subCardBorderClass}`}>
                              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: styles.primaryColorHex }} />
                            </div>
                          </div>
                        </td>
                      );
                    }

                    if (col.type === 'date') {
                      let formattedDate = String(rawVal || '—');
                      try {
                        if (rawVal) {
                          formattedDate = new Date(rawVal).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          });
                        }
                      } catch (e) {}
                      return (
                        <td key={col.key} className={`px-3.5 py-2.5 font-mono ${styles.textSecondaryClass}`}>
                          {formattedDate}
                        </td>
                      );
                    }

                    if (col.type === 'avatar') {
                      const name = String(rawVal || 'User');
                      const initial = name.charAt(0).toUpperCase();
                      const bgColors = [
                        'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
                        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                        'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
                        'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
                        'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
                      ];
                      const colorIndex = name.charCodeAt(0) % bgColors.length;
                      const colorClass = bgColors[colorIndex];
                      return (
                        <td key={col.key} className="px-3.5 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-[10px] shrink-0 ${colorClass}`}>
                              {initial}
                            </div>
                            <span className={`font-semibold ${styles.textPrimaryClass}`}>{name}</span>
                          </div>
                        </td>
                      );
                    }

                    if (col.type === 'number') {
                      return (
                        <td key={col.key} className={`px-3.5 py-2.5 font-mono ${styles.textPrimaryClass}`}>
                          {typeof rawVal === 'number' ? rawVal.toLocaleString() : String(rawVal)}
                        </td>
                      );
                    }

                    return (
                      <td key={col.key} className={`px-3.5 py-2.5 ${styles.textSecondaryClass}`}>
                        {rawVal !== undefined && rawVal !== null ? String(rawVal) : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
