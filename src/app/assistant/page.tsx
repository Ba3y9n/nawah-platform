"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { 
  Bot, Send, User, RefreshCw, 
  Database, Activity, LineChart, BookOpen, FlaskConical, Leaf,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

// 6-Node Circular Flow (Data -> Knowledge -> Application)
const SCIENTIFIC_FLOW = [
  {
    id: 'batches',
    label: 'الدفعات',
    icon: Database,
    desc: 'تسجيل وإدارة دفعات نوى التمر وتوثيق مصدرها.',
    prompt: 'كيف أسجل دفعة نوى جديدة في المنصة وأوثق مصدرها؟'
  },
  {
    id: 'data',
    label: 'البيانات',
    icon: Activity,
    desc: 'جمع ومعالجة بيانات الخصائص الفيزيائية والكيميائية.',
    prompt: 'ما هي البيانات والخصائص التي يتم جمعها لكل دفعة من نوى التمر؟'
  },
  {
    id: 'analyze',
    label: 'التحليل',
    icon: LineChart,
    desc: 'تحليل المؤشرات الحيوية والمطابقة مع معايير الجودة.',
    prompt: 'كيف يتم تحليل الخصائص الحيوية لنوى التمر وما هي المؤشرات الأساسية؟'
  },
  {
    id: 'evidence',
    label: 'الأدلة',
    icon: BookOpen,
    desc: 'استكشف الأدلة والدراسات العلمية المرتبطة باستخدام نوى التمر.',
    prompt: 'ابحث في الأدلة والدراسات العلمية الموثقة حول نوى التمر.'
  },
  {
    id: 'application',
    label: 'الاستخدامات',
    icon: FlaskConical,
    desc: 'مسارات الاستفادة الصناعية (استخلاص الزيوت، الفحم النشط، البدائل).',
    prompt: 'ما هي مسارات الاستفادة الصناعية المتاحة لزيت وفحم نوى التمر؟'
  },
  {
    id: 'impact',
    label: 'الأثر',
    icon: Leaf,
    desc: 'تقييم الأثر البيئي والاقتصادي وحساب تقليل الانبعاثات.',
    prompt: 'كيف نقيم الأثر البيئي ونحسب تقليل الانبعاثات عند إعادة تدوير النوى؟'
  }
];

// Quick Action mappings that control the ring
const QUICK_ACTIONS = [
  { label: 'تسجيل الدفعات', targetId: 'batches' },
  { label: 'الاستفادة الصناعية', targetId: 'application' },
  { label: 'زيت النوى', targetId: 'application', customPrompt: 'كيف يتم استخلاص زيت نوى التمر وما هي تطبيقاته؟' },
  { label: 'الأثر البيئي', targetId: 'impact' }
];

function renderFormattedText(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    let trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={`br-${lineIdx}`} className="h-2" />);
      return;
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h4 key={lineIdx} className="font-bold text-sm mt-4 mb-2 text-slate-800 border-b border-stone-100 pb-1 inline-block">
          {trimmed.replace(/^###\s+/, "")}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h3 key={lineIdx} className="font-bold text-base mt-5 mb-3 text-emerald-900 border-b border-emerald-100 pb-1.5">
          {trimmed.replace(/^##\s+/, "")}
        </h3>
      );
      return;
    }

    const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ");
    if (isBullet) {
      trimmed = trimmed.replace(/^[\*\-•]\s+/, "");
      
      const parts = trimmed.split(/(\*\*.*?\*\*)/g);
      const content = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-bold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      // Scientific / Data card styling for "Key: Value" lines
      if (trimmed.includes(":") && !trimmed.includes("http")) {
        const [key, ...valueParts] = trimmed.split(":");
        const val = valueParts.join(":");
        elements.push(
          <div key={lineIdx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 my-2 p-3 bg-stone-50 rounded-xl border border-stone-200/60 shadow-sm">
            <span className="font-bold text-emerald-800 text-sm">{key.replace(/\*\*/g, '')}:</span>
            <span className="text-slate-700 text-sm">{val.replace(/\*\*/g, '')}</span>
          </div>
        );
      } else {
        elements.push(
          <div key={lineIdx} className="flex items-start gap-2.5 my-1.5 pr-1">
            <span className="w-1.5 h-1.5 rounded-sm bg-emerald-500/50 mt-2 shrink-0"></span>
            <span className="flex-1 text-slate-700 leading-relaxed text-sm">{content}</span>
          </div>
        );
      }
      return;
    }

    // Normal paragraph
    const parts = trimmed.split(/(\*\*.*?\*\*)/g);
    const content = parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={pIdx} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    elements.push(
      <p key={lineIdx} className="my-1.5 text-slate-700 leading-relaxed text-sm">
        {content}
      </p>
    );
  });

  return elements;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [activeNodeId, setActiveNodeId] = useState<string>(SCIENTIFIC_FLOW[0].id);
  const prefersReducedMotion = useReducedMotion();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeNode = SCIENTIFIC_FLOW.find(t => t.id === activeNodeId) || SCIENTIFIC_FLOW[0];
  const isChatEmpty = messages.length === 0;

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || loading) return;

    setInput("");
    setErrorMsg("");

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const historyPayload = updatedMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          history: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error('فشل الاتصال بخدمة المساعد');
      }

      const data = await res.json();
      const replyText = data.reply || 'تم استلام استفسارك وتأكيده مع قاعدة بيانات نواة.';

      const assistantReply: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantReply]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("تعذر الاتصال بخوادم الذكاء الاصطناعي حالياً، يرجى إعادة المحاولة.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setActiveNodeId(SCIENTIFIC_FLOW[0].id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick action click handler
  const handleActionClick = (action: typeof QUICK_ACTIONS[0]) => {
    setActiveNodeId(action.targetId);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-white font-sans text-slate-800" dir="rtl">
      
      {/* HEADER: Premium, Minimalist, Scientific */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-stone-100 shrink-0 bg-white z-30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-emerald-700 border border-stone-200">
            <Bot size={20} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              مساعد نواة AI Assistant
            </h1>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5 hidden sm:block">
              مساعد ذكي لفهم بيانات نوى التمر واستكشاف مسارات الاستفادة منها.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-50 border border-stone-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-bold text-slate-600">المساعد متصل</span>
          </div>
          {!isChatEmpty && (
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>محادثة جديدة</span>
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scroll-smooth w-full relative bg-white"
      >
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 pt-6 pb-32 min-h-full flex flex-col relative z-10">
          
          {isChatEmpty ? (
            /* HERO & KNOWLEDGE ORBIT STATE */
            <div className="flex flex-col items-center w-full mt-2 sm:mt-6">
              
              {/* Quick Actions at the top (User requested them to control the flow) */}
              <div className="w-full flex flex-wrap justify-center gap-2 mb-8">
                {QUICK_ACTIONS.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleActionClick(action)}
                    className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors border ${
                      activeNodeId === action.targetId 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : 'bg-white text-slate-600 border-stone-200 hover:bg-stone-50 hover:text-slate-900'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
              
              {/* THE CIRCULAR FLOW (MAIN VISUAL ELEMENT) */}
              <div className="relative w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] flex items-center justify-center mx-auto mb-8">
                
                {/* SVG Track with Thin Arrows */}
                <div className="absolute inset-8 sm:inset-12 pointer-events-none">
                  <svg width="100%" height="100%" viewBox="-100 -100 200 200" overflow="visible">
                    <circle cx="0" cy="0" r="100" fill="none" stroke="#e7e5e4" strokeWidth="1.2" strokeDasharray="4 2" />
                    
                    {/* Arrows between nodes (at 60-degree increments starting from -60) */}
                    {[-60, 0, 60, 120, 180, 240].map((angle, i) => {
                      const rad = (angle * Math.PI) / 180;
                      const x = 100 * Math.cos(rad);
                      const y = 100 * Math.sin(rad);
                      return (
                        <g key={i} transform={`translate(${x}, ${y}) rotate(${angle + 90})`} opacity="0.6">
                          <path d="M-4,4 L0,0 L4,4" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                      );
                    })}
                  </svg>
                </div>
                
                {/* Slow interactive orbiting particle (Subtle Micro-interaction) */}
                {!prefersReducedMotion && (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-8 sm:inset-12 pointer-events-none"
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  </motion.div>
                )}

                {/* Central Hub: "مساعد نواة" */}
                <div className="relative z-10 flex flex-col items-center justify-center bg-white rounded-full w-32 h-32 sm:w-44 sm:h-44 border border-stone-200 shadow-sm p-4 text-center">
                  <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-700 mb-2" strokeWidth={1.2} />
                  <span className="text-sm sm:text-base font-black text-slate-900 mb-1">مساعد نواة</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium leading-relaxed max-w-[120px]">
                    مساعد ذكي لفهم واستثمار نوى التمر
                  </span>
                </div>

                {/* The 6 Nodes on the track */}
                <div className="absolute inset-8 sm:inset-12 pointer-events-none">
                  {SCIENTIFIC_FLOW.map((node, index) => {
                    const angle = (index * 60) - 90; // 6 nodes = 360/6 = 60 degrees apart
                    const isActive = activeNodeId === node.id;
                    
                    return (
                      <div 
                        key={node.id}
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        style={{ transform: `rotate(${angle}deg)` }}
                      >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                          
                          <button 
                            onClick={() => setActiveNodeId(node.id)}
                            className="group relative flex flex-col items-center justify-center focus:outline-none"
                            style={{ transform: `rotate(${-angle}deg)` }}
                            aria-label={node.label}
                          >
                            {/* Node Icon */}
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isActive 
                                ? 'bg-emerald-50 border-2 border-emerald-400 text-emerald-700 shadow-md scale-110' 
                                : 'bg-white border border-stone-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600 shadow-sm hover:scale-105'
                            }`}>
                              <node.icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                            </div>
                            
                            {/* Node Label */}
                            <div className={`absolute whitespace-nowrap transition-all duration-300 ${
                              isActive ? 'opacity-100' : 'opacity-80 sm:opacity-0 sm:group-hover:opacity-100'
                            } ${
                              angle > -45 && angle < 45 ? 'right-full mr-3 top-1/2 -translate-y-1/2' : // Right
                              angle >= 45 && angle <= 135 ? 'top-full mt-2 left-1/2 -translate-x-1/2' : // Bottom
                              angle > 135 || angle < -135 ? 'left-full ml-3 top-1/2 -translate-y-1/2' : // Left
                              'bottom-full mb-2 left-1/2 -translate-x-1/2' // Top
                            }`}>
                              <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md transition-colors ${
                                isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-stone-200 shadow-sm'
                              }`}>
                                {node.label}
                              </span>
                            </div>
                          </button>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Context Panel */}
              <div className="w-full max-w-xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeNodeId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center text-center p-6 bg-stone-50 border border-stone-200 rounded-2xl shadow-sm"
                  >
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{activeNode.label}</h3>
                    <p className="text-sm text-slate-600 font-medium mb-6">{activeNode.desc}</p>
                    <button 
                      onClick={() => {
                        const action = QUICK_ACTIONS.find(a => a.targetId === activeNode.id);
                        handleSend(action?.customPrompt || activeNode.prompt);
                      }}
                      className="flex items-center gap-2 text-sm font-bold text-emerald-700 bg-white hover:bg-emerald-50 border border-emerald-200 px-6 py-2.5 rounded-lg transition-colors shadow-sm"
                    >
                      <span>اسأل مساعد نواة</span>
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          ) : (
            /* ACTIVE CHAT LIST */
            <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto pt-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-4 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                    m.sender === 'user' 
                      ? 'bg-stone-100 border-stone-200 text-slate-600' 
                      : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                  }`}>
                    {m.sender === 'user' ? <User className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} /> : <Bot className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />}
                  </div>

                  <div className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[80%]`}>
                    <div className={`px-4 sm:px-6 py-3 sm:py-4 text-sm leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-white border border-stone-200 text-slate-800 rounded-2xl shadow-sm'
                        : 'bg-transparent text-slate-800'
                    }`}>
                      <div className="w-full break-words">
                        {renderFormattedText(m.text)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-4">
                    <span className="flex gap-1.5">
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                    </span>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-xs mx-12">
                  <span className="font-medium">{errorMsg}</span>
                  <button
                    onClick={() => {
                      const lastUser = [...messages].reverse().find(m => m.sender === 'user');
                      if (lastUser) handleSend(lastUser.text);
                    }}
                    className="text-red-700 font-bold px-2 py-1 rounded hover:bg-red-100 transition-colors"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* MESSAGE INPUT COMPOSER */}
      <footer className="w-full bg-white border-t border-stone-100 shrink-0 z-20">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-4">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="flex items-end gap-3 bg-stone-50 border border-stone-200 focus-within:bg-white focus-within:border-emerald-500 focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] rounded-xl p-2 transition-all"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="اكتب سؤالك عن نوى التمر..."
              className="flex-1 bg-transparent border-none outline-none text-slate-900 px-3 py-2.5 text-sm resize-none max-h-32 min-h-[44px] placeholder:text-slate-400 disabled:opacity-50"
              rows={1}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-slate-900 hover:bg-emerald-700 disabled:bg-stone-200 disabled:text-stone-400 text-white w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors focus:outline-none"
            >
              <Send className="w-4 h-4 rtl:-translate-x-0.5" strokeWidth={2} />
            </button>
          </form>
          <div className="flex justify-center mt-3">
            <p className="text-[10px] text-slate-400 font-medium">
              يستخدم مساعد نواة تقنيات الذكاء الاصطناعي وقد يحتاج للتحقق من بعض المعلومات الدقيقة.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
