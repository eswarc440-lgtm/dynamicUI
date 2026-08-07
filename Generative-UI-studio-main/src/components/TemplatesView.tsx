import React, { useState, useRef } from 'react';
import { PresetTemplate } from '../types';
import { PRESET_TEMPLATES } from '../data/presets';
import {
  Search,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Heart,
  Eye,
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { motion } from 'motion/react';

interface TemplatesViewProps {
  onSelectPreset: (preset: PresetTemplate) => void;
  onNewChat: () => void;
}

interface CategoryItem {
  id: string;
  name: string;
  count: number;
  previews: React.ReactNode[];
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  onSelectPreset,
  onNewChat
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const featuredScrollRef = useRef<HTMLDivElement>(null);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Mock Category Data with 2x2 grid previews matching user reference design
  const CATEGORIES: CategoryItem[] = [
    {
      id: 'apps_games',
      name: 'Apps & Games',
      count: 14,
      previews: [
        // Tile 1: Clean Form/Login
        <div key="1" className="w-full h-full bg-zinc-100 dark:bg-zinc-800 p-1.5 flex flex-col items-center justify-center gap-1 rounded">
          <div className="w-3/4 h-1.5 bg-white rounded shadow-2xs" />
          <div className="w-1/2 h-1 bg-zinc-300 rounded" />
          <div className="w-full h-2.5 bg-rose-500 rounded text-[5px] text-white font-bold flex items-center justify-center">SUBMIT</div>
        </div>,
        // Tile 2: Retro Pixel / Grid Canvas
        <div key="2" className="w-full h-full bg-sky-900 p-1 relative rounded overflow-hidden flex flex-col justify-between">
          <div className="grid grid-cols-4 gap-0.5 opacity-60">
            <div className="h-2 bg-amber-400 rounded-xs" />
            <div className="h-2 bg-emerald-400 rounded-xs col-span-2" />
            <div className="h-2 bg-sky-400 rounded-xs" />
          </div>
          <div className="text-[6px] text-amber-300 font-mono font-bold">LEVEL 01</div>
        </div>,
        // Tile 3: Colorful Tetris/Bar board
        <div key="3" className="w-full h-full bg-zinc-900 p-1 flex items-end justify-between gap-0.5 rounded">
          <div className="w-1/4 h-3/4 bg-red-500 rounded-xs" />
          <div className="w-1/4 h-1/2 bg-amber-400 rounded-xs" />
          <div className="w-1/4 h-full bg-emerald-500 rounded-xs" />
          <div className="w-1/4 h-2/3 bg-sky-400 rounded-xs" />
        </div>,
        // Tile 4: Dark arcade banner
        <div key="4" className="w-full h-full bg-emerald-950 p-1.5 flex flex-col justify-center items-center text-center rounded border border-emerald-800/40">
          <span className="text-[6px] font-mono font-black text-emerald-400 leading-none">FRIEDRICHSHAIN</span>
          <span className="text-[5px] font-mono text-emerald-200/80">CONNECTION</span>
        </div>
      ]
    },
    {
      id: 'landing_pages',
      name: 'Landing Pages',
      count: 22,
      previews: [
        // Tile 1: Dark Hero Purple CTA
        <div key="1" className="w-full h-full bg-zinc-950 p-1.5 flex flex-col justify-center items-center text-center gap-1 rounded">
          <div className="w-4/5 h-1 bg-zinc-200 rounded" />
          <div className="px-1.5 py-0.5 bg-indigo-600 rounded-full text-[5px] text-white font-bold">Get Started</div>
        </div>,
        // Tile 2: Portfolio in Minutes
        <div key="2" className="w-full h-full bg-stone-900 p-1.5 flex flex-col justify-between rounded border border-stone-800">
          <span className="text-[6px] font-bold text-stone-100 leading-tight">Build a Portfolio In Minutes</span>
          <div className="w-full h-2 bg-amber-500/20 rounded" />
        </div>,
        // Tile 3: Brutalist Black
        <div key="3" className="w-full h-full bg-black p-1.5 flex flex-col justify-center items-start border border-zinc-800 rounded">
          <span className="text-[6px] font-black tracking-tighter text-white">RAW.</span>
          <span className="text-[6px] font-black tracking-tighter text-white">BRUTAL.</span>
        </div>,
        // Tile 4: Blue Mountain Sky
        <div key="4" className="w-full h-full bg-gradient-to-tr from-sky-900 via-indigo-900 to-sky-700 p-1.5 flex items-end rounded">
          <span className="text-[6px] font-bold text-sky-200">SpaceWalker</span>
        </div>
      ]
    },
    {
      id: 'dashboards',
      name: 'Dashboards',
      count: 18,
      previews: [
        // Tile 1: Orange Analytics
        <div key="1" className="w-full h-full bg-zinc-900 p-1 flex flex-col justify-between rounded">
          <div className="flex justify-between items-center text-[5px] text-orange-400 font-mono"><span>MRR</span><span>$84K</span></div>
          <div className="flex items-end gap-0.5 h-4">
            <div className="w-1/4 h-2 bg-orange-500/40 rounded-xs" />
            <div className="w-1/4 h-3 bg-orange-500/70 rounded-xs" />
            <div className="w-1/4 h-full bg-orange-500 rounded-xs" />
          </div>
        </div>,
        // Tile 2: Clean White Line Chart
        <div key="2" className="w-full h-full bg-white p-1 flex flex-col justify-between rounded border border-zinc-200">
          <div className="w-1/2 h-1 bg-zinc-800 rounded" />
          <div className="w-full h-3 border-b border-l border-zinc-300 relative flex items-end">
            <div className="w-full h-2 border-t-2 border-emerald-500 rounded-xs" />
          </div>
        </div>,
        // Tile 3: Dark Command Center
        <div key="3" className="w-full h-full bg-zinc-950 p-1 grid grid-cols-2 gap-0.5 rounded">
          <div className="bg-zinc-900 rounded p-0.5 border border-zinc-800" />
          <div className="bg-zinc-900 rounded p-0.5 border border-zinc-800" />
          <div className="bg-zinc-900 rounded p-0.5 border border-zinc-800 col-span-2" />
        </div>,
        // Tile 4: Neon Chart
        <div key="4" className="w-full h-full bg-slate-900 p-1 flex flex-col justify-end gap-1 rounded">
          <div className="w-full h-3 bg-cyan-500/20 border-t border-cyan-400 rounded-xs" />
        </div>
      ]
    },
    {
      id: 'components',
      name: 'Components',
      count: 35,
      previews: [
        // Tile 1: Dark Cards & Avatars
        <div key="1" className="w-full h-full bg-zinc-900 p-1 flex items-center justify-around rounded">
          <div className="w-2 h-2 rounded-full bg-pink-500" />
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>,
        // Tile 2: Search & Filter
        <div key="2" className="w-full h-full bg-zinc-950 p-1 flex flex-col justify-center gap-1 rounded">
          <div className="w-full h-2 bg-zinc-800 rounded border border-zinc-700" />
          <div className="flex gap-0.5"><div className="w-1/3 h-1.5 bg-zinc-800 rounded" /><div className="w-1/3 h-1.5 bg-zinc-800 rounded" /></div>
        </div>,
        // Tile 3: Ambient Glow Card
        <div key="3" className="w-full h-full bg-gradient-to-r from-amber-200 via-rose-200 to-indigo-200 p-1 rounded flex items-center justify-center">
          <div className="w-3/4 h-3/4 bg-white/80 backdrop-blur-xs rounded" />
        </div>,
        // Tile 4: Tab list
        <div key="4" className="w-full h-full bg-black p-1 flex flex-col justify-center gap-1 rounded">
          <div className="flex gap-1"><div className="w-1/2 h-1.5 bg-zinc-700 rounded" /><div className="w-1/2 h-1.5 bg-zinc-900 rounded" /></div>
          <div className="w-full h-2 bg-zinc-900 rounded" />
        </div>
      ]
    },
    {
      id: 'login_signup',
      name: 'Login & Sign Up',
      count: 12,
      previews: [
        // Tile 1: Clean Minimalist Sign-in
        <div key="1" className="w-full h-full bg-white p-1.5 flex flex-col items-center justify-center gap-1 rounded border border-zinc-200">
          <div className="w-3 h-3 bg-zinc-900 rounded-full" />
          <div className="w-3/4 h-1.5 bg-zinc-100 rounded" />
          <div className="w-3/4 h-1.5 bg-zinc-900 rounded" />
        </div>,
        // Tile 2: Google Sign-in modal
        <div key="2" className="w-full h-full bg-zinc-50 p-1 flex flex-col items-center justify-center gap-1 rounded border border-zinc-200">
          <div className="text-[5px] font-bold text-zinc-700">Login with Google</div>
          <div className="w-full h-2 bg-emerald-500 rounded text-[5px] text-white flex items-center justify-center font-bold">Continue</div>
        </div>,
        // Tile 3: Dark Login card
        <div key="3" className="w-full h-full bg-zinc-900 p-1.5 flex flex-col justify-center gap-1 rounded">
          <div className="w-full h-1.5 bg-zinc-800 rounded border border-zinc-700" />
          <div className="w-full h-1.5 bg-zinc-800 rounded border border-zinc-700" />
          <div className="w-full h-2 bg-white rounded text-[5px] text-black font-bold flex items-center justify-center">Log In</div>
        </div>,
        // Tile 4: Vibrant Gradient Form
        <div key="4" className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-700 p-1 flex items-center justify-center rounded">
          <div className="w-3/4 h-3/4 bg-zinc-900/90 rounded p-1 flex flex-col justify-around">
            <div className="w-full h-1 bg-zinc-700 rounded" />
            <div className="w-full h-1.5 bg-emerald-400 rounded" />
          </div>
        </div>
      ]
    },
    {
      id: 'blogs_content',
      name: 'Blogs & Content',
      count: 9,
      previews: [
        // Tile 1: Editorial Reader
        <div key="1" className="w-full h-full bg-stone-50 p-1.5 flex flex-col justify-around rounded border border-stone-200">
          <div className="w-full h-1.5 bg-stone-900 rounded" />
          <div className="w-2/3 h-1 bg-stone-400 rounded" />
          <div className="w-full h-2 bg-stone-200 rounded" />
        </div>,
        // Tile 2: Newsletter Banner
        <div key="2" className="w-full h-full bg-indigo-950 p-1.5 flex flex-col justify-center items-center gap-1 rounded">
          <span className="text-[5px] text-indigo-200 font-bold">SUBSCRIBE</span>
          <div className="w-full h-2 bg-indigo-600 rounded" />
        </div>,
        // Tile 3: Grid blog cards
        <div key="3" className="w-full h-full bg-white p-1 grid grid-cols-2 gap-0.5 rounded border border-zinc-200">
          <div className="bg-zinc-100 rounded" />
          <div className="bg-zinc-100 rounded" />
        </div>,
        // Tile 4: Dark docs layout
        <div key="4" className="w-full h-full bg-zinc-900 p-1 flex gap-1 rounded">
          <div className="w-1/3 bg-zinc-800 h-full rounded-xs" />
          <div className="w-2/3 bg-zinc-950 h-full rounded-xs" />
        </div>
      ]
    }
  ];

  // Rich Featured Templates Data matching reference screenshot format
  const FEATURED_TEMPLATES = [
    {
      id: 'v0_img_gen',
      title: 'v0 Img Gen Playground',
      category: 'Apps & Games',
      author: 'AI Studio',
      avatarColor: 'bg-gradient-to-tr from-amber-500 to-orange-600',
      views: '6.4K',
      likes: '712',
      prompt: 'Build an Image Generation Playground with prompt field, aspect ratio selectors, image upload cards, and generation history list.',
      previewRender: (
        <div className="w-full h-full bg-[#0a0a0a] text-zinc-100 p-4 font-sans flex flex-col justify-between select-none">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">v0 Img Gen Playground</span>
              <span className="px-1.5 py-0.5 text-[9px] bg-zinc-800 text-zinc-400 rounded font-mono">Powered by Gemini</span>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-3 my-2 flex-1">
            <div className="col-span-8 bg-[#121212] border border-zinc-800/80 rounded-xl p-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded font-mono text-zinc-300">Prompt</span>
                  <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">GPT Image 2</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-400 font-mono">
                  A sleek dark mode UI playground for generative image models...
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="border border-dashed border-zinc-700 rounded-lg p-3 text-center bg-zinc-900/50">
                  <span className="text-[10px] text-zinc-400 block font-medium">Upload Image</span>
                  <span className="text-[8px] text-zinc-500 block">(or drag & drop)</span>
                </div>
                <div className="border border-dashed border-zinc-700 rounded-lg p-3 text-center bg-zinc-900/50">
                  <span className="text-[10px] text-zinc-400 block font-medium">Second Image</span>
                  <span className="text-[8px] text-zinc-500 block">(or drag & drop)</span>
                </div>
              </div>
            </div>
            <div className="col-span-4 bg-[#121212] border border-zinc-800/80 rounded-xl p-3 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-lg border border-zinc-800 bg-zinc-900 flex items-center justify-center mb-2 text-zinc-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-zinc-400">Ready to generate</span>
            </div>
          </div>
        </div>
      ),
      presetId: 'burn_rate'
    },
    {
      id: 'pointer_ai',
      title: 'Pointer AI landing page',
      category: 'Landing Pages',
      author: 'GigaDev',
      avatarColor: 'bg-gradient-to-tr from-stone-600 to-amber-700',
      views: '20.4K',
      likes: '1.9K',
      prompt: 'Design a modern dark landing page titled Pointer AI with high-contrast hero typography, CTA buttons, and interactive code editor preview.',
      previewRender: (
        <div className="w-full h-full bg-[#0d0f12] text-white p-5 font-sans flex flex-col justify-between relative overflow-hidden select-none">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 text-xs text-zinc-400">
            <div className="flex items-center gap-4">
              <span className="font-bold text-white tracking-tight">Pointer</span>
              <span className="hover:text-white transition-colors cursor-pointer text-[11px]">Features</span>
              <span className="hover:text-white transition-colors cursor-pointer text-[11px]">Pricing</span>
              <span className="hover:text-white transition-colors cursor-pointer text-[11px]">Testimonials</span>
            </div>
            <button className="bg-white text-black px-2.5 py-1 rounded-full text-[10px] font-bold">Try for Free</button>
          </div>
          {/* Hero Content */}
          <div className="my-auto text-center space-y-2 py-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white max-w-md mx-auto leading-tight">
              Unleash the Power of AI Agents
            </h2>
            <p className="text-[11px] text-zinc-400 max-w-sm mx-auto">
              Accelerate your development workflow with intelligent AI agents that write, review, and optimize your code.
            </p>
            <button className="bg-white hover:bg-zinc-200 text-black px-4 py-1.5 rounded-full text-xs font-bold shadow-md cursor-pointer mt-1">
              Signup for free
            </button>
          </div>
          {/* Code editor preview */}
          <div className="bg-[#161b22] border border-zinc-800 rounded-t-xl p-2 font-mono text-[9px] text-emerald-400">
            <span className="text-zinc-500">// main.ts</span> — {"export const agent = new AIAgent({ model: 'gemini-3.6-flash' });"}
          </div>
        </div>
      ),
      presetId: 'saas_mrr'
    },
    {
      id: 'unusual_hero',
      title: 'An unusual hero',
      category: 'Landing Pages',
      author: 'Midjourney',
      avatarColor: 'bg-black text-white border border-zinc-700',
      views: '3K',
      likes: '435',
      prompt: 'Create a dark luxury 3D fluid hero showcase banner with bold display text and ambient glassmorphic cards.',
      previewRender: (
        <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-950 to-blue-950 text-white p-5 font-sans flex flex-col justify-between relative overflow-hidden select-none">
          {/* 3D Wave Art Representation */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/30 via-sky-600/20 to-transparent pointer-events-none" />
          <div className="flex justify-between items-center z-10">
            <div className="w-6 h-6 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center font-black text-xs">W</div>
            <span className="text-[9px] bg-white/10 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded-full text-zinc-200 font-mono">Made with Midjourney</span>
          </div>
          <div className="z-10 space-y-1 my-auto max-w-xs">
            <h2 className="text-lg font-bold leading-tight text-white">
              Transform Your Vision Into Reality
            </h2>
            <p className="text-[10px] text-zinc-300 line-clamp-2">
              Use generative AI animations alongside Midjourney generated assets to inspire users.
            </p>
            <div className="pt-1">
              <span className="text-[9px] font-bold bg-white text-black px-2.5 py-1 rounded-md">BUILD WITH AI</span>
            </div>
          </div>
        </div>
      ),
      presetId: 'hiring_pipeline'
    },
    {
      id: 'startup_burn_rate_feat',
      title: 'Startup Burn Rate Command Center',
      category: 'Dashboards',
      author: 'CFO Analytics',
      avatarColor: 'bg-emerald-600',
      views: '14.8K',
      likes: '1.2K',
      prompt: 'Set up a dashboard to track my startup burn rate, monthly expenses, cash runway, and headcount costs.',
      previewRender: (
        <div className="w-full h-full bg-zinc-900 text-white p-4 font-sans flex flex-col justify-between select-none">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-bold text-xs text-white">Burn Rate & Cash Runway</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">14.2 Mos Runway</span>
          </div>
          <div className="grid grid-cols-3 gap-2 my-2">
            <div className="bg-zinc-800/80 p-2 rounded-lg border border-zinc-700/60">
              <span className="text-[9px] text-zinc-400 block">Bank Balance</span>
              <span className="text-sm font-extrabold text-white">$1,850,000</span>
            </div>
            <div className="bg-zinc-800/80 p-2 rounded-lg border border-zinc-700/60">
              <span className="text-[9px] text-zinc-400 block">Monthly Burn</span>
              <span className="text-sm font-extrabold text-rose-400">$130,000</span>
            </div>
            <div className="bg-zinc-800/80 p-2 rounded-lg border border-zinc-700/60">
              <span className="text-[9px] text-zinc-400 block">Gross Margin</span>
              <span className="text-sm font-extrabold text-emerald-400">78.4%</span>
            </div>
          </div>
          <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 flex items-center justify-between">
            <span className="text-[10px] text-zinc-400">Simulate Headcount Runway:</span>
            <span className="text-xs font-mono font-bold text-emerald-400">17.8 Months Projections</span>
          </div>
        </div>
      ),
      presetId: 'burn_rate'
    }
  ];

  // Search and Category filtering
  const filteredFeatured = FEATURED_TEMPLATES.filter((tpl) => {
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.prompt.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = activeCategory === 'All' || tpl.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Top Search & Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-600" />
            <span>App Starters & Design Systems</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Explore ready-to-use blueprints, categories, and interactive starters for your application.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 text-zinc-400 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates & categories..."
              className="w-full bg-white border border-zinc-200/90 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-300 transition-all shadow-2xs"
            />
          </div>

          <button
            onClick={onNewChat}
            className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all shadow-2xs cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Custom Prompt</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Categories Header + Horizontal Scroll Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-900 tracking-tight">Categories</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveCategory('All')}
              className={`text-xs font-semibold cursor-pointer transition-colors ${
                activeCategory === 'All' ? 'text-zinc-900 underline' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Browse All &rsaquo;
            </button>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollContainer(categoriesScrollRef, 'left')}
                className="w-7 h-7 rounded-full bg-white border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-zinc-600 transition-all cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollContainer(categoriesScrollRef, 'right')}
                className="w-7 h-7 rounded-full bg-white border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-zinc-600 transition-all cursor-pointer shadow-2xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Row */}
        <div
          ref={categoriesScrollRef}
          className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.name;

            return (
              <motion.div
                key={cat.id}
                whileHover={{ y: -2 }}
                onClick={() => setActiveCategory(isSelected ? 'All' : cat.name)}
                className={`w-52 shrink-0 bg-white border rounded-2xl p-3.5 shadow-2xs cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                    : 'border-zinc-200/90 hover:border-zinc-300'
                }`}
              >
                {/* 2x2 Grid Preview Frame */}
                <div className="grid grid-cols-2 gap-1.5 w-full h-28 bg-zinc-100/80 dark:bg-zinc-900/10 p-1.5 rounded-xl border border-zinc-200/60 mb-3 overflow-hidden">
                  {cat.previews.map((prev, idx) => (
                    <div key={idx} className="w-full h-full overflow-hidden rounded">
                      {prev}
                    </div>
                  ))}
                </div>

                {/* Category Label */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-zinc-900">{cat.name}</span>
                  <span className="text-[10px] text-zinc-400 font-mono">{cat.count}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Featured Templates Header + Cards Carousel */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">Featured Templates</h2>
            {activeCategory !== 'All' && (
              <p className="text-xs text-emerald-600 font-medium">Filtering by category: {activeCategory}</p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => scrollContainer(featuredScrollRef, 'left')}
              className="w-8 h-8 rounded-full bg-white border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-zinc-600 transition-all cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollContainer(featuredScrollRef, 'right')}
              className="w-8 h-8 rounded-full bg-white border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-zinc-600 transition-all cursor-pointer shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Templates Row / Grid */}
        <div
          ref={featuredScrollRef}
          className="flex items-stretch gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredFeatured.map((tpl) => {
            const presetObj = PRESET_TEMPLATES.find((p) => p.id === tpl.presetId) || PRESET_TEMPLATES[0];

            return (
              <motion.div
                key={tpl.id}
                whileHover={{ y: -3 }}
                onClick={() => {
                  const customTemplate: PresetTemplate = {
                    id: tpl.id,
                    title: tpl.title,
                    description: tpl.prompt,
                    category: tpl.category,
                    icon: presetObj.icon || 'Sparkles',
                    prompt: tpl.prompt,
                    schema: presetObj.schema
                  };
                  onSelectPreset(customTemplate);
                }}
                className="w-[360px] shrink-0 bg-white border border-zinc-200/90 hover:border-zinc-400 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                {/* Widescreen Preview Display */}
                <div className="w-full h-48 bg-zinc-950 relative overflow-hidden border-b border-zinc-200/80">
                  {tpl.previewRender}

                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 backdrop-blur-[2px]">
                    <span className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs flex items-center gap-2 shadow-lg">
                      <span>Use Template</span>
                      <ArrowRight className="w-3.5 h-3.5 text-black" />
                    </span>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="p-4 flex items-center justify-between gap-3 bg-white">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full ${tpl.avatarColor} flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-2xs`}
                    >
                      {tpl.author[0]}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-xs text-zinc-900 group-hover:text-emerald-600 transition-colors truncate">
                        {tpl.title}
                      </h3>
                      <span className="text-[10px] text-zinc-400 block truncate">{tpl.category}</span>
                    </div>
                  </div>

                  {/* Stats (Views & Hearts) */}
                  <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-mono shrink-0">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-zinc-400" />
                      {tpl.views}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-400" />
                      {tpl.likes}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
