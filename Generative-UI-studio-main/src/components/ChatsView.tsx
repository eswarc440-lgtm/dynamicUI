import React, { useState, useEffect, useRef } from 'react';
import { DynamicUISchema, ChatMessage } from '../types';
import {
  MessageSquare,
  Sparkles,
  ArrowUp,
  Clock,
  Trash2,
  Copy,
  Check,
  Bot,
  User,
  Plus,
  Loader2,
  ArrowLeft,
  X,
  FileText,
  Film,
  Paperclip,
  Image as ImageIcon,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AttachedFile {
  id: string;
  name: string;
  size: string;
  category: 'image' | 'doc' | 'media';
  previewUrl?: string;
}

interface ChatsViewProps {
  projects: DynamicUISchema[];
  currentSchema?: DynamicUISchema | null;
  onSelectProject: (schema: DynamicUISchema) => void;
  onDeleteProject?: (id: string) => void;
  onNewChat: () => void;
  onGenerate: (prompt: string, isRefine?: boolean) => void;
  isLoading: boolean;
  onBackToList?: () => void;
  selectedModel?: string;
  setSelectedModel?: (model: string) => void;
}

export const ChatsView: React.FC<ChatsViewProps> = ({
  projects,
  currentSchema,
  onSelectProject,
  onDeleteProject,
  onNewChat,
  onGenerate,
  isLoading,
  onBackToList,
  selectedModel = 'Gemini 2.5 Flash',
  setSelectedModel
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inputPrompt, setInputPrompt] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Hidden File Inputs Refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Attached files state
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

  // Menu toggles
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  const [localModel, setLocalModel] = useState('Gemini 2.5 Flash');
  const activeModel = selectedModel || localModel;
  const activeSetModel = setSelectedModel || setLocalModel;

  const activeSchema = currentSchema || projects[0];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSchema?.messages, isLoading]);

  const handleCopyPrompt = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>, category: 'image' | 'doc') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: File[] = Array.from(files);
    const newFiles: AttachedFile[] = fileList.map((file: File) => {
      let previewUrl: string | undefined = undefined;
      if (file.type.startsWith('image/')) {
        previewUrl = URL.createObjectURL(file);
      }
      return {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: formatFileSize(file.size),
        category,
        previewUrl
      };
    });

    setAttachedFiles((prev) => [...prev, ...newFiles]);
    setIsPlusMenuOpen(false);
    e.target.value = '';
  };

  const removeAttachedFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }

    if (files.length > 0) {
      e.preventDefault();
      const newFiles: AttachedFile[] = files.map((file: File) => {
        const previewUrl = URL.createObjectURL(file);
        return {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name || `pasted-image-${Date.now().toString().slice(-4)}.png`,
          size: formatFileSize(file.size),
          category: 'image',
          previewUrl
        };
      });
      setAttachedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputPrompt.trim() && attachedFiles.length === 0) || isLoading) return;

    let finalPrompt = inputPrompt.trim();
    if (attachedFiles.length > 0) {
      const fileNames = attachedFiles.map((f) => f.name).join(', ');
      finalPrompt = finalPrompt
        ? `${finalPrompt} (Attached files: ${fileNames})`
        : `Attached files: ${fileNames}`;
    }

    setInputPrompt('');
    setAttachedFiles([]);
    setIsPlusMenuOpen(false);
    setIsModelMenuOpen(false);
    onGenerate(finalPrompt, true);
  };

  const AVAILABLE_MODELS = [
    { name: 'Gemini 2.5 Flash', desc: 'Fastest & most versatile for real-time UI generation' },
    { name: 'Gemini 2.5 Pro', desc: 'Deep reasoning for complex multi-screen systems' },
    { name: 'Gemini 3.5 Flash', desc: 'High capability model for general tasks' },
    { name: 'Gemini 3.0 Ultra', desc: 'Max intelligence for advanced UI planning' }
  ];

  // Build display messages list
  const displayMessages: ChatMessage[] = activeSchema?.messages && activeSchema.messages.length > 0
    ? activeSchema.messages
    : activeSchema ? [
        {
          id: `init_user_${activeSchema.id}`,
          role: 'user',
          content: activeSchema.generatedPrompt || activeSchema.description,
          timestamp: 'Just now'
        },
        {
          id: `init_assistant_${activeSchema.id}`,
          role: 'assistant',
          content: activeSchema.description,
          timestamp: 'Just now',
          sectionsUpdated: activeSchema.layout?.length || 2
        }
      ]
    : [];

  return (
    <div className="w-80 lg:w-90 border-r border-zinc-200/90 bg-white flex flex-col h-full shrink-0 overflow-hidden shadow-2xs select-none">
      {/* Left Chat Header */}
      <div className="p-3 border-b border-zinc-200/80 flex items-center justify-between gap-2 shrink-0 bg-white">
        <div className="flex items-center gap-2 min-w-0">
          {onBackToList && (
            <button
              onClick={onBackToList}
              className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Back to Chats History"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200/60">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-xs text-zinc-900 leading-tight truncate">
              {activeSchema ? activeSchema.title : 'Chat Session'}
            </h2>
            <p className="text-[10px] text-zinc-400">Active Generative Studio Session</p>
          </div>
        </div>

        <button
          onClick={onNewChat}
          className="inline-flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-[11px] px-2 py-1.5 rounded-lg transition-all shadow-2xs cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>New</span>
        </button>
      </div>



      {/* Selected Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#fafafa]">
        {activeSchema ? (
          <div className="space-y-3">
            {/* Timestamp Badge */}
            <div className="text-center my-1">
              <span className="text-[9px] font-mono font-medium text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200/60 inline-flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-zinc-400" />
                <span>Session Active • {selectedModel}</span>
              </span>
            </div>

            {/* Render full message history thread */}
            {displayMessages.map((msg) => {
              if (msg.role === 'user') {
                return (
                  <div
                    key={msg.id}
                    className="flex items-start gap-2 bg-white border border-zinc-200/90 p-2.5 rounded-xl shadow-2xs"
                  >
                    <div className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                      <User className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 font-medium mb-1">
                        <span>User Request</span>
                        <button
                          onClick={(e) => handleCopyPrompt(e, msg.content, msg.id)}
                          className="p-0.5 text-zinc-400 hover:text-zinc-700 rounded transition-colors cursor-pointer"
                          title="Copy Prompt"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-800 leading-relaxed font-sans">
                        "{msg.content}"
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className="flex items-start gap-2 bg-emerald-50/60 border border-emerald-200/70 p-2.5 rounded-xl text-xs shadow-2xs"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                    <Bot className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[10px] text-emerald-800 font-bold mb-1">
                      <span>UI Studio Synthesizer</span>
                      {msg.sectionsUpdated && (
                        <span className="text-[9px] text-emerald-600 font-mono">
                          {msg.sectionsUpdated} Sections Updated
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-700 leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Live Typing / Synthesizing Indicator when isLoading */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 bg-emerald-50/90 border border-emerald-300 p-2.5 rounded-xl text-xs shadow-2xs"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Loader2 className="w-3 h-3 animate-spin" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-emerald-800 font-bold">
                    <span>UI Studio Synthesizing...</span>
                    <span className="text-[9px] text-emerald-600 font-mono animate-pulse">
                      {selectedModel} Active
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 italic">
                    Synthesizing components, metrics, and layout updates...
                  </p>
                </div>
              </motion.div>
            )}

            <div ref={chatBottomRef} />
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-400 text-xs">
            No active chat session. Start a new chat above.
          </div>
        )}
      </div>

      {/* Hidden File Inputs for Attachment */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={(e) => handleFileSelected(e, 'image')}
        accept="image/*"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={docInputRef}
        onChange={(e) => handleFileSelected(e, 'doc')}
        accept=".pdf,.doc,.docx,.csv,.json,.txt,.xls,.xlsx"
        multiple
        className="hidden"
      />

      {/* Bottom Refinement Prompt Form */}
      <div className="p-3 border-t border-zinc-200/80 bg-white shrink-0">
        <form onSubmit={handleRefineSubmit} className="space-y-2">
          {/* Attached Files Chips Bar */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-1.5 border-b border-zinc-100">
              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 text-zinc-800 text-[10px] px-2 py-0.5 rounded-lg group shadow-3xs"
                >
                  {file.previewUrl ? (
                    <img src={file.previewUrl} alt={file.name} className="w-4 h-4 rounded object-cover" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  )}
                  <span className="font-semibold truncate max-w-[120px] text-zinc-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachedFile(file.id)}
                    className="text-zinc-400 hover:text-rose-600 p-0.5 rounded transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            <textarea
              rows={2}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onPaste={handlePaste}
              placeholder="Ask UI Studio to refine or add features..."
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleRefineSubmit(e);
                }
              }}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-400 focus:bg-white rounded-xl p-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none resize-none transition-all"
            />
          </div>

          <div className="flex items-center justify-between pt-0.5 relative">
            {/* Left side attachment and model dropdown menu */}
            <div className="flex items-center gap-2">
              {/* File Attachment Icon button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlusMenuOpen(!isPlusMenuOpen);
                    setIsModelMenuOpen(false);
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isPlusMenuOpen
                      ? 'bg-zinc-200 text-zinc-900'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                  title="Attach Pictures or Files"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Plus popover menu */}
                {isPlusMenuOpen && (
                  <div className="absolute left-0 bottom-full mb-2 w-48 bg-white border border-zinc-200 shadow-xl rounded-xl p-1.5 z-50 text-xs space-y-0.5 animate-in fade-in zoom-in-95">
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-zinc-100 rounded-lg text-zinc-700 font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Upload Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => docInputRef.current?.click()}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-zinc-100 rounded-lg text-zinc-700 font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-sky-600" />
                      <span>Attach File</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Model Dropdown Trigger button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsModelMenuOpen(!isModelMenuOpen);
                    setIsPlusMenuOpen(false);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 font-bold text-[10px] transition-colors cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{activeModel}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {/* Model Popover Dropdown */}
                {isModelMenuOpen && (
                  <div className="absolute left-0 bottom-full mb-2 w-56 bg-white border border-zinc-200 shadow-xl rounded-xl p-1.5 z-50 text-[11px] space-y-1 animate-in fade-in zoom-in-95">
                    <div className="px-2 py-1 text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                      Select AI Model
                    </div>
                    {AVAILABLE_MODELS.map((m) => {
                      const isSelected = activeModel === m.name;
                      return (
                        <button
                          key={m.name}
                          type="button"
                          onClick={() => {
                            activeSetModel(m.name);
                            setIsModelMenuOpen(false);
                          }}
                          className={`w-full text-left p-1.5 rounded-lg transition-colors flex items-start gap-1.5 ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-950 border border-emerald-250 font-semibold'
                              : 'hover:bg-zinc-100 text-zinc-750'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between font-bold">
                              <span>{m.name}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                            </div>
                            <p className="text-[9px] text-zinc-400 font-normal leading-tight mt-0.5">
                              {m.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={(!inputPrompt.trim() && attachedFiles.length === 0) || isLoading}
              className="bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <>
                  <span>Send</span>
                  <ArrowUp className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
