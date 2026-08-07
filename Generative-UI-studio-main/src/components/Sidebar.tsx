import React from 'react';
import {
  ChevronDown,
  Plus,
  Home,
  FolderKanban,
  MessageSquare,
  Palette,
  LayoutTemplate,
  Sparkles,
  Figma,
  User,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { PresetTemplate, DynamicUISchema } from '../types';
import { PRESET_TEMPLATES } from '../data/presets';

interface SidebarProps {
  activeDraftId: string;
  onSelectDraft: (preset: PresetTemplate) => void;
  onNewChat: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  userEmail?: string;
  projects?: DynamicUISchema[];
  onSelectProject?: (project: DynamicUISchema) => void;
  currentProjectId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeDraftId,
  onSelectDraft,
  onNewChat,
  activeNav,
  setActiveNav,
  collapsed,
  setCollapsed,
  userEmail = 'chmounikaxyz-4795',
  projects = [],
  onSelectProject,
  currentProjectId
}) => {
  if (collapsed) {
    return (
      <div className="w-14 bg-[#f9f9fb] border-r border-zinc-200/80 flex flex-col items-center py-3 justify-between shrink-0 h-screen sticky top-0">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setCollapsed(false)}
            className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 rounded-lg transition-colors"
            title="Expand Sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNewChat}
            className="p-2 text-zinc-800 hover:bg-zinc-200/80 rounded-lg bg-zinc-200/50"
            title="New Chat"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
          {userEmail.charAt(0).toUpperCase()}
        </div>
      </div>
    );
  }

  return (
    <aside className="w-64 bg-[#f9f9fb] border-r border-zinc-200/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 text-zinc-800 text-xs select-none">
      <div className="flex flex-col overflow-y-auto flex-1">
        {/* Workspace Selector Bar */}
        <div className="p-3 flex items-center justify-between border-b border-zinc-200/60">
          <div className="flex items-center gap-2 cursor-pointer hover:bg-zinc-200/60 p-1.5 rounded-lg transition-colors flex-1 min-w-0">
            <div className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-zinc-900 whitespace-nowrap text-sm">Generative UI Studio</span>
            <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0 ml-auto" />
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 text-zinc-500 hover:text-zinc-800 rounded-md hover:bg-zinc-200/60 cursor-pointer"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-3 pb-1">
          <button
            onClick={onNewChat}
            className="w-full bg-white hover:bg-zinc-100/80 border border-zinc-200 text-zinc-900 font-semibold py-2 px-3.5 rounded-xl shadow-2xs flex items-center justify-between transition-all text-sm cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>New Chat</span>
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="px-2 space-y-1 my-1">
          <button
            onClick={() => setActiveNav('home')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeNav === 'home'
                ? 'bg-zinc-200/90 text-zinc-900 font-semibold shadow-2xs'
                : 'text-zinc-700 hover:bg-zinc-200/50 hover:text-zinc-900'
            }`}
          >
            <Home className="w-4.5 h-4.5 text-zinc-800" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveNav('projects')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeNav === 'projects'
                ? 'bg-zinc-200/90 text-zinc-900 font-semibold shadow-2xs'
                : 'text-zinc-700 hover:bg-zinc-200/50 hover:text-zinc-900'
            }`}
          >
            <FolderKanban className="w-4.5 h-4.5 text-zinc-600" />
            <span>Projects</span>
          </button>

          <button
            onClick={() => setActiveNav('chats')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeNav === 'chats'
                ? 'bg-zinc-200/90 text-zinc-900 font-semibold shadow-2xs'
                : 'text-zinc-700 hover:bg-zinc-200/50 hover:text-zinc-900'
            }`}
          >
            <MessageSquare className="w-4.5 h-4.5 text-zinc-600" />
            <span>Chats</span>
          </button>

          <button
            onClick={() => setActiveNav('design_systems')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeNav === 'design_systems'
                ? 'bg-zinc-200/90 text-zinc-900 font-semibold shadow-2xs'
                : 'text-zinc-700 hover:bg-zinc-200/50 hover:text-zinc-900'
            }`}
          >
            <Palette className="w-4.5 h-4.5 text-zinc-600" />
            <span>Design Systems</span>
          </button>

          <button
            onClick={() => setActiveNav('templates')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeNav === 'templates'
                ? 'bg-zinc-200/90 text-zinc-900 font-semibold shadow-2xs'
                : 'text-zinc-700 hover:bg-zinc-200/50 hover:text-zinc-900'
            }`}
          >
            <LayoutTemplate className="w-4.5 h-4.5 text-zinc-600" />
            <span>Templates</span>
          </button>
        </nav>

        {/* Recent Chats Section */}
        {projects && projects.length > 0 && (
          <div className="px-3 pt-3 pb-1 border-t border-zinc-200/40">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5 px-1">
              Recent Chats
            </span>
            <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
              {projects.map((project) => {
                const isActive = currentProjectId === project.id;
                return (
                  <button
                    key={project.id}
                    onClick={() => onSelectProject?.(project)}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded-lg text-left transition-all text-xs cursor-pointer truncate ${
                      isActive
                        ? 'bg-zinc-200 text-zinc-900 font-bold shadow-3xs'
                        : 'text-zinc-650 hover:bg-zinc-200/40 hover:text-zinc-900'
                    }`}
                    title={project.title}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{project.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Drafts Section */}
        <div className="px-3 pt-3 pb-2 border-t border-zinc-200/40">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1.5 px-1">
            Drafts
          </span>
          <div className="space-y-1">
            {PRESET_TEMPLATES.map((preset) => {
              const isActive = activeDraftId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectDraft(preset)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors text-sm cursor-pointer ${
                    isActive
                      ? 'bg-zinc-200/90 text-zinc-900 font-semibold'
                      : 'text-zinc-700 hover:bg-zinc-200/50 hover:text-zinc-900'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-emerald-500' : 'border border-zinc-400'}`} />
                  <span className="truncate">{preset.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Account Profile Footer */}
      <div className="p-3 border-t border-zinc-200/60 shrink-0">
        <div className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-zinc-200/60 transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-700 flex items-center justify-center font-bold text-xs shrink-0">
            {userEmail.charAt(0).toLowerCase()}
          </div>
          <span className="font-semibold text-zinc-900 text-sm truncate">{userEmail}</span>
        </div>
      </div>
    </aside>
  );
};
