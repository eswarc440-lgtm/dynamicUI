import React, { useState } from 'react';
import { FormComponentData, ThemeConfig } from '../types';
import { Send, CheckCircle } from 'lucide-react';
import { getThemeStyles } from '../utils/themeUtils';

interface FormCardProps {
  component: FormComponentData;
  theme?: ThemeConfig;
  onSubmitAction?: (newVals: Record<string, any>) => void;
}

export const FormCard: React.FC<FormCardProps> = ({ component, theme, onSubmitAction }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const styles = getThemeStyles(theme);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSubmitAction) {
      onSubmitAction(formData);
    }
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className={`${styles.cardBgClass} border ${styles.cardBorderClass} ${styles.cardRadiusClass} ${styles.densityPaddingClass} ${styles.cardShadowClass} space-y-4 transition-all`}>
      <div className={`border-b ${styles.dividerBorderClass} pb-3`}>
        <h3 className={`text-sm font-semibold ${styles.textPrimaryClass}`}>{component.title}</h3>
        {component.description && (
          <p className={`text-xs ${styles.textSecondaryClass} mt-0.5`}>{component.description}</p>
        )}
      </div>

      {submitted ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 text-center space-y-1.5 transition-all">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto animate-bounce" />
          <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Form Submitted Successfully!</h4>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Your response has been saved to the workspace.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {component.fields?.map(field => (
            <div key={field.id} className="space-y-1">
              <label className={`text-xs font-bold ${styles.textPrimaryClass} opacity-85 block`}>
                {field.label} {field.required && <span className="text-rose-500">*</span>}
              </label>

              {field.fieldType === 'select' ? (
                <select
                  value={formData[field.id] || ''}
                  onChange={e => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                  className={`w-full ${styles.inputBgClass} border ${styles.inputBorderClass} ${styles.inputTextClass} ${styles.inputFocusClass} rounded-lg px-3 py-2 text-xs focus:outline-none transition-all cursor-pointer`}
                >
                  <option value="" className="text-zinc-500">Select option...</option>
                  {field.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.fieldType === 'textarea' ? (
                <textarea
                  rows={2}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={e => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                  className={`w-full ${styles.inputBgClass} border ${styles.inputBorderClass} ${styles.inputTextClass} ${styles.inputFocusClass} rounded-lg px-3 py-2 text-xs focus:outline-none transition-all resize-none`}
                />
              ) : (
                <input
                  type={field.fieldType || 'text'}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={e => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                  className={`w-full ${styles.inputBgClass} border ${styles.inputBorderClass} ${styles.inputTextClass} ${styles.inputFocusClass} rounded-lg px-3 py-2 text-xs focus:outline-none transition-all`}
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            className={`w-full ${styles.accentBgClass} font-bold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:shadow-xs cursor-pointer`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{component.submitLabel || 'Submit Form'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
