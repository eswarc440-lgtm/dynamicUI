import React, { useState } from 'react';
import { ChartComponentData, ThemeConfig } from '../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon } from 'lucide-react';
import { getThemeStyles } from '../utils/themeUtils';

interface ChartCardProps {
  component: ChartComponentData;
  theme?: ThemeConfig;
}

const DEFAULT_COLOR_PALETTE = [
  '#10b981', '#4f46e5', '#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899', '#0284c7', '#f43f5e'
];

export const ChartCard: React.FC<ChartCardProps> = ({ component, theme }) => {
  const [activeChartType, setActiveChartType] = useState(component.chartType || 'line');
  const styles = getThemeStyles(theme);

  const data = component.data || [];
  const xAxisKey = component.xAxisKey || 'month';
  const dataKeys = component.dataKeys || [{ key: 'value', name: 'Value', color: styles.primaryColorHex }];

  const renderChart = () => {
    if (!data.length) {
      return (
        <div className={`h-64 flex items-center justify-center ${styles.textSecondaryClass} opacity-60 text-xs`}>
          No chart data available
        </div>
      );
    }

    if (activeChartType === 'pie') {
      const pieKey = dataKeys[0]?.key || 'value';
      return (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey={pieKey}
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || DEFAULT_COLOR_PALETTE[index % DEFAULT_COLOR_PALETTE.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: styles.tooltipBgHex,
                borderColor: styles.tooltipBorderHex,
                borderRadius: '8px',
                color: styles.tooltipTextHex,
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: styles.axisStrokeHex }} />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (activeChartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {component.grid !== false && <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStrokeHex} vertical={false} />}
            <XAxis dataKey={xAxisKey} stroke={styles.axisStrokeHex} fontSize={11} tickLine={false} />
            <YAxis stroke={styles.axisStrokeHex} fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: styles.tooltipBgHex,
                borderColor: styles.tooltipBorderHex,
                borderRadius: '8px',
                color: styles.tooltipTextHex,
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: styles.axisStrokeHex }} />
            {dataKeys.map((dk, idx) => (
              <Bar
                key={dk.key}
                dataKey={dk.key}
                name={dk.name || dk.key}
                fill={dk.color || DEFAULT_COLOR_PALETTE[idx % DEFAULT_COLOR_PALETTE.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (activeChartType === 'area') {
      return (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {component.grid !== false && <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStrokeHex} vertical={false} />}
            <XAxis dataKey={xAxisKey} stroke={styles.axisStrokeHex} fontSize={11} tickLine={false} />
            <YAxis stroke={styles.axisStrokeHex} fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: styles.tooltipBgHex,
                borderColor: styles.tooltipBorderHex,
                borderRadius: '8px',
                color: styles.tooltipTextHex,
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: styles.axisStrokeHex }} />
            {dataKeys.map((dk, idx) => (
              <Area
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                name={dk.name || dk.key}
                stroke={dk.color || DEFAULT_COLOR_PALETTE[idx % DEFAULT_COLOR_PALETTE.length]}
                fill={dk.color || DEFAULT_COLOR_PALETTE[idx % DEFAULT_COLOR_PALETTE.length]}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    // Default Line Chart
    return (
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          {component.grid !== false && <CartesianGrid strokeDasharray="3 3" stroke={styles.gridStrokeHex} vertical={false} />}
          <XAxis dataKey={xAxisKey} stroke={styles.axisStrokeHex} fontSize={11} tickLine={false} />
          <YAxis stroke={styles.axisStrokeHex} fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: styles.tooltipBgHex,
              borderColor: styles.tooltipBorderHex,
              borderRadius: '8px',
              color: styles.tooltipTextHex,
              fontSize: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', color: styles.axisStrokeHex }} />
          {dataKeys.map((dk, idx) => (
            <Line
              key={dk.key}
              type="monotone"
              dataKey={dk.key}
              name={dk.name || dk.key}
              stroke={dk.color || DEFAULT_COLOR_PALETTE[idx % DEFAULT_COLOR_PALETTE.length]}
              strokeWidth={2}
              dot={{ r: 3, fill: dk.color || DEFAULT_COLOR_PALETTE[idx % DEFAULT_COLOR_PALETTE.length] }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className={`${styles.cardBgClass} border ${styles.cardBorderClass} ${styles.cardRadiusClass} ${styles.densityPaddingClass} ${styles.cardShadowClass} h-full flex flex-col justify-between transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className={`text-sm font-semibold ${styles.textPrimaryClass}`}>
            {component.title}
          </h3>
          {component.subtitle && (
            <p className={`text-xs ${styles.textSecondaryClass} mt-0.5`}>{component.subtitle}</p>
          )}
        </div>

        {/* View Switcher Buttons */}
        <div className={`flex items-center gap-1 ${styles.inputBgClass} p-0.5 rounded-lg border ${styles.inputBorderClass}`}>
          <button
            onClick={() => setActiveChartType('line')}
            title="Line View"
            className={`p-1 rounded text-xs transition-all ${
              activeChartType === 'line' ? `${styles.cardBgClass} ${styles.textPrimaryClass} shadow-2xs font-bold` : `${styles.textSecondaryClass} hover:opacity-90`
            }`}
          >
            <LineIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveChartType('bar')}
            title="Bar View"
            className={`p-1 rounded text-xs transition-all ${
              activeChartType === 'bar' ? `${styles.cardBgClass} ${styles.textPrimaryClass} shadow-2xs font-bold` : `${styles.textSecondaryClass} hover:opacity-90`
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveChartType('area')}
            title="Area View"
            className={`p-1 rounded text-xs transition-all ${
              activeChartType === 'area' ? `${styles.cardBgClass} ${styles.textPrimaryClass} shadow-2xs font-bold` : `${styles.textSecondaryClass} hover:opacity-90`
            }`}
          >
            <PieIcon className="w-3.5 h-3.5 rotate-45" />
          </button>
          <button
            onClick={() => setActiveChartType('pie')}
            title="Pie View"
            className={`p-1 rounded text-xs transition-all ${
              activeChartType === 'pie' ? `${styles.cardBgClass} ${styles.textPrimaryClass} shadow-2xs font-bold` : `${styles.textSecondaryClass} hover:opacity-90`
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="w-full pt-1">
        {renderChart()}
      </div>
    </div>
  );
};
