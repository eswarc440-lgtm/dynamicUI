import React, { useState } from 'react';
import { DynamicUISchema } from '../types';
import {
  MessageSquare,
  Search,
  Sparkles,
  Clock,
  Trash2,
  Copy,
  Check,
  Bot,
  User,
  ChevronRight,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';

interface ChatsHistoryViewProps {
  projects: DynamicUISchema[];
  currentSchemaId?: string;
  onSelectChat: (schema: DynamicUISchema) => void;
  onDeleteProject?: (id: string) => void;
  onNewChat: () => void;
}

export const ChatsHistoryView: React.FC<ChatsHistoryViewProps> = ({
  projects,
  currentSchemaId,
  onSelectChat,
  onDeleteProject,
  onNewChat
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredProjects = projects.filter(project => {
    const prompt = project.generatedPrompt || project.description || '';
    const title = project.title || '';
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCopyPrompt = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold mb-1">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Chat Sessions & Prompt History</span>
          </div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Previous UI Chats ({projects.length})
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Click on any previous chat session below to open the interactive UI preview alongside your chat.
          </p>
        </div>

        <button
          onClick={onNewChat}
          className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Start New Chat</span>
        </button>
      </div>

      {/* Chat History List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-12 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-zinc-300 mx-auto" />
            <h3 className="text-sm font-semibold text-zinc-700">No chat history found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Start a new prompt in the studio to generate interactive UIs and record conversation logs here.
            </p>
            <button
              onClick={onNewChat}
              className="mt-2 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create First UI Chat</span>
            </button>
          </div>
        ) : (
          filteredProjects.map((schema, index) => {
            const isSelected = schema.id === currentSchemaId;
            const promptText = schema.generatedPrompt || schema.description;

            return (
              <motion.div
                key={schema.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
                onClick={() => onSelectChat(schema)}
                className={`group bg-white border rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden ${
                  isSelected ? 'border-emerald-500 ring-1 ring-emerald-500/20 bg-emerald-50/10' : 'border-zinc-200/90 hover:border-zinc-300'
                }`}
              >
                {/* Header Tag Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors">
                      {schema.title}
                    </span>
                    {schema.category && (
                      <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 text-[10px] font-medium border border-zinc-200">
                        {schema.category}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      <span>Gemini 2.5 Flash</span>
                    </span>

                    {onDeleteProject && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(schema.id);
                        }}
                        className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Chat Message Bubble Log */}
                <div className="mt-3 space-y-2.5">
                  {/* User Prompt Message */}
                  <div className="flex items-start gap-2.5 bg-zinc-50 border border-zinc-200/70 p-3 rounded-xl text-xs text-zinc-700">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                      <User className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-zinc-900 text-[11px] mb-0.5">User Prompt:</div>
                      <p className="text-zinc-700 text-xs italic leading-relaxed line-clamp-2">
                        "{promptText}"
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleCopyPrompt(e, promptText, schema.id)}
                      className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 rounded transition-colors cursor-pointer shrink-0"
                      title="Copy prompt text"
                    >
                      {copiedId === schema.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* AI Response Output */}
                  <div className="flex items-start gap-2.5 bg-emerald-50/50 border border-emerald-200/60 p-3 rounded-xl text-xs text-zinc-800">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                      <Bot className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-emerald-950 text-[11px] mb-0.5 flex items-center justify-between">
                        <span>UI Studio Synthesizer</span>
                        <span className="text-[10px] text-emerald-700 font-normal">Synthesized {schema.layout.length} Layout Sections</span>
                      </div>
                      <p className="text-zinc-600 text-xs line-clamp-1">
                        {schema.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-3 pt-2.5 flex items-center justify-between text-xs text-emerald-700 font-semibold group-hover:underline">
                  <span>Open Chat & Preview Workspace</span>
                  <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
