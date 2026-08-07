/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DynamicUISchema, PresetTemplate, ChatMessage, ThemeConfig } from './types';
import { DEMO_BURN_RATE_SCHEMA, PRESET_TEMPLATES, getPresetSchema } from './data/presets';
import { Sidebar } from './components/Sidebar';
import { PromptBar } from './components/PromptBar';
import { MetricsBar } from './components/MetricsBar';
import { ComponentRenderer } from './components/ComponentRenderer';
import { SchemaInspectorModal } from './components/SchemaInspectorModal';
import { WorkflowPanel } from './components/WorkflowPanel';
import { ProjectsView } from './components/ProjectsView';
import { ChatsView } from './components/ChatsView';
import { ChatsHistoryView } from './components/ChatsHistoryView';
import { DesignSystemsView } from './components/DesignSystemsView';
import { TemplatesView } from './components/TemplatesView';
import { FoodRushApp } from './components/FoodRushApp';
import { RideXApp } from './components/RideXApp';
import { RemindMeApp } from './components/RemindMeApp';
import { HotelLuxApp } from './components/HotelLuxApp';
import { getThemeStyles } from './utils/themeUtils';
import { generateDynamicDomainSchema } from './utils/schemaSynthesizer';
import {
  Sparkles,
  Code,
  LayoutGrid,
  Eye,
  PanelLeft,
  ArrowLeft,
  Share2,
  Maximize2,
  Monitor,
  Tablet,
  Smartphone,
  Menu,
  Search,
  Bell,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DynamicIcon } from './components/DynamicIcon';

const getSidebarLinks = (schema: any) => {
  if (!schema) return [];
  const p = (schema.generatedPrompt || schema.title || '').toLowerCase();
  const category = (schema.category || '').toLowerCase();

  if (
    p.includes('ride') ||
    p.includes('ridex') ||
    p.includes('uber') ||
    p.includes('cab') ||
    p.includes('taxi') ||
    p.includes('driver') ||
    p.includes('transport') ||
    category.includes('ride') ||
    category.includes('transport')
  ) {
    return [
      { label: 'Book Ride', icon: 'Navigation', tabId: 'dashboard' },
      { label: 'Your Trips', icon: 'Clock', tabId: 'operations' },
      { label: 'Wallet & Safety', icon: 'ShieldCheck', tabId: 'analytics' },
      { label: 'Driver Mode', icon: 'Car', tabId: 'settings' }
    ];
  }

  if (
    p.includes('food') ||
    p.includes('restaurant') ||
    p.includes('delivery') ||
    p.includes('swiggy') ||
    p.includes('foodrush') ||
    p.includes('dining') ||
    p.includes('menu') ||
    p.includes('meal') ||
    p.includes('dish') ||
    p.includes('pizza') ||
    p.includes('burger') ||
    p.includes('biryani') ||
    category.includes('food') ||
    category.includes('dining')
  ) {
    return [
      { label: 'Restaurants', icon: 'Utensils', tabId: 'dashboard' },
      { label: 'Search & Menu', icon: 'Search', tabId: 'operations' },
      { label: 'Cart & Orders', icon: 'ShoppingBag', tabId: 'analytics' },
      { label: 'Offers & Deals', icon: 'Tag', tabId: 'settings' }
    ];
  }
  
  if (
    p.includes('remind') ||
    p.includes('remaind') ||
    p.includes('todo') ||
    p.includes('task') ||
    p.includes('planner') ||
    p.includes('habit') ||
    category.includes('productivity') ||
    category.includes('planning')
  ) {
    return [
      { label: 'Reminders', icon: 'CheckCircle', tabId: 'dashboard' },
      { label: 'Calendar', icon: 'Calendar', tabId: 'operations' },
      { label: 'Analytics', icon: 'TrendingUp', tabId: 'analytics' },
      { label: 'Settings', icon: 'Settings', tabId: 'settings' }
    ];
  }
  
  if (
    p.includes('fit') ||
    p.includes('health') ||
    p.includes('run') ||
    p.includes('gym') ||
    p.includes('workout') ||
    category.includes('health') ||
    category.includes('fitness')
  ) {
    return [
      { label: 'Workouts', icon: 'Activity', tabId: 'dashboard' },
      { label: 'Diet Log', icon: 'Heart', tabId: 'operations' },
      { label: 'Analytics', icon: 'TrendingUp', tabId: 'analytics' },
      { label: 'Settings', icon: 'Settings', tabId: 'settings' }
    ];
  }

  if (
    p.includes('shop') ||
    p.includes('store') ||
    p.includes('inventory') ||
    p.includes('product') ||
    category.includes('commerce') ||
    category.includes('inventory')
  ) {
    return [
      { label: 'Dashboard', icon: 'LayoutGrid', tabId: 'dashboard' },
      { label: 'Inventory', icon: 'Layers', tabId: 'operations' },
      { label: 'Sales Charts', icon: 'TrendingUp', tabId: 'analytics' },
      { label: 'Settings', icon: 'Settings', tabId: 'settings' }
    ];
  }

  if (
    p.includes('finance') ||
    p.includes('crypto') ||
    p.includes('mrr') ||
    p.includes('dollar') ||
    p.includes('money') ||
    category.includes('finance') ||
    category.includes('crypto')
  ) {
    return [
      { label: 'Dashboard', icon: 'DollarSign', tabId: 'dashboard' },
      { label: 'Ledger', icon: 'CreditCard', tabId: 'operations' },
      { label: 'Markets', icon: 'TrendingUp', tabId: 'analytics' },
      { label: 'Settings', icon: 'Settings', tabId: 'settings' }
    ];
  }

  return [
    { label: 'Dashboard', icon: 'LayoutGrid', tabId: 'dashboard' },
    { label: 'Operations', icon: 'Layers', tabId: 'operations' },
    { label: 'Analytics', icon: 'TrendingUp', tabId: 'analytics' },
    { label: 'Settings', icon: 'Settings', tabId: 'settings' }
  ];
};

export default function App() {
  const initialHistory: DynamicUISchema[] = [
    DEMO_BURN_RATE_SCHEMA,
    getSaasFallbackSchema("Set up SaaS MRR, customer churn rate, ARPU, and plan tier breakdown"),
    getHiringFallbackSchema("Build candidate recruitment pipeline with Kanban stages and interview feedback"),
    getInventoryFallbackSchema("Design inventory management dashboard with low stock alerts and demand forecasting"),
    getHabitFallbackSchema("Generate habit and focus tracking dashboard with daily completion and streak metrics")
  ];

  const [projectHistory, setProjectHistory] = useState<DynamicUISchema[]>(() => {
    try {
      const saved = localStorage.getItem('gui_studio_project_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = parsed.filter(p => !p.id?.startsWith('booking_'));
          if (cleaned.length > 0) return cleaned;
        }
      }
    } catch (e) {
      console.error('Failed to load project history from localStorage', e);
    }
    return initialHistory;
  });
  const [currentSchema, setCurrentSchema] = useState<DynamicUISchema | null>(null);
  const [activeDraftId, setActiveDraftId] = useState<string>('');
  const [dashboardState, setDashboardState] = useState<Record<string, any>>({});
  const [selectedModel, setSelectedModel] = useState<string>('Gemini 2.5 Flash');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationStage, setGenerationStage] = useState<string>('Analyzing prompt intent...');
  const [skipGenerationDelay, setSkipGenerationDelay] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('gui_studio_project_history', JSON.stringify(projectHistory));
    } catch (e) {
      console.error('Failed to save project history to localStorage', e);
    }
  }, [projectHistory]);

  useEffect(() => {
    if (currentSchema) {
      setDashboardState(currentSchema.initialState || {});
    } else {
      setDashboardState({});
    }
  }, [currentSchema?.id]);

  const handleStateChange = (newVals: Record<string, any>) => {
    setDashboardState(prev => ({
      ...prev,
      ...newVals
    }));
  };

  const getDynamicSchema = (): DynamicUISchema | null => {
    if (!currentSchema) return null;
    
    if (currentSchema.id === 'demo_burn_rate' || currentSchema.id === 'burn_rate') {
      const state = {
        headcount: 12,
        avgSalary: 11000,
        marketingBudget: 25000,
        serverCost: 12000,
        ...dashboardState
      };
      
      const grossBurn = (state.headcount * state.avgSalary) + state.marketingBudget + state.serverCost;
      const revenue = 65000;
      const netBurn = grossBurn - revenue;
      const bankBalance = 1850000;
      const runwayMonths = netBurn > 0 ? (bankBalance / netBurn) : 99;
      
      const dynamicSchema = JSON.parse(JSON.stringify(currentSchema)) as DynamicUISchema;
      
      dynamicSchema.layout.forEach(sec => {
        sec.components.forEach(comp => {
          if (comp.id === 'comp_calculator_headcount' && comp.type === 'calculator') {
            comp.inputs = comp.inputs.map(inp => {
              if (state[inp.id] !== undefined) {
                return { ...inp, value: state[inp.id] };
              }
              return inp;
            });
            comp.outputs = comp.outputs.map(out => {
              if (out.id === 'totalExp') {
                return { ...out, calculatedValue: grossBurn };
              }
              if (out.id === 'simRunway') {
                return { ...out, calculatedValue: runwayMonths };
              }
              return out;
            });
          }
        });
      });
      
      if (dynamicSchema.metrics) {
        dynamicSchema.metrics = dynamicSchema.metrics.map(m => {
          if (m.id === 'm1') {
            return { ...m, value: `${runwayMonths.toFixed(1)} Months` };
          }
          if (m.id === 'm3') {
            return { ...m, value: netBurn, subtext: `Gross Burn $${(grossBurn/1000).toFixed(0)}K | Revenue $${(revenue/1000).toFixed(0)}K` };
          }
          return m;
        });
      }
      
      const runwayChart = dynamicSchema.layout
        .flatMap(sec => sec.components)
        .find(c => c.id === 'comp_chart_runway');
        
      if (runwayChart && runwayChart.type === 'chart') {
        let currentCash = bankBalance;
        runwayChart.data = [
          { month: "Jan", cashReserve: 2500000, netBurn: 160000, revenue: 45000 },
          { month: "Feb", cashReserve: 2380000, netBurn: 155000, revenue: 48000 },
          { month: "Mar", cashReserve: 2240000, netBurn: 148000, revenue: 52000 },
          { month: "Apr", cashReserve: 2100000, netBurn: 142000, revenue: 56000 },
          { month: "May", cashReserve: 1970000, netBurn: 138000, revenue: 60000 },
          { month: "Jun (Now)", cashReserve: currentCash, netBurn: netBurn, revenue: revenue },
          { month: "Jul (Proj)", cashReserve: Math.max(0, currentCash - netBurn), netBurn: netBurn, revenue: revenue },
          { month: "Aug (Proj)", cashReserve: Math.max(0, currentCash - 2 * netBurn), netBurn: netBurn, revenue: revenue },
          { month: "Sep (Proj)", cashReserve: Math.max(0, currentCash - 3 * netBurn), netBurn: netBurn, revenue: revenue }
        ];
      }
      
      return dynamicSchema;
    }
    
    return currentSchema;
  };

  const activeRenderSchema = getDynamicSchema();
  const [activeNav, setActiveNav] = useState<string>('home');
  const [isViewingChatDetail, setIsViewingChatDetail] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'operations' | 'analytics' | 'settings'>('dashboard');

  // Selected Template state for chat workflow
  const [selectedTemplate, setSelectedTemplate] = useState<PresetTemplate | null>(null);
  const [initialPrompt, setInitialPrompt] = useState<string>('');

  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const handleNavChange = (nav: string) => {
    setActiveNav(nav);
    if (nav === 'chats') {
      setIsViewingChatDetail(false);
    }
  };

  const handleSelectTemplateForChat = (preset: PresetTemplate) => {
    setSelectedTemplate(preset);
    setInitialPrompt(preset.prompt);
    setCurrentSchema(null);
    setActiveNav('home');
    setIsViewingChatDetail(false);
  };

  const handleSelectDraft = (preset: PresetTemplate) => {
    if (preset.schema) {
      const clonedSchema = {
        ...preset.schema,
        id: preset.id,
        generatedPrompt: preset.prompt
      };
      setCurrentSchema(clonedSchema);
      setActiveDraftId(preset.id);
      setActiveNav('chats');
      setIsViewingChatDetail(true);
      setActiveTab('preview');
    } else {
      handleSelectTemplateForChat(preset);
    }
  };

  const handleApplyThemeToActive = (themeConfig: ThemeConfig) => {
    const baseSchema = currentSchema || DEMO_BURN_RATE_SCHEMA;
    const updatedSchema: DynamicUISchema = {
      ...baseSchema,
      theme: themeConfig
    };
    setCurrentSchema(updatedSchema);
    setProjectHistory(prev => [updatedSchema, ...prev.filter(p => p.id !== updatedSchema.id)]);
    setActiveNav('chats');
    setIsViewingChatDetail(true);
    setActiveTab('preview');
  };

  const handleSelectTheme = (accentColor: string, style: 'modern' | 'minimal' | 'dense' | 'glass') => {
    handleApplyThemeToActive({ accentColor, style });
  };

  const handleNewChat = () => {
    setCurrentSchema(null);
    setActiveDraftId('');
    setSelectedTemplate(null);
    setInitialPrompt('');
    setActiveNav('home');
    setIsViewingChatDetail(false);
  };

  const handleSelectProject = (schema: DynamicUISchema) => {
    setCurrentSchema(schema);
    setActiveDraftId(schema.id);
    setActiveNav('chats');
    setIsViewingChatDetail(true);
    setActiveTab('preview');
  };

  const handleDeleteProject = (id: string) => {
    setProjectHistory(prev => prev.filter(p => p.id !== id));
    if (currentSchema?.id === id) {
      const remaining = projectHistory.filter(p => p.id !== id);
      if (remaining.length > 0) {
        setCurrentSchema(remaining[0]);
      } else {
        setCurrentSchema(null);
        setActiveNav('home');
      }
    }
  };

  const refineSchemaLocally = (schema: DynamicUISchema, promptText: string): DynamicUISchema => {
    const promptLower = promptText.toLowerCase();
    const newSchema: DynamicUISchema = JSON.parse(JSON.stringify(schema));

    if (promptLower.includes('indigo')) newSchema.theme.accentColor = 'indigo';
    else if (promptLower.includes('violet')) newSchema.theme.accentColor = 'violet';
    else if (promptLower.includes('amber')) newSchema.theme.accentColor = 'amber';
    else if (promptLower.includes('cyan')) newSchema.theme.accentColor = 'cyan';
    else if (promptLower.includes('rose')) newSchema.theme.accentColor = 'rose';
    else if (promptLower.includes('emerald')) newSchema.theme.accentColor = 'emerald';
    else if (promptLower.includes('sky')) newSchema.theme.accentColor = 'sky';

    if (promptLower.includes('alert') || promptLower.includes('warning') || promptLower.includes('notice')) {
      const alertComponent = {
        id: `alert_${Date.now()}`,
        type: 'alert' as const,
        title: 'Refinement Advisory',
        severity: 'info' as const,
        message: `System feature added: "${promptText}"`,
        timestamp: 'Just now',
        actionLabel: 'Acknowledge'
      };
      if (newSchema.layout.length > 0) {
        newSchema.layout[0].components.unshift(alertComponent);
      }
    }

    if (promptLower.includes('chart') || promptLower.includes('graph')) {
      const newChart = {
        id: `chart_${Date.now()}`,
        type: 'chart' as const,
        chartType: 'line' as const,
        title: `Analytics Trend (${promptText.slice(0, 20)})`,
        xAxisKey: 'period',
        dataKeys: [{ key: 'val', name: 'Performance Metric', color: '#10b981' }],
        data: [
          { period: 'Q1', val: 120 },
          { period: 'Q2', val: 185 },
          { period: 'Q3', val: 240 },
          { period: 'Q4', val: 320 }
        ]
      };
      if (newSchema.layout.length > 0) {
        newSchema.layout[0].components.push(newChart);
      }
    }

    newSchema.description = `${newSchema.description} (Refined: "${promptText}")`;
    return newSchema;
  };

  const handleGenerateUI = async (prompt: string, isRefine = false, customTheme?: ThemeConfig) => {
    setIsLoading(true);
    setGenerationProgress(5);
    setGenerationStage('🔍 Analyzing natural language prompt & domain intent...');

    // Run realistic multi-stage AI generation progress sequence
    const totalDurationMs = 35000; // ~35 seconds realistic generation time
    const stepMs = 500;
    const steps = totalDurationMs / stepMs;
    let currentProgress = 5;

    for (let i = 0; i < steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepMs));
      currentProgress += (92 - 5) / steps;
      setGenerationProgress(Math.min(95, Math.round(currentProgress)));

      if (currentProgress < 25) {
        setGenerationStage('🔍 Analyzing natural language prompt & domain intent...');
      } else if (currentProgress < 50) {
        setGenerationStage('🧠 Synthesizing dynamic UI layout tree & component specs...');
      } else if (currentProgress < 75) {
        setGenerationStage('🖼️ Resolving high-res topic photography & Tailwind v4 tokens...');
      } else {
        setGenerationStage('🎨 Compiling React 19 JSX widgets, Recharts graphs & tables...');
      }
    }

    setGenerationProgress(100);
    setGenerationStage('✨ Finalizing canvas layout & mounting interactive viewport...');
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      let resultSchema: DynamicUISchema;

      const existingMessages: ChatMessage[] = (isRefine && currentSchema?.messages && currentSchema.messages.length > 0)
        ? currentSchema.messages
        : [
            {
              id: `msg_u_0`,
              role: 'user',
              content: currentSchema?.generatedPrompt || prompt,
              timestamp: 'Just now'
            },
            {
              id: `msg_a_0`,
              role: 'assistant',
              content: currentSchema?.description || "Synthesized full interactive dashboard UI.",
              timestamp: 'Just now',
              sectionsUpdated: currentSchema?.layout?.length || 2
            }
          ];

      const userMsg: ChatMessage = {
        id: `msg_u_${Date.now()}`,
        role: 'user',
        content: prompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updatedHistoryMessages = isRefine ? [...existingMessages, userMsg] : [userMsg];

      // Use a 25-second timeout with AbortController for Gemini generation
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000);

      let data: any = null;
      try {
        const response = await fetch('/api/generate-ui', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            currentSchema: isRefine && currentSchema ? currentSchema : undefined,
            action: isRefine ? 'refine' : 'generate',
            theme: customTheme,
            model: selectedModel
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          data = await response.json();
        }
      } catch (err) {
        console.warn("API call timed out or unfulfilled, proceeding with smart local schema synthesizer.");
      }

      const cleanAndTrimTitle = (title?: string, fallbackPrompt?: string): string => {
        const target = title || fallbackPrompt || "Custom Application";
        const clean = target
          .replace(/^(build|create|design|generate|make|set up|setup|show me|a|an|the|modern|premium|visually|appealing|mobile|web|ui)\s+/i, '')
          .trim();
        const words = clean.split(/\s+/);
        if (words.length > 5 || clean.length > 40) {
          const shortTitle = words.slice(0, 4).join(' ');
          return shortTitle.charAt(0).toUpperCase() + shortTitle.slice(1) + '...';
        }
        return clean.charAt(0).toUpperCase() + clean.slice(1);
      };

      const isDomainChange = currentSchema && (
        (prompt.toLowerCase().includes('hotel') && !currentSchema.generatedPrompt?.toLowerCase().includes('hotel')) ||
        (prompt.toLowerCase().includes('food') && !currentSchema.generatedPrompt?.toLowerCase().includes('food')) ||
        (prompt.toLowerCase().includes('ride') && !currentSchema.generatedPrompt?.toLowerCase().includes('ride')) ||
        (prompt.toLowerCase().includes('remind') && !currentSchema.generatedPrompt?.toLowerCase().includes('remind'))
      );

      if (data && data.schema) {
        resultSchema = data.schema;
        resultSchema.title = cleanAndTrimTitle(resultSchema.title, prompt);
      } else if (isRefine && currentSchema && !isDomainChange) {
        resultSchema = refineSchemaLocally(currentSchema, prompt);
      } else if (selectedTemplate && selectedTemplate.schema && !isDomainChange) {
        resultSchema = {
          ...selectedTemplate.schema,
          id: `schema_${Date.now()}`,
          generatedPrompt: prompt,
          title: selectedTemplate.title,
          description: selectedTemplate.description || `Generated from template "${selectedTemplate.title}"`
        };
      } else {
        resultSchema = generateDynamicDomainSchema(prompt, customTheme);
      }

      if (customTheme) {
        resultSchema = {
          ...resultSchema,
          theme: {
            ...(resultSchema.theme || {}),
            ...customTheme
          }
        };
      }

      if (isRefine && currentSchema && !isDomainChange) {
        resultSchema = {
          ...resultSchema,
          id: currentSchema.id,
          title: currentSchema.title,
          description: resultSchema.description || currentSchema.description
        };
      }

      const assistantReply: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        role: 'assistant',
        content: `I've updated the UI schema for: "${prompt}". Applied components and layout updates to the preview canvas.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sectionsUpdated: resultSchema.layout?.length || 2
      };

      const finalSchemaWithMessages: DynamicUISchema = {
        ...resultSchema,
        messages: [...updatedHistoryMessages, assistantReply]
      };

      setCurrentSchema(finalSchemaWithMessages);
      setProjectHistory(prev => [
        finalSchemaWithMessages,
        ...prev.filter(p => p.id !== finalSchemaWithMessages.id)
      ]);
      setSelectedTemplate(null);
      setInitialPrompt('');
      setActiveNav('chats');
      setIsViewingChatDetail(true);
      setActiveTab('preview');
    } catch (err: any) {
      console.error("UI Generation failed, using local generator:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeDraftId={activeDraftId}
        onSelectDraft={handleSelectDraft}
        onNewChat={handleNewChat}
        activeNav={activeNav}
        setActiveNav={handleNavChange}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        userEmail="chmounikaxyz-4795"
        projects={projectHistory}
        onSelectProject={handleSelectProject}
        currentProjectId={currentSchema?.id}
      />

      {/* Main Studio Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#fafafa]">
        {activeNav === 'design_systems' ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <DesignSystemsView
              onApplyThemeToActive={handleApplyThemeToActive}
              onGenerateWithTheme={(prompt, theme) => handleGenerateUI(prompt, false, theme)}
              currentSchemaTitle={currentSchema?.title}
              activeAppTheme={currentSchema?.theme}
            />
          </div>
        ) : activeNav === 'templates' ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <TemplatesView
              onSelectPreset={handleSelectTemplateForChat}
              onNewChat={handleNewChat}
            />
          </div>
        ) : activeNav === 'projects' ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <ProjectsView
              projects={projectHistory}
              currentSchemaId={currentSchema?.id}
              onSelectProject={handleSelectProject}
              onDeleteProject={handleDeleteProject}
              onNewProjectClick={handleNewChat}
            />
          </div>
        ) : activeNav === 'chats' && !isViewingChatDetail ? (
          /* Full Page Chats History List View */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <ChatsHistoryView
              projects={projectHistory}
              currentSchemaId={currentSchema?.id}
              onSelectChat={handleSelectProject}
              onDeleteProject={handleDeleteProject}
              onNewChat={handleNewChat}
            />
          </div>
        ) : activeNav === 'home' && !currentSchema ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center my-auto">
            <PromptBar
              onGenerate={handleGenerateUI}
              isLoading={isLoading}
              currentPrompt={initialPrompt}
              hasActiveSchema={false}
              selectedTemplate={selectedTemplate}
              onClearTemplate={() => {
                setSelectedTemplate(null);
                setInitialPrompt('');
              }}
              onSelectTemplate={handleSelectTemplateForChat}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
          </div>
        ) : (
          /* Split Workspace Layout: Chat on Left, Preview on Right */
          <div className="flex-1 flex h-full overflow-hidden">
            {/* Left Chat Panel */}
            <ChatsView
              projects={projectHistory}
              currentSchema={activeRenderSchema}
              onSelectProject={handleSelectProject}
              onDeleteProject={handleDeleteProject}
              onNewChat={handleNewChat}
              onGenerate={handleGenerateUI}
              isLoading={isLoading}
              onBackToList={() => setIsViewingChatDetail(false)}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />

            {/* Right Preview Workspace */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#fafafa]">
              {/* Top Header Navigation */}
              {activeRenderSchema ? (
                <header className="bg-white border-b border-zinc-200/80 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
                  <div className="flex items-center gap-3 min-w-0">
                    {sidebarCollapsed && (
                      <button
                        onClick={() => setSidebarCollapsed(false)}
                        className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <PanelLeft className="w-4 h-4" />
                      </button>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold text-zinc-900 truncate">
                          {activeRenderSchema.title}
                        </h2>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-medium border border-emerald-200 shrink-0">
                          Dynamic UI
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate max-w-md">
                        {activeRenderSchema.description}
                      </p>
                    </div>
                  </div>

                  {/* View Tabs & Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Device Selector */}
                    {activeTab === 'preview' && (
                      <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/80 text-xs">
                        <button
                          onClick={() => setPreviewDevice('desktop')}
                          title="Desktop View"
                          className={`p-1.5 rounded-md transition-all cursor-pointer ${
                            previewDevice === 'desktop'
                              ? 'bg-white text-zinc-900 shadow-2xs font-semibold'
                              : 'text-zinc-500 hover:text-zinc-800'
                          }`}
                        >
                          <Monitor className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPreviewDevice('tablet')}
                          title="Tablet View"
                          className={`p-1.5 rounded-md transition-all cursor-pointer ${
                            previewDevice === 'tablet'
                              ? 'bg-white text-zinc-900 shadow-2xs font-semibold'
                              : 'text-zinc-500 hover:text-zinc-800'
                          }`}
                        >
                          <Tablet className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPreviewDevice('mobile')}
                          title="Mobile View"
                          className={`p-1.5 rounded-md transition-all cursor-pointer ${
                            previewDevice === 'mobile'
                              ? 'bg-white text-zinc-900 shadow-2xs font-semibold'
                              : 'text-zinc-500 hover:text-zinc-800'
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/80 text-xs">
                      <button
                        onClick={() => setActiveTab('preview')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                          activeTab === 'preview'
                            ? 'bg-white text-zinc-900 shadow-2xs'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('code')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                          activeTab === 'code'
                            ? 'bg-white text-zinc-900 shadow-2xs'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        <Code className="w-3.5 h-3.5" />
                        <span>Code / Schema</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setIsInspectorOpen(true)}
                      className="bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Code className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Inspect JSON</span>
                    </button>
                  </div>
                </header>
              ) : null}

              {/* Preview Content Area */}
              {(() => {
                const canvasStyles = getThemeStyles(activeRenderSchema?.theme);
                const isCodeTab = activeTab === 'code';
                
                // Outer container background and classes
                const outerBgClass = isCodeTab
                  ? 'bg-zinc-950'
                  : 'bg-[#f4f5f6] dark:bg-[#080a13] bg-grid-pattern';
                  
                const outerStyle = isCodeTab
                  ? {}
                  : {
                      '--grid-dot-color': canvasStyles.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(9,9,11,0.08)',
                      ...canvasStyles.fontFamilyStyle
                    };

                return (
                  <div
                    className={`flex-1 overflow-y-auto p-4 md:p-6 transition-colors duration-250 flex justify-center items-start ${outerBgClass}`}
                    style={outerStyle as React.CSSProperties}
                  >
                    {isCodeTab && activeRenderSchema ? (
                      <div className="w-full max-w-5xl bg-zinc-900 text-zinc-100 rounded-2xl p-6 font-mono text-xs overflow-x-auto shadow-lg border border-zinc-800 my-4">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
                          <span className="text-zinc-400 font-semibold">schema.json</span>
                          <span className="text-[11px] text-emerald-400 font-bold">Validated Dynamic UI Schema</span>
                        </div>
                        <pre>{JSON.stringify(activeRenderSchema, null, 2)}</pre>
                      </div>
                    ) : activeRenderSchema ? (
                      /* Device Simulator Frame Wrapping */
                      (() => {
                        const isDesktop = previewDevice === 'desktop';
                        const isTablet = previewDevice === 'tablet';
                        const isMobile = previewDevice === 'mobile';

                        const frameContainerClass = isDesktop
                          ? 'w-full max-w-6xl my-4 transition-all duration-300'
                          : isTablet
                          ? 'w-[768px] h-[920px] border-[10px] border-zinc-900 dark:border-zinc-800 rounded-[28px] shadow-2xl overflow-hidden shrink-0 transition-all duration-300 my-6 bg-white dark:bg-zinc-950'
                          : 'w-[375px] h-[720px] border-[12px] border-zinc-950 dark:border-zinc-850 rounded-[44px] shadow-2xl overflow-hidden shrink-0 relative transition-all duration-300 my-8 bg-zinc-950';

                        const promptOrTitle = (activeRenderSchema?.generatedPrompt || activeRenderSchema?.title || '').toLowerCase();
                        const categoryStr = (activeRenderSchema?.category || '').toLowerCase();
                        const schemaId = (activeRenderSchema?.id || '').toLowerCase();

                        const isFoodApp = 
                          categoryStr.includes('food') ||
                          categoryStr.includes('dining') ||
                          categoryStr.includes('restaurant') ||
                          schemaId.startsWith('foodrush') ||
                          promptOrTitle.includes('food') ||
                          promptOrTitle.includes('restaurant') ||
                          promptOrTitle.includes('swiggy') ||
                          promptOrTitle.includes('zomato') ||
                          promptOrTitle.includes('foodrush') ||
                          promptOrTitle.includes('food-delivery') ||
                          promptOrTitle.includes('pizza') ||
                          promptOrTitle.includes('burger') ||
                          promptOrTitle.includes('biryani') ||
                          promptOrTitle.includes('gourmet');

                        if (isFoodApp) {
                          return (
                            <div className={frameContainerClass}>
                              <div className={`flex flex-col ${isDesktop ? 'w-full min-h-[685px] rounded-3xl border shadow-lg' : 'h-full w-full'} overflow-hidden`}>
                                <FoodRushApp />
                              </div>
                            </div>
                          );
                        }

                        const isRideApp = 
                          categoryStr.includes('ride') ||
                          categoryStr.includes('transport') ||
                          categoryStr.includes('cab') ||
                          categoryStr.includes('taxi') ||
                          schemaId.startsWith('ridex') ||
                          promptOrTitle.includes('ride') ||
                          promptOrTitle.includes('ridex') ||
                          promptOrTitle.includes('uber') ||
                          promptOrTitle.includes('cab') ||
                          promptOrTitle.includes('taxi') ||
                          promptOrTitle.includes('driver');

                        if (isRideApp) {
                          return (
                            <div className={frameContainerClass}>
                              <div className={`flex flex-col ${isDesktop ? 'w-full min-h-[685px] rounded-3xl border shadow-lg' : 'h-full w-full'} overflow-hidden`}>
                                <RideXApp />
                              </div>
                            </div>
                          );
                        }

                        const isReminderApp = 
                          categoryStr.includes('reminder') ||
                          categoryStr.includes('alarm') ||
                          schemaId.startsWith('remindme') ||
                          promptOrTitle.includes('remindme') ||
                          promptOrTitle.includes('remind me') ||
                          promptOrTitle.includes('smart alarm') ||
                          promptOrTitle.includes('reminder app') ||
                          promptOrTitle.includes('alarm app');

                        if (isReminderApp) {
                          return (
                            <div className={frameContainerClass}>
                              <div className={`flex flex-col ${isDesktop ? 'w-full min-h-[685px] rounded-3xl border shadow-lg' : 'h-full w-full'} overflow-hidden`}>
                                <RemindMeApp />
                              </div>
                            </div>
                          );
                        }

                        const isHotelApp = 
                          categoryStr.includes('hotel') ||
                          categoryStr.includes('resort') ||
                          categoryStr.includes('villa') ||
                          schemaId.startsWith('hotel') ||
                          promptOrTitle.includes('hotel') ||
                          promptOrTitle.includes('resort') ||
                          promptOrTitle.includes('villa') ||
                          promptOrTitle.includes('stay') ||
                          promptOrTitle.includes('suite');

                        if (isHotelApp) {
                          return (
                            <div className={frameContainerClass}>
                              <div className={`flex flex-col ${isDesktop ? 'w-full min-h-[685px] rounded-3xl border shadow-lg' : 'h-full w-full'} overflow-hidden`}>
                                <HotelLuxApp />
                              </div>
                            </div>
                          );
                        }



                        const innerContent = (
                          <div className={`flex flex-col ${isDesktop ? 'w-full min-h-[655px] rounded-2xl border shadow-sm' : 'h-full w-full'} ${canvasStyles.cardBgClass} ${canvasStyles.cardBorderClass} overflow-hidden`}>
                            {/* 1. Top Navbar Mockup */}
                            <div className={`px-4 py-3 border-b ${canvasStyles.dividerBorderClass} flex items-center justify-between shrink-0 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md z-20`}>
                              <div className="flex items-center gap-3 min-w-0">
                                {isMobile ? (
                                  <button className="p-1 -ml-1 text-zinc-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0">
                                    <Menu className="w-4 h-4" />
                                  </button>
                                ) : null}
                                <div className="flex items-center gap-2 shrink-0">
                                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: canvasStyles.primaryColorHex }} />
                                  <span className={`text-xs font-extrabold tracking-tight ${canvasStyles.textPrimaryClass}`}>
                                    {(activeRenderSchema?.title || 'App').split(' ')[0]}Suite
                                  </span>
                                </div>
                                {!isMobile && (
                                  <nav className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 ml-4 shrink-0">
                                    <span
                                      onClick={() => setActiveSubTab('dashboard')}
                                      className={`cursor-pointer transition-colors ${activeSubTab === 'dashboard' ? canvasStyles.textPrimaryClass : 'hover:text-zinc-900 dark:hover:text-zinc-200'}`}
                                    >
                                      Overview
                                    </span>
                                    <span
                                      onClick={() => setActiveSubTab('operations')}
                                      className={`cursor-pointer transition-colors ${activeSubTab === 'operations' ? canvasStyles.textPrimaryClass : 'hover:text-zinc-900 dark:hover:text-zinc-200'}`}
                                    >
                                      Operations
                                    </span>
                                    <span
                                      onClick={() => setActiveSubTab('analytics')}
                                      className={`cursor-pointer transition-colors ${activeSubTab === 'analytics' ? canvasStyles.textPrimaryClass : 'hover:text-zinc-900 dark:hover:text-zinc-200'}`}
                                    >
                                      Analytics
                                    </span>
                                  </nav>
                                )}
                              </div>

                              <div className="flex items-center gap-2.5 shrink-0">
                                {!isMobile && (
                                  <div className="relative w-28 md:w-36">
                                    <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                      type="text"
                                      disabled
                                      placeholder="⌘K Search..."
                                      className={`w-full ${canvasStyles.inputBgClass} border ${canvasStyles.inputBorderClass} rounded-lg pl-6 pr-2 py-0.5 text-[9px] focus:outline-none placeholder-zinc-400`}
                                    />
                                  </div>
                                )}
                                <button className={`p-1 text-zinc-500 hover:${canvasStyles.textPrimaryClass} rounded-lg relative`}>
                                  <Bell className="w-3.5 h-3.5" />
                                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500" />
                                </button>
                                <div className={`w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] font-bold flex items-center justify-center ${canvasStyles.textPrimaryClass}`}>
                                  U
                                </div>
                              </div>
                            </div>

                            {/* 2. Main Area: Sidebar + Scrollable Content */}
                            <div className="flex flex-1 min-h-0 bg-[#fafafa] dark:bg-[#0b0f19]">
                              {/* Left Side Navigation Menu */}
                              {!isMobile && (
                                  <aside className={`w-14 sm:w-40 border-r ${canvasStyles.dividerBorderClass} p-3 flex flex-col justify-between ${canvasStyles.subCardBgClass} text-[10px] font-bold text-zinc-500 shrink-0`}>
                                    <div className="space-y-1">
                                      {getSidebarLinks(activeRenderSchema).map((link) => (
                                        <div
                                          key={link.label}
                                          onClick={() => setActiveSubTab(link.tabId as any)}
                                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                                            activeSubTab === link.tabId
                                              ? `bg-zinc-150/40 text-zinc-900 dark:bg-zinc-850/40 dark:text-zinc-100 shadow-3xs`
                                              : `hover:text-zinc-950 dark:hover:text-zinc-200`
                                          }`}
                                        >
                                          <DynamicIcon name={link.icon} className="w-3.5 h-3.5 opacity-80 shrink-0" />
                                          <span className="hidden sm:inline">{link.label}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="px-2 py-1 text-[9px] text-zinc-400 font-mono tracking-tight hidden sm:block">
                                      v1.0.4 • API OK
                                    </div>
                                  </aside>
                                )}

                              {/* 3. Dashboard Scrollable Viewport */}
                              <div className={`flex-1 overflow-y-auto ${isDesktop ? 'p-6 sm:p-8' : isTablet ? 'p-6' : 'p-4'} space-y-6 ${canvasStyles.containerBgClass}`}>
                                <AnimatePresence mode="wait">
                                  <motion.div
                                    key={activeRenderSchema.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-6 pb-16"
                                  >
                                    {activeSubTab === 'dashboard' && (
                                      <>
                                        {/* Dashboard Section Header */}
                                        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${canvasStyles.dividerBorderClass} pb-4`}>
                                          <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                              <h1 className={`text-base md:text-lg font-extrabold tracking-tight ${canvasStyles.textPrimaryClass}`}>
                                                {(activeRenderSchema.title || '').replace(/[\*\#\`\_]+/g, '').trim()}
                                              </h1>
                                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${canvasStyles.accentBadgeClass} shrink-0`}>
                                                v1.0.0
                                              </span>
                                            </div>
                                            <p className={`text-xs ${canvasStyles.textSecondaryClass} mt-0.5`}>
                                              {activeRenderSchema.description}
                                            </p>
                                          </div>
                                          <button className={`px-3 py-1.5 text-[10px] font-bold ${canvasStyles.accentBgClass} rounded-lg shadow-2xs hover:opacity-90 transition-all shrink-0 cursor-pointer`}>
                                            + Add Widget
                                          </button>
                                        </div>

                                        {/* KPI Metrics */}
                                        {activeRenderSchema.metrics && activeRenderSchema.metrics.length > 0 && (
                                          <MetricsBar metrics={activeRenderSchema.metrics} theme={activeRenderSchema.theme} device={previewDevice} />
                                        )}

                                        {/* Section Grid Components */}
                                        <div className="space-y-8">
                                          {activeRenderSchema.layout.map(section => {
                                            const renderedComponents = section.components;
                                            
                                            return (
                                              <div key={section.id} className="space-y-3">
                                                {section.title && (
                                                  <h3 className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${canvasStyles.textSecondaryClass}`}>
                                                    <LayoutGrid className="w-3.5 h-3.5 opacity-60" />
                                                    {section.title}
                                                  </h3>
                                                )}

                                                <div
                                                  className={`grid grid-cols-1 ${
                                                    isMobile
                                                      ? 'grid-cols-1'
                                                      : section.gridCols === 2
                                                      ? 'lg:grid-cols-2'
                                                      : section.gridCols === 3
                                                      ? 'lg:grid-cols-3'
                                                      : 'grid-cols-1'
                                                  } ${canvasStyles.densityGapClass}`}
                                                >
                                                  {renderedComponents.map(comp => (
                                                    <ComponentRenderer 
                                                      key={comp.id} 
                                                      component={comp} 
                                                      theme={activeRenderSchema.theme} 
                                                      onStateChange={handleStateChange}
                                                      device={previewDevice}
                                                    />
                                                  ))}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </>
                                    )}

                                    {activeSubTab === 'analytics' && (
                                      <>
                                        {/* Analytics Section Header */}
                                        <div className={`flex flex-col border-b ${canvasStyles.dividerBorderClass} pb-4`}>
                                          <h1 className={`text-base md:text-lg font-extrabold tracking-tight ${canvasStyles.textPrimaryClass}`}>
                                            Analytics & Performance
                                          </h1>
                                          <p className={`text-xs ${canvasStyles.textSecondaryClass} mt-0.5`}>
                                            Deep-dive calculations, comparative trends, and visual performance charts.
                                          </p>
                                        </div>

                                        {/* KPI Metrics */}
                                        {activeRenderSchema.metrics && activeRenderSchema.metrics.length > 0 && (
                                          <MetricsBar metrics={activeRenderSchema.metrics} theme={activeRenderSchema.theme} device={previewDevice} />
                                        )}

                                        {/* Section Grid: Charts */}
                                        <div className="space-y-8">
                                          {(() => {
                                            const chartSections = activeRenderSchema.layout.map(section => {
                                              const charts = section.components.filter(c => c.type === 'chart');
                                              return { ...section, components: charts };
                                            }).filter(section => section.components.length > 0);

                                            if (chartSections.length > 0) {
                                              return chartSections.map(section => (
                                                <div key={section.id} className="space-y-3">
                                                  <div
                                                    className={`grid grid-cols-1 ${
                                                      isMobile ? 'grid-cols-1' : 'lg:grid-cols-2'
                                                    } ${canvasStyles.densityGapClass}`}
                                                  >
                                                    {section.components.map(comp => (
                                                      <ComponentRenderer 
                                                        key={comp.id} 
                                                        component={comp} 
                                                        theme={activeRenderSchema.theme} 
                                                        onStateChange={handleStateChange}
                                                        device={previewDevice}
                                                      />
                                                    ))}
                                                  </div>
                                                </div>
                                              ));
                                            }

                                            // Fallback simulated chart
                                            return (
                                              <div className={`p-6 rounded-xl border ${canvasStyles.cardBgClass} ${canvasStyles.cardBorderClass} ${canvasStyles.cardShadowClass} space-y-4`}>
                                                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                                                  <div>
                                                    <h3 className={`text-xs font-bold uppercase tracking-wider ${canvasStyles.textPrimaryClass}`}>Simulated Performance Analysis</h3>
                                                    <p className={`text-[10px] ${canvasStyles.textSecondaryClass}`}>Historical trends compiled from KPI parameters.</p>
                                                  </div>
                                                </div>
                                                <div className="h-56 flex items-end justify-between gap-3 pt-6 px-4">
                                                  {[60, 85, 45, 92, 70, 88, 95].map((val, idx) => (
                                                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                                      <div className="w-full relative bg-zinc-100 dark:bg-zinc-850 rounded-md overflow-hidden h-40 flex items-end">
                                                        <div 
                                                          className="w-full bg-zinc-250 group-hover:opacity-90 transition-all rounded-t-sm" 
                                                          style={{ height: `${val}%`, backgroundColor: canvasStyles.primaryColorHex }} 
                                                        />
                                                      </div>
                                                      <span className="text-[9px] text-zinc-400 font-semibold font-mono">Day {idx + 1}</span>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            );
                                          })()}
                                        </div>
                                      </>
                                    )}

                                    {activeSubTab === 'operations' && (
                                      <>
                                        {/* Operations Section Header */}
                                        <div className={`flex flex-col border-b ${canvasStyles.dividerBorderClass} pb-4`}>
                                          <h1 className={`text-base md:text-lg font-extrabold tracking-tight ${canvasStyles.textPrimaryClass}`}>
                                            Operations Control Panel
                                          </h1>
                                          <p className={`text-xs ${canvasStyles.textSecondaryClass} mt-0.5`}>
                                            Task execution pipelines, item databases, and automated workflows.
                                          </p>
                                        </div>

                                        {/* Section Grid: Kanban & Tables */}
                                        <div className="space-y-8">
                                          {(() => {
                                            const opsSections = activeRenderSchema.layout.map(section => {
                                              const ops = section.components.filter(c => c.type === 'table' || c.type === 'kanban' || c.type === 'action_list' || c.type === 'alert');
                                              return { ...section, components: ops };
                                            }).filter(section => section.components.length > 0);

                                            if (opsSections.length > 0) {
                                              return opsSections.map(section => (
                                                <div key={section.id} className="space-y-3">
                                                  <div className="grid grid-cols-1 gap-6">
                                                    {section.components.map(comp => (
                                                      <ComponentRenderer 
                                                        key={comp.id} 
                                                        component={comp} 
                                                        theme={activeRenderSchema.theme} 
                                                        onStateChange={handleStateChange}
                                                        device={previewDevice}
                                                      />
                                                    ))}
                                                  </div>
                                                </div>
                                              ));
                                            }

                                            // Fallback simulated logs
                                            return (
                                              <div className={`p-5 rounded-xl border ${canvasStyles.cardBgClass} ${canvasStyles.cardBorderClass} ${canvasStyles.cardShadowClass} space-y-3`}>
                                                <h3 className={`text-xs font-bold uppercase tracking-wider ${canvasStyles.textPrimaryClass}`}>Simulated Operations Log Feed</h3>
                                                <div className="space-y-2">
                                                  {[
                                                    { time: '10:45 AM', msg: 'Sync completed successfully.', status: 'success' },
                                                    { time: '09:12 AM', msg: 'Database backup initiated.', status: 'info' },
                                                    { time: '08:00 AM', msg: 'Automated morning routine triggered.', status: 'success' }
                                                  ].map((item, idx) => (
                                                    <div key={idx} className={`p-2.5 rounded-lg border ${canvasStyles.subCardBgClass} ${canvasStyles.subCardBorderClass} flex items-center justify-between text-[10px]`}>
                                                      <span className="text-zinc-400 font-mono">{item.time}</span>
                                                      <span className={`font-medium ${canvasStyles.textPrimaryClass}`}>{item.msg}</span>
                                                      <span className={`px-1.5 py-0.5 rounded-md font-bold uppercase text-[8px] ${
                                                        item.status === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                                                      }`}>{item.status}</span>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            );
                                          })()}
                                        </div>

                                        {/* Workflows Panel */}
                                        {activeRenderSchema.workflows && activeRenderSchema.workflows.length > 0 && (
                                          <WorkflowPanel workflows={activeRenderSchema.workflows} theme={activeRenderSchema.theme} />
                                        )}
                                      </>
                                    )}

                                    {activeSubTab === 'settings' && (
                                      <div className="space-y-6">
                                        <div className={`flex flex-col border-b ${canvasStyles.dividerBorderClass} pb-4`}>
                                          <h1 className={`text-base md:text-lg font-extrabold tracking-tight ${canvasStyles.textPrimaryClass}`}>
                                            Application Settings
                                          </h1>
                                          <p className={`text-xs ${canvasStyles.textSecondaryClass} mt-0.5`}>
                                            Configure layout parameters and color tokens dynamically.
                                          </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          {/* Accent Color picker */}
                                          <div className={`p-5 rounded-xl border ${canvasStyles.cardBgClass} ${canvasStyles.cardBorderClass} ${canvasStyles.cardShadowClass} space-y-4`}>
                                            <h3 className={`text-xs font-bold uppercase tracking-wider ${canvasStyles.textPrimaryClass}`}>
                                              Accent Palette Selection
                                            </h3>
                                            <div className="space-y-3">
                                              <div>
                                                <span className={`text-[10px] ${canvasStyles.textSecondaryClass} block mb-1.5`}>Accent Color</span>
                                                <div className="flex flex-wrap gap-2">
                                                  {['emerald', 'indigo', 'violet', 'amber', 'rose', 'sky', 'cyan'].map(color => (
                                                    <button
                                                      key={color}
                                                      onClick={() => {
                                                        const updated = { ...activeRenderSchema };
                                                        updated.theme = { ...updated.theme, accentColor: color };
                                                        setCurrentSchema(updated);
                                                        setProjectHistory(prev => prev.map(p => p.id === activeRenderSchema.id ? updated : p));
                                                      }}
                                                      className={`px-2.5 py-1 text-[9px] font-bold rounded-md border capitalize cursor-pointer transition-all ${
                                                        activeRenderSchema.theme?.accentColor === color
                                                          ? `${canvasStyles.accentBgClass} text-white border-transparent`
                                                          : `${canvasStyles.subCardBgClass} ${canvasStyles.subCardBorderClass} ${canvasStyles.textSecondaryClass} hover:border-zinc-450`
                                                      }`}
                                                    >
                                                      {color}
                                                    </button>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Diagnostic info */}
                                          <div className={`p-5 rounded-xl border ${canvasStyles.cardBgClass} ${canvasStyles.cardBorderClass} ${canvasStyles.cardShadowClass} space-y-4`}>
                                            <h3 className={`text-xs font-bold uppercase tracking-wider ${canvasStyles.textPrimaryClass}`}>
                                              Metadata Diagnostics
                                            </h3>
                                            <div className="space-y-2.5 text-[10px]">
                                              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
                                                <span className={canvasStyles.textSecondaryClass}>Connection Mode</span>
                                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">OpenRouter Active</span>
                                              </div>
                                              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
                                                <span className={canvasStyles.textSecondaryClass}>API Token Cost Limit</span>
                                                <span className={`font-mono font-bold ${canvasStyles.textPrimaryClass}`}>4,000 max_tokens</span>
                                              </div>
                                              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
                                                <span className={canvasStyles.textSecondaryClass}>Schema ID</span>
                                                <span className={`font-mono text-zinc-400`}>{activeRenderSchema.id}</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className={canvasStyles.textSecondaryClass}>Application Scope</span>
                                                <span className={`font-semibold ${canvasStyles.textPrimaryClass}`}>{activeRenderSchema.category || 'Custom'}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </motion.div>
                                </AnimatePresence>
                              </div>
                            </div>
                          </div>
                        );

                        return (
                          <div className={frameContainerClass}>
                            {/* Smartphone Island Notch */}
                            {isMobile && (
                              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-zinc-950 dark:bg-zinc-850 rounded-full z-30 flex items-center justify-center gap-1.5 px-3">
                                <span className="w-1 h-1 rounded-full bg-zinc-800 dark:bg-zinc-700" />
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-900/40 dark:bg-zinc-700/40" />
                              </div>
                            )}

                            {innerContent}
                          </div>
                        );
                      })()
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <PromptBar
                          onGenerate={handleGenerateUI}
                          isLoading={isLoading}
                          hasActiveSchema={false}
                          selectedModel={selectedModel}
                          setSelectedModel={setSelectedModel}
                        />
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Schema Modal Inspector */}
      {activeRenderSchema && (
        <SchemaInspectorModal
          schema={activeRenderSchema}
          isOpen={isInspectorOpen}
          onClose={() => setIsInspectorOpen(false)}
        />
      )}

      {/* High-Tech AI Generation Synthesis Progress Modal */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md p-8 rounded-3xl bg-zinc-900 border border-zinc-800 text-white shadow-2xl space-y-6 text-center relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              {/* Animated Pulsing Icon */}
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-cyan-500 p-0.5 shadow-xl shadow-amber-500/20 animate-pulse">
                <div className="w-full h-full bg-zinc-950 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
                </div>
              </div>

              {/* Dynamic Stage Text */}
              <div className="space-y-1.5">
                <h3 className="text-base font-black tracking-tight">Synthesizing Generative UI</h3>
                <p className="text-xs text-amber-400 font-bold min-h-[36px] flex items-center justify-center px-4 leading-snug">
                  {generationStage}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full h-3 rounded-full bg-zinc-950 p-0.5 border border-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 via-indigo-500 to-cyan-400 transition-all duration-300 shadow-md shadow-amber-500/50"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-extrabold px-1">
                  <span>AI Code Compiler v2.5</span>
                  <span className="text-amber-400 font-mono text-xs">{generationProgress}%</span>
                </div>
              </div>

              {/* Live Terminal Preview */}
              <div className="p-3.5 rounded-2xl bg-black/70 border border-zinc-800/80 text-left font-mono text-[10px] text-zinc-400 space-y-1.5">
                <div className="flex items-center justify-between text-[9px] text-zinc-500 border-b border-zinc-800 pb-1">
                  <span>BUILD PIPELINE</span>
                  <span className="text-emerald-400 font-bold">STATUS: RUNNING</span>
                </div>
                <p className="text-emerald-400">✓ Extracting domain intent keywords...</p>
                <p className="text-cyan-400">✓ Resolving Unsplash HD topic media...</p>
                <p className="text-amber-300 animate-pulse">⚙ Compiling React 19 JSX & Recharts graphs...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Fallbacks for Instant Preset Switching
function getSaasFallbackSchema(prompt: string): DynamicUISchema {
  return {
    id: 'gen_saas_mrr',
    title: "SaaS MRR & Customer Churn Control Panel",
    description: "Real-time subscription revenue analytics, churn rate monitoring, and tier growth forecast.",
    category: "Sales & SaaS",
    theme: { accentColor: "indigo", style: "modern" },
    generatedPrompt: prompt,
    metrics: [
      { id: 'm1', label: "Monthly Recurring Revenue", value: 84200, change: "+14.2%", trend: "up", subtext: "ARR $1.01M", format: "currency", sparkline: [62000, 68000, 72000, 78000, 81000, 84200] },
      { id: 'm2', label: "Logo Churn Rate", value: "2.1%", change: "-0.4%", trend: "up", subtext: "Lowest in 6 months", format: "percentage", sparkline: [3.2, 2.9, 2.7, 2.5, 2.3, 2.1] },
      { id: 'm3', label: "ARPU (Avg Revenue per User)", value: 148, change: "+$12", trend: "up", subtext: "Driven by Pro upgrades", format: "currency", sparkline: [120, 125, 132, 138, 142, 148] },
      { id: 'm4', label: "Active Subscribers", value: 568, change: "+42 this mo", trend: "up", subtext: "Net retention 112%", format: "number", sparkline: [420, 450, 485, 510, 538, 568] }
    ],
    initialState: {},
    layout: [
      {
        id: 's1',
        title: "MRR Trajectory & Subscription Breakdown",
        gridCols: 2,
        components: [
          {
            id: 'c1',
            type: 'chart',
            chartType: 'area',
            title: "MRR Growth & Expansion Revenue",
            subtitle: "Monthly revenue buildup ($)",
            xAxisKey: "month",
            dataKeys: [
              { key: "mrr", name: "MRR ($)", color: "#18181b" },
              { key: "expansion", name: "Expansion ($)", color: "#10b981" }
            ],
            data: [
              { month: "Jan", mrr: 62000, expansion: 4500 },
              { month: "Feb", mrr: 68000, expansion: 5200 },
              { month: "Mar", mrr: 72000, expansion: 6100 },
              { month: "Apr", mrr: 78000, expansion: 7400 },
              { month: "May", mrr: 81000, expansion: 8200 },
              { month: "Jun", mrr: 84200, expansion: 9100 }
            ]
          },
          {
            id: 'c2',
            type: 'chart',
            chartType: 'pie',
            title: "Subscriber Tier Distribution",
            subtitle: "Revenue share by plan tier",
            dataKeys: [{ key: "value", name: "Revenue ($)", color: "#18181b" }],
            data: [
              { name: "Enterprise ($499/mo)", value: 42000, color: "#18181b" },
              { name: "Pro Plan ($149/mo)", value: 28000, color: "#2563eb" },
              { name: "Starter ($49/mo)", value: 14200, color: "#10b981" }
            ]
          }
        ]
      },
      {
        id: 's2',
        title: "Accounts Ledger",
        gridCols: 1,
        components: [
          {
            id: 't1',
            type: 'table',
            title: "Top Enterprise Accounts",
            searchable: true,
            exportable: true,
            columns: [
              { key: "company", label: "Company / Customer", type: "text" },
              { key: "tier", label: "Subscription Tier", type: "badge", badgeColorMap: { "Enterprise": "bg-zinc-100 text-zinc-900 border-zinc-300", "Pro": "bg-blue-50 text-blue-700 border-blue-200" } },
              { key: "mrr", label: "Monthly Spend", type: "currency" },
              { key: "status", label: "Account Health", type: "badge", badgeColorMap: { "Healthy": "bg-emerald-50 text-emerald-700 border-emerald-200", "At Risk": "bg-amber-50 text-amber-700 border-amber-200" } }
            ],
            data: [
              { company: "Acme Corp", tier: "Enterprise", mrr: 1499, status: "Healthy" },
              { company: "Nexus Systems", tier: "Enterprise", mrr: 2499, status: "Healthy" },
              { company: "CloudScale Inc", tier: "Enterprise", mrr: 1999, status: "At Risk" },
              { company: "Vortex Digital", tier: "Pro", mrr: 499, status: "Healthy" }
            ]
          }
        ]
      }
    ]
  };
}

function getHiringFallbackSchema(prompt: string): DynamicUISchema {
  return {
    id: 'gen_hiring_pipeline',
    title: "Candidate Recruitment & Interview Center",
    description: "Applicant pipeline, interview scorecard feedback, skill evaluation, and stage actions.",
    category: "HR & Operations",
    theme: { accentColor: "violet", style: "modern" },
    generatedPrompt: prompt,
    metrics: [
      { id: 'm1', label: "Open Roles", value: 8, change: "3 urgent", trend: "neutral", subtext: "Engineering & GTM", format: "number" },
      { id: 'm2', label: "Active Candidates", value: 42, change: "+12 this week", trend: "up", subtext: "Across 4 stages", format: "number" },
      { id: 'm3', label: "Avg Time to Hire", value: "24 Days", change: "-4 days", trend: "up", subtext: "Target: 21 days", format: "text" },
      { id: 'm4', label: "Offer Acceptance", value: "85%", change: "+5%", trend: "up", subtext: "8 of 10 accepted", format: "percentage" }
    ],
    initialState: {},
    layout: [
      {
        id: 's1',
        gridCols: 1,
        components: [
          {
            id: 'kanban_candidates',
            type: 'kanban',
            title: "Candidate Pipeline Stages",
            columns: [
              { id: 'applied', title: 'Screening (12)', color: '#18181b' },
              { id: 'interview', title: 'Technical Interview (8)', color: '#2563eb' },
              { id: 'offer', title: 'Offer Stage (3)', color: '#10b981' }
            ],
            items: [
              { id: 'c1', columnId: 'applied', title: 'Alex Mercer', subtitle: 'Senior Full Stack Engineer', assignee: 'Sarah (Recruiter)', priority: 'high' },
              { id: 'c2', columnId: 'interview', title: 'Elena Rostova', subtitle: 'Lead Product Designer', assignee: 'Michael (PM)', priority: 'high' },
              { id: 'c3', columnId: 'offer', title: 'David Kim', subtitle: 'DevOps Architect', assignee: 'VP Eng', priority: 'medium' }
            ]
          }
        ]
      }
    ]
  };
}

function getInventoryFallbackSchema(prompt: string): DynamicUISchema {
  return {
    id: 'gen_inventory',
    title: "E-Commerce Inventory & Supply Chain Monitor",
    description: "Real-time SKU stock levels, low-stock reorder alerts, and demand forecast.",
    category: "Operations",
    theme: { accentColor: "cyan", style: "modern" },
    generatedPrompt: prompt,
    metrics: [
      { id: 'm1', label: "Total SKUs Managed", value: 1240, change: "+15 new", trend: "up", format: "number" },
      { id: 'm2', label: "Low Stock Alerts", value: 4, change: "Requires reorder", trend: "down", format: "number" },
      { id: 'm3', label: "Warehouse Value", value: 420000, change: "+$25K", trend: "up", format: "currency" }
    ],
    initialState: {},
    layout: [
      {
        id: 's1',
        gridCols: 2,
        components: [
          {
            id: 'chart_demand',
            type: 'chart',
            chartType: 'line',
            title: "Weekly Demand Forecast & Stock Orders",
            xAxisKey: "week",
            dataKeys: [
              { key: "demand", name: "Demand (Units)", color: "#2563eb" },
              { key: "stock", name: "Stock Level", color: "#10b981" }
            ],
            data: [
              { week: "W1", demand: 450, stock: 1200 },
              { week: "W2", demand: 520, stock: 1050 },
              { week: "W3", demand: 610, stock: 890 },
              { week: "W4", demand: 700, stock: 720 }
            ]
          },
          {
            id: 'alert_stock',
            type: 'alert',
            title: "Reorder Needed for SKU #8842",
            severity: "warning",
            message: "Stock level for Ergonomic Desk Chair dropped to 14 units (Threshold: 25).",
            actionLabel: "Trigger Reorder Workflow"
          }
        ]
      }
    ]
  };
}

function getHabitFallbackSchema(prompt: string): DynamicUISchema {
  return {
    id: 'gen_habit',
    title: "Personal Habit & Focus Operating System",
    description: "Track habit completion streaks, focus session logs, and wellness analytics.",
    category: "Personal Growth",
    theme: { accentColor: "rose", style: "modern" },
    generatedPrompt: prompt,
    metrics: [
      { id: 'm1', label: "Current Focus Streak", value: "12 Days", change: "Personal Best", trend: "up", format: "text" },
      { id: 'm2', label: "Weekly Completion Rate", value: "92%", change: "+8%", trend: "up", format: "percentage" },
      { id: 'm3', label: "Deep Work Hours", value: "34.5 hrs", change: "+4 hrs", trend: "up", format: "text" }
    ],
    initialState: {},
    layout: [
      {
        id: 's1',
        gridCols: 2,
        components: [
          {
            id: 'chart_habits',
            type: 'chart',
            chartType: 'bar',
            title: "Daily Completion Hours",
            xAxisKey: "day",
            dataKeys: [{ key: "hours", name: "Focus Hours", color: "#18181b" }],
            data: [
              { day: "Mon", hours: 6.5 },
              { day: "Tue", hours: 7.2 },
              { day: "Wed", hours: 8.0 },
              { day: "Thu", hours: 6.0 },
              { day: "Fri", hours: 6.8 }
            ]
          },
          {
            id: 'form_habit_log',
            type: 'form',
            title: "Log Today's Focus Session",
            submitLabel: "Log Session",
            fields: [
              { id: 'f1', name: 'activity', label: 'Activity Name', fieldType: 'text', placeholder: 'e.g. Deep Work / Coding' },
              { id: 'f2', name: 'duration', label: 'Duration (Minutes)', fieldType: 'number', placeholder: '60' }
            ]
          }
        ]
      }
    ]
  };
}
