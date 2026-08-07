import React, { useState } from 'react';
import { DynamicUISchema } from '../types';
import { Code, Copy, Check, Download, X, Sparkles, Layers } from 'lucide-react';

interface SchemaInspectorModalProps {
  schema: DynamicUISchema;
  isOpen: boolean;
  onClose: () => void;
}

export const SchemaInspectorModal: React.FC<SchemaInspectorModalProps> = ({ schema, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'json' | 'react'>('json');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(schema, null, 2);

  const generateReactSnippet = () => {
    return `// Generated React Component for "${schema.title}"
import React from 'react';
import { MetricsBar } from './components/MetricsBar';
import { ComponentRenderer } from './components/ComponentRenderer';

export default function ${schema.title.replace(/[^a-zA-Z0-9]/g, '')}Dashboard() {
  const uiSchema = ${jsonString};

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{uiSchema.title}</h1>
        <p className="text-sm text-zinc-400">{uiSchema.description}</p>
      </header>

      <MetricsBar metrics={uiSchema.metrics} />

      <div className="space-y-6">
        {uiSchema.layout.map((sec) => (
          <div key={sec.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sec.components.map((comp) => (
              <ComponentRenderer key={comp.id} component={comp} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}`;
  };

  const handleCopy = () => {
    const textToCopy = activeTab === 'json' ? jsonString : generateReactSnippet();
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${schema.id}_schema.json`;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-3xl w-full h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/50">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Generative UI Schema & Code Inspector</h3>
              <p className="text-xs text-zinc-400">View or export dynamic JSON layout declaration and React code</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-zinc-800 p-0.5 rounded-lg border border-zinc-700">
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'json' ? 'bg-emerald-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                JSON Schema
              </button>
              <button
                onClick={() => setActiveTab('react')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'react' ? 'bg-emerald-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                React TSX Snippet
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 text-xs flex items-center gap-1 border border-zinc-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleDownload}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 text-xs flex items-center gap-1 border border-zinc-700"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code Content View */}
        <div className="flex-1 p-4 overflow-y-auto bg-zinc-950 font-mono text-xs text-emerald-300 leading-relaxed">
          <pre>{activeTab === 'json' ? jsonString : generateReactSnippet()}</pre>
        </div>
      </div>
    </div>
  );
};
