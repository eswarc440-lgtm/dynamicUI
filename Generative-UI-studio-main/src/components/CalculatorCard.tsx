import React, { useState, useEffect } from 'react';
import { CalculatorComponentData, ThemeConfig } from '../types';
import { Calculator } from 'lucide-react';
import { getThemeStyles } from '../utils/themeUtils';

interface CalculatorCardProps {
  component: CalculatorComponentData;
  theme?: ThemeConfig;
  onStateChange?: (newVals: Record<string, any>) => void;
  device?: 'desktop' | 'tablet' | 'mobile';
}

const parseAndEvaluate = (exprStr: string, variables: Record<string, number>): number => {
  let expr = exprStr.toLowerCase();
  
  // Sort keys descending to avoid prefix replacement issues
  const sortedKeys = Object.keys(variables).sort((a, b) => b.length - a.length);
  
  // Specific aliases matching common metric names to input keys
  const aliases: Record<string, string> = {
    'team': 'headcount',
    'salary': 'avgSalary',
    'marketing': 'marketingBudget',
    'infra': 'serverCost',
    'simulated expense': 'totalExp',
    'expense': 'totalExp',
    'revenue': '65000' // fallback revenue if not in variables
  };
  
  Object.entries(aliases).forEach(([alias, targetKey]) => {
    expr = expr.replaceAll(alias, targetKey);
  });
  
  sortedKeys.forEach(key => {
    const val = variables[key];
    const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKey}\\b`, 'g');
    expr = expr.replace(regex, String(val));
  });
  
  // Strip dollar signs, commas, or percent signs
  expr = expr.replace(/\$/g, '').replace(/,/g, '').replace(/%/g, '');
  
  try {
    if (/^[0-9+\-*/().\s]+$/.test(expr)) {
      return new Function(`return ${expr}`)() || 0;
    }
  } catch (e) {
    console.warn('Failed to parse formula:', exprStr, expr, e);
  }
  return 0;
};

export const CalculatorCard: React.FC<CalculatorCardProps> = ({ component, theme, onStateChange, device }) => {
  const styles = getThemeStyles(theme);
  
  const [inputs, setInputs] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    component.inputs?.forEach(inp => {
      initial[inp.id] = inp.value !== undefined ? inp.value : 0;
    });
    return initial;
  });

  // Sync state if inputs prop changes
  useEffect(() => {
    const initial: Record<string, number> = {};
    component.inputs?.forEach(inp => {
      initial[inp.id] = inp.value !== undefined ? inp.value : 0;
    });
    setInputs(initial);
  }, [component.inputs]);

  const handleChange = (id: string, value: string) => {
    const valNum = parseFloat(value) || 0;
    setInputs(prev => {
      const next = {
        ...prev,
        [id]: valNum
      };
      if (onStateChange) {
        onStateChange(next);
      }
      return next;
    });
  };

  const calculateOutputs = () => {
    const computed: Record<string, number> = {};
    const variables: Record<string, number> = { ...inputs };
    
    if (variables['revenue'] === undefined) {
      variables['revenue'] = 65000;
    }
    
    component.outputs?.forEach(out => {
      const formulaStr = out.formula || out.formulaDescription || '';
      let cleanFormula = formulaStr.replace(/inputs\./g, '').replace(/outputs\./g, '');
      
      let val = parseAndEvaluate(cleanFormula, variables);
      if (out.multiplier) {
        val = val * out.multiplier;
      }
      computed[out.id] = val;
      variables[out.id] = val; // support chaining outputs
    });
    return computed;
  };

  const calculatedOutputs = calculateOutputs();

  return (
    <div className={`${styles.cardBgClass} border ${styles.cardBorderClass} ${styles.cardRadiusClass} ${styles.densityPaddingClass} ${styles.cardShadowClass} space-y-5 transition-all`}>
      <div className={`flex items-center gap-2 border-b ${styles.dividerBorderClass} pb-3.5`}>
        <Calculator className={`w-4 h-4 ${styles.accentTextClass}`} />
        <div>
          <h3 className={`text-sm font-semibold ${styles.textPrimaryClass}`}>{component.title}</h3>
          {component.description && (
            <p className={`text-xs ${styles.textSecondaryClass} mt-0.5`}>{component.description}</p>
          )}
        </div>
      </div>

      {/* Sliders and Inputs */}
      <div className={`grid ${device === 'mobile' ? 'grid-cols-1 gap-3.5' : 'grid-cols-1 sm:grid-cols-2 gap-4'}`}>
        {component.inputs?.map(inp => (
          <div key={inp.id} className={`space-y-1.5 ${styles.subCardBgClass} border ${styles.subCardBorderClass} rounded-xl p-3.5 transition-colors duration-200`}>
            <label className={`text-[11px] font-bold ${styles.textSecondaryClass} flex justify-between`}>
              <span>{inp.label}</span>
              <span className={`font-mono font-bold ${styles.textPrimaryClass}`}>
                {inp.unit === '$' || inp.unit === 'USD' ? '$' : ''}
                {(inputs[inp.id] || 0).toLocaleString()}
                {inp.unit !== '$' && inp.unit !== 'USD' ? ` ${inp.unit || ''}` : ''}
              </span>
            </label>
            
            <div className="flex items-center gap-3 mt-1.5">
              <input
                type="range"
                min={inp.min}
                max={inp.max}
                step={inp.step || 1}
                value={inputs[inp.id] !== undefined ? inputs[inp.id] : inp.value || 0}
                onChange={e => handleChange(inp.id, e.target.value)}
                style={{ accentColor: styles.primaryColorHex }}
                className="flex-1 h-1 bg-zinc-200 dark:bg-zinc-750 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="number"
                min={inp.min}
                max={inp.max}
                step={inp.step || 1}
                value={inputs[inp.id] !== undefined ? inputs[inp.id] : inp.value || 0}
                onChange={e => handleChange(inp.id, e.target.value)}
                className={`w-16 ${styles.inputBgClass} border ${styles.inputBorderClass} ${styles.inputTextClass} ${styles.inputFocusClass} rounded-lg px-2 py-0.5 text-[10px] text-right focus:outline-none font-mono font-semibold transition-all`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Calculated Outputs Section */}
      <div className={`border-t ${styles.dividerBorderClass} pt-4 space-y-3`}>
        <h4 className={`text-[10px] font-bold ${styles.textSecondaryClass} opacity-80 uppercase tracking-wider`}>Calculated Scenario Outputs</h4>
        <div className={`grid ${device === 'mobile' ? 'grid-cols-1 gap-3' : 'grid-cols-1 sm:grid-cols-2 gap-3.5'}`}>
          {component.outputs?.map(out => {
            const val = calculatedOutputs[out.id] !== undefined ? calculatedOutputs[out.id] : out.calculatedValue || 0;
            return (
              <div key={out.id} className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors duration-200 shadow-2xs ${styles.subCardBgClass} ${styles.subCardBorderClass}`}>
                <span className={`text-[11px] font-bold ${styles.textSecondaryClass}`}>{out.label}</span>
                <div className="flex items-baseline justify-between mt-1.5 gap-2">
                  <span className={`text-lg font-bold font-mono ${styles.textPrimaryClass}`}>
                    {out.format === 'currency'
                      ? `$${Number(val.toFixed(0)).toLocaleString()}`
                      : out.format === 'percentage'
                      ? `${val.toFixed(1)}%`
                      : Number(val.toFixed(1)).toLocaleString()}
                  </span>
                  <span className={`text-[9px] ${styles.textSecondaryClass} opacity-60 font-mono italic shrink-0 truncate max-w-[125px]`} title={out.formulaDescription}>
                    {out.formulaDescription}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
