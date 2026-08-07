import React, { useState, useRef, useEffect } from 'react';
import { PresetTemplate } from '../types';
import { PRESET_TEMPLATES } from '../data/presets';
import {
  ArrowUp,
  Sparkles,
  Loader2,
  Plus,
  Mic,
  MicOff,
  ChevronDown,
  Check,
  Image as ImageIcon,
  FileText,
  Film,
  Paperclip,
  X
} from 'lucide-react';

interface AttachedFile {
  id: string;
  name: string;
  size: string;
  category: 'image' | 'doc' | 'media';
  previewUrl?: string;
}

interface PromptBarProps {
  onGenerate: (prompt: string, isRefine?: boolean) => void;
  isLoading: boolean;
  currentPrompt?: string;
  hasActiveSchema?: boolean;
  isCompactMode?: boolean;
  selectedTemplate?: PresetTemplate | null;
  onClearTemplate?: () => void;
  onSelectTemplate?: (preset: PresetTemplate) => void;
  selectedModel?: string;
  setSelectedModel?: (model: string) => void;
}

export const PromptBar: React.FC<PromptBarProps> = ({
  onGenerate,
  isLoading,
  currentPrompt = '',
  hasActiveSchema = false,
  isCompactMode = false,
  selectedTemplate = null,
  onClearTemplate,
  onSelectTemplate,
  selectedModel,
  setSelectedModel
}) => {
  const [inputPrompt, setInputPrompt] = useState(currentPrompt);

  useEffect(() => {
    if (currentPrompt) {
      setInputPrompt(currentPrompt);
    }
  }, [currentPrompt]);

  const [localModel, setLocalModel] = useState('Gemini 2.5 Flash');
  const activeModel = selectedModel || localModel;
  const activeSetModel = setSelectedModel || setLocalModel;

  // Attached files state
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

  // Hidden File Inputs Refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  // Interactive Menus Toggle
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  // Voice dictation state
  const [isListening, setIsListening] = useState(false);
  const isListeningRef = useRef(false);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [voiceErrorMsg, setVoiceErrorMsg] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const RedWaveformBars = ({ volume }: { volume: number }) => {
    // 5 vertical red soundwave bars matching the exact visual reference uploaded
    const barFactors = [0.45, 0.8, 1.0, 0.75, 0.4];
    return (
      <div className="flex items-center justify-center gap-[2.5px] h-5 w-5">
        {barFactors.map((factor, i) => {
          const minH = 6;
          const maxH = 18;
          const volRatio = Math.max(0.2, volume / 100);
          const dynamicH = Math.min(maxH, Math.max(minH, Math.round(maxH * factor * (0.3 + volRatio * 0.7))));
          return (
            <div
              key={i}
              style={{ height: `${dynamicH}px` }}
              className="w-[3px] bg-[#ff001b] rounded-full transition-all duration-75 ease-out"
            />
          );
        })}
      </div>
    );
  };

  const stopVoiceListening = () => {
    isListeningRef.current = false;
    setIsListening(false);
    setMicVolume(0);

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // ignore
      }
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch (e) {
        // ignore
      }
      mediaStreamRef.current = null;
    }
    if (recognitionRef.current) {
      const rec = recognitionRef.current;
      recognitionRef.current = null;
      try {
        rec.abort();
      } catch (e) {
        // ignore
      }
      try {
        rec.stop();
      } catch (e) {
        // ignore
      }
    }
  };

  const setupAudioAnalyzer = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 32;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        if (!isListeningRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setMicVolume(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } catch (e) {
      console.warn('AudioContext volume analyzer failed', e);
    }
  };

  const toggleVoiceListening = async () => {
    if (isListening || isListeningRef.current) {
      stopVoiceListening();
      return;
    }

    setVoiceErrorMsg(null);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceErrorMsg('Speech recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.');
      return;
    }

    isListeningRef.current = true;
    setIsListening(true);

    // Attempt to get microphone stream for live visualizer
    let stream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!isListeningRef.current) {
          if (stream) {
            stream.getTracks().forEach((t) => t.stop());
          }
          return;
        }
        mediaStreamRef.current = stream;
        setupAudioAnalyzer(stream);
      } catch (err: any) {
        console.warn('Microphone stream error:', err);
      }
    }

    if (!isListeningRef.current) {
      stopVoiceListening();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      let initialPrompt = inputPrompt;

      recognition.onstart = () => {
        if (!isListeningRef.current) {
          try {
            recognition.abort();
          } catch (e) {}
          return;
        }
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        if (!isListeningRef.current) return;
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setInputPrompt(initialPrompt ? `${initialPrompt} ${transcript.trim()}` : transcript.trim());
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('SpeechRecognition error:', e?.error);
        if (e?.error === 'not-allowed' || e?.error === 'service-not-allowed') {
          setVoiceErrorMsg('Microphone access blocked. Please allow mic permissions in browser or open in a new tab.');
        } else if (e?.error === 'no-speech') {
          setVoiceErrorMsg('No speech detected. Please speak clearly into your microphone.');
        } else {
          setVoiceErrorMsg(`Speech recognition issue: ${e?.error || 'Unable to connect'}`);
        }
        stopVoiceListening();
      };

      recognition.onend = () => {
        if (isListeningRef.current) {
          stopVoiceListening();
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err: any) {
      console.warn('Failed to start SpeechRecognition:', err);
      setVoiceErrorMsg('Could not start speech recognition. Please check your microphone permissions.');
      stopVoiceListening();
    }
  };

  useEffect(() => {
    return () => {
      stopVoiceListening();
    };
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>, category: 'image' | 'doc' | 'media') => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputPrompt.trim() && attachedFiles.length === 0) || isLoading) return;

    let finalPrompt = inputPrompt.trim();
    if (attachedFiles.length > 0) {
      const fileNames = attachedFiles.map((f) => f.name).join(', ');
      finalPrompt = finalPrompt
        ? `${finalPrompt} (Attached files: ${fileNames})`
        : `Attached files: ${fileNames}`;
    }

    setIsPlusMenuOpen(false);
    setIsModelMenuOpen(false);
    setAttachedFiles([]);
    onGenerate(finalPrompt, isCompactMode || hasActiveSchema);
  };

  const handlePresetClick = (preset: PresetTemplate) => {
    if (onSelectTemplate) {
      onSelectTemplate(preset);
    } else {
      setInputPrompt(preset.prompt);
    }
  };

  const AVAILABLE_MODELS = [
    { name: 'Gemini 2.5 Flash', desc: 'Fastest & most versatile for real-time UI generation' },
    { name: 'Gemini 2.5 Pro', desc: 'Deep reasoning for complex multi-screen systems' },
    { name: 'Gemini 1.5 Flash', desc: 'Lightweight and highly responsive' }
  ];

  if (isCompactMode) {
    return (
      <div className="space-y-3">
        {/* Compact Refinement Bar */}
        <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-3 transition-all">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Ask UI Studio to refine this component or add features..."
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-400 focus:bg-white rounded-lg px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none transition-all"
                />
              </div>

              {/* Voice Speech Dictation Button */}
              {isListening ? (
                <button
                  type="button"
                  onClick={stopVoiceListening}
                  className="p-1.5 px-2 bg-zinc-200/70 hover:bg-zinc-200 border border-zinc-300/60 rounded-2xl shadow-2xs transition-all cursor-pointer flex items-center justify-center shrink-0"
                  title="Stop Voice Input"
                >
                  <RedWaveformBars volume={micVolume} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={toggleVoiceListening}
                  className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all cursor-pointer shrink-0"
                  title="Start Voice Input"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}

              <button
                type="submit"
                disabled={!inputPrompt.trim() || isLoading}
                className="bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-white p-2 rounded-lg text-xs font-semibold flex items-center justify-center shrink-0 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <ArrowUp className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Template Prompts along with Preview */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-3 shadow-2xs space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Or try a template prompt</span>
            </span>
            <span className="text-[10px] text-zinc-400">Click to switch preview</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {PRESET_TEMPLATES.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetClick(preset)}
                disabled={isLoading}
                className="bg-zinc-50/80 hover:bg-emerald-50/60 border border-zinc-200/80 hover:border-emerald-300 rounded-xl p-2.5 text-left transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div className="font-semibold text-xs text-zinc-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {preset.title}
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 line-clamp-1">
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-4 flex flex-col items-center justify-center space-y-6">
      {/* Title Header */}
      <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 tracking-tight text-center">
        What do you want to create?
      </h1>

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
      <input
        type="file"
        ref={mediaInputRef}
        onChange={(e) => handleFileSelected(e, 'media')}
        accept="video/*,audio/*"
        multiple
        className="hidden"
      />

      {/* Main Prompt Input Box */}
      <div className="w-full bg-white border border-zinc-200/90 shadow-sm hover:border-zinc-300 focus-within:border-zinc-400 focus-within:shadow-md rounded-2xl p-3 transition-all relative">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Selected Template Badge */}
          {selectedTemplate && (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200/90 rounded-xl px-3 py-2 text-xs text-emerald-900 shadow-2xs">
              <div className="flex items-center gap-2 font-medium min-w-0">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-700 font-bold">Template Selected:</span>
                <span className="font-semibold text-zinc-900 truncate">{selectedTemplate.title}</span>
              </div>
              {onClearTemplate && (
                <button
                  type="button"
                  onClick={onClearTemplate}
                  className="text-emerald-700 hover:text-rose-600 p-1 rounded-lg hover:bg-emerald-100/70 transition-colors cursor-pointer shrink-0"
                  title="Remove selected template"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Attached Files Chips Bar */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-1 border-b border-zinc-100">
              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs px-2.5 py-1 rounded-lg group shadow-2xs"
                >
                  {file.previewUrl ? (
                    <img src={file.previewUrl} alt={file.name} className="w-5 h-5 rounded object-cover" />
                  ) : file.category === 'doc' ? (
                    <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                  ) : file.category === 'media' ? (
                    <Film className="w-4 h-4 text-purple-600 shrink-0" />
                  ) : (
                    <Paperclip className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <span className="font-medium truncate max-w-[140px] text-zinc-800">{file.name}</span>
                  <span className="text-[10px] text-zinc-400 font-mono">{file.size}</span>
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

          <textarea
            rows={3}
            placeholder="Ask UI Studio to build dashboards, calculators, tracking tools..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onPaste={handlePaste}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className="w-full bg-transparent border-none text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none resize-none"
          />

          {/* Bottom Toolbar inside Prompt Box */}
          <div className="flex items-center justify-between border-t border-zinc-100 pt-2.5 text-xs">
            {/* Left Tools (+ Add Component and Model Selector) */}
            <div className="flex items-center gap-2 relative">
              {/* + Attachment / Component Inserter */}
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
                  title="Attach Media, Files or Add UI Components"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* Plus Popover Menu */}
                {isPlusMenuOpen && (
                  <div className="absolute left-0 bottom-full mb-2 w-64 bg-white border border-zinc-200 shadow-xl rounded-xl p-2 z-50 text-xs space-y-1.5 animate-in fade-in zoom-in-95">
                    {/* Media & Files Upload Options */}
                    <div className="space-y-0.5">
                      <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        Upload & Attach Media
                      </div>
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-zinc-100 rounded-lg text-zinc-800 font-medium flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-emerald-600" />
                          <span>Upload Image / Pictures</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-normal">PNG, JPG</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => docInputRef.current?.click()}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-zinc-100 rounded-lg text-zinc-800 font-medium flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-sky-600" />
                          <span>Attach Files & Documents</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-normal">PDF, CSV</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Model Dropdown Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsModelMenuOpen(!isModelMenuOpen);
                    setIsPlusMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{activeModel}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {/* Model Selector Popover */}
                {isModelMenuOpen && (
                  <div className="absolute left-0 bottom-full mb-2 w-64 bg-white border border-zinc-200 shadow-xl rounded-xl p-1.5 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95">
                    <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Select Gemini Model
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
                          className={`w-full text-left p-2 rounded-lg transition-colors flex items-start gap-2 ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 font-semibold'
                              : 'hover:bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>{m.name}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                            </div>
                            <p className="text-[10px] text-zinc-400 font-normal leading-tight mt-0.5">
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

            {/* Right Tools (Voice Mic and Submit) */}
            <div className="flex items-center gap-2 relative">
              {/* Voice Speech Dictation Button */}
              {isListening ? (
                <button
                  type="button"
                  onClick={stopVoiceListening}
                  className="p-1.5 px-2 bg-zinc-200/70 hover:bg-zinc-200 border border-zinc-300/60 rounded-2xl shadow-2xs transition-all cursor-pointer flex items-center justify-center shrink-0"
                  title="Stop Voice Dictation"
                >
                  <RedWaveformBars volume={micVolume} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={toggleVoiceListening}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all cursor-pointer shrink-0"
                  title="Start Voice Dictation"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={(!inputPrompt.trim() && !selectedTemplate && attachedFiles.length === 0) || isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Generate Application</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

