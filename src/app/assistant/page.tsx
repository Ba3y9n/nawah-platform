"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { 
  Bot, Send, User, RefreshCw, 
  Database, LineChart, FlaskConical, BookOpen, 
  Leaf, ChevronRight, ArrowRight
} from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const SCIENTIFIC_FLOW = [
  {
    id: 'data',
    label: 'البيانات',
    icon: Database,
    desc: 'معلومات الدفعات والمطابقة',
    prompt: 'كيف أسجل دفعة نوى جديدة وأطابقها مع معايير الجودة؟'
  },
  {
    id: 'analyze',
    label: 'التحليل',
    icon: LineChart,
    desc: 'تحليل الخصائص الحيوية',
    prompt: 'حلل الخصائص الحيوية لنوى التمر وما هي المؤشرات الأساسية؟'
  },
  {
    id: 'application',
    label: 'الاستخدامات',
    icon: FlaskConical,
    desc: 'مسارات الاستفادة الصناعية',
    prompt: 'ما هي مسارات الاستفادة الصناعية المتاحة لزيت وفحم نوى التمر؟'
  },
  {
    id: 'evidence',
    label: 'الأدلة',
    icon: BookOpen,
    desc: 'الأبحاث والدراسات العلمية',
    prompt: 'ابحث في الأدلة والدراسات العلمية الموثقة حول نوى التمر.'
  },
  {
    id: 'impact',
    label: 'الأثر',
    icon: Leaf,
    desc: 'تقييم الأثر البيئي والاقتصادي',
    prompt: 'كيف نقيم الأثر البيئي وتقليل الانبعاثات عند إعادة تدوير النوى؟'
  }
];

const QUICK_ACTIONS = [
  { label: 'تحليل دفعة', prompt: 'أريد تحليل بيانات دفعة نوى تم تسجيلها مؤخراً.' },
  { label: 'استكشاف الاستخدامات', prompt: 'ما هي أفضل الاستخدامات الصناعية للكميات الكبيرة من النوى؟' },
  { label: 'البحث في الأدلة', prompt: 'هل توجد دراسات تدعم استخدام نوى التمر كبديل للقهوة؟' },
  { label: 'التجارب والاختبارات', prompt: 'كيف تتم اختبارات الجودة على الفحم المنشط من نوى التمر؟' }
];

function renderFormattedText(text: string) {
  const lines = text.split("\n");
  let inList = false;

  const elements: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    let trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={`br-${lineIdx}`} className="h-2" />);
      return;
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h4 key={lineIdx} className="font-bold text-sm mt-4 mb-2 text-slate-800 border-b border-slate-100 pb-1 inline-block">
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

      // Special scientific styling if bullet contains a colon ":" (e.g. "درجة الارتباط: مرتفعة")
      if (trimmed.includes(":") && !trimmed.includes("http")) {
        const [key, ...valueParts] = trimmed.split(":");
        const val = valueParts.join(":");
        elements.push(
          <div key={lineIdx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 my-2 p-3 bg-stone-50/50 rounded-lg border border-stone-100/50">
            <span className="font-bold text-emerald-800 text-xs sm:text-sm">{key.replace(/\*\*/g, '')}:</span>
            <span className="text-slate-600 text-sm">{val.replace(/\*\*/g, '')}</span>
          </div>
        );
      } else {
        elements.push(
          <div key={lineIdx} className="flex items-start gap-2.5 my-1.5 pr-1">
            <span className="w-1.5 h-1.5 rounded-sm bg-emerald-500/40 mt-2 shrink-0"></span>
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

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-white font-sans text-slate-800" dir="rtl">
      
      {/* HEADER: Premium & Scientific */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-stone-100 shrink-0 bg-white z-30 gap-4 sm:gap-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-100/50">
            <Bot size={20} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-sm">مساعد نواة <span className="text-emerald-700 font-black">AI</span></h1>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[9px] font-bold text-emerald-700 border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                متصل
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 hidden sm:block">
              مساعد ذكي لفهم بيانات نوى التمر واستكشاف مسارات الاستفادة منها.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {!isChatEmpty && (
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-200"
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
        className="flex-1 overflow-y-auto scroll-smooth w-full relative bg-[#FCFDFD]" // Off-white with a tiny tint
      >
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 pt-8 pb-32 min-h-full flex flex-col relative z-10">
          
          {isChatEmpty ? (
            /* HERO & WELCOME STATE */
            <div className="flex flex-col items-center w-full mt-4 sm:mt-8">
              
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 tracking-tight">
                  ماذا تريد أن تعرف عن <span className="text-emerald-700">نوى التمر؟</span>
                </h2>
                <p className="text-slate-500 text-sm sm:text-base font-medium max-w-lg mx-auto leading-relaxed">
                  اسأل عن الدفعات، الخصائص، الاستخدامات، التجارب أو الأدلة العلمية.
                </p>
              </div>

              {/* SCIENTIFIC CIRCULAR FLOW (The Orbit) */}
              <div className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] mb-12 flex items-center justify-center mx-auto">
                
                {/* SVG Track with Arrows */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-150 -150 300 300">
                  <circle cx="0" cy="0" r="110" fill="none" stroke="#f5f5f4" strokeWidth="1.5" />
                  
                  {/* Subtle directional arrows on the track (midpoints between 5 nodes) */}
                  {[-54, 18, 90, 162, 234].map((angle, i) => {
                    // Convert angle to radians for SVG coords
                    const rad = (angle * Math.PI) / 180;
                    const r = 110;
                    const x = r * Math.cos(rad);
                    const y = r * Math.sin(rad);
                    
                    return (
                      <g key={i} transform={`translate(${x}, ${y}) rotate(${angle + 90})`} opacity="0.3">
                        <path d="M-4,4 L0,0 L4,4" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                    );
                  })}
                </svg>
                
                {/* Flow Indicator Particle */}
                {!prefersReducedMotion && (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div className="w-[220px] h-[220px] rounded-full border border-transparent relative">
                       <div className="absolute top-[-2px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                  </motion.div>
                )}

                {/* Central Hub */}
                <div className="relative z-10 flex flex-col items-center justify-center bg-white rounded-full w-24 h-24 sm:w-28 sm:h-28 border border-stone-100 shadow-sm">
                  <Bot className="w-7 h-7 text-emerald-700 mb-1.5" strokeWidth={1.5} />
                  <span className="text-[10px] font-bold text-slate-800">مساعد نواة</span>
                  <span className="text-[8px] text-emerald-600/70 font-medium tracking-widest mt-0.5">AI CORE</span>
                </div>

                {/* Interactive Nodes */}
                {SCIENTIFIC_FLOW.map((node, index) => {
                  const angle = (index * 72) - 90; // 5 nodes = 360/5 = 72 deg apart
                  const isActive = activeNodeId === node.id;
                  
                  return (
                    <div 
                      key={node.id}
                      className="absolute inset-0 pointer-events-none flex items-center justify-center"
                      style={{ transform: `rotate(${angle}deg)` }}
                    >
                      <div 
                        className="absolute pointer-events-auto"
                        style={{ transform: `translateY(-110px)` }} // Radius = 110px
                      >
                        <button 
                          onClick={() => setActiveNodeId(node.id)}
                          onMouseEnter={() => setActiveNodeId(node.id)}
                          className="group relative flex flex-col items-center justify-center focus:outline-none"
                          style={{ transform: `rotate(${-angle}deg)` }}
                          aria-label={node.label}
                        >
                          {/* Node Icon Circle */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isActive 
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-110' 
                              : 'bg-white border border-stone-200 text-slate-500 hover:border-emerald-200 hover:text-emerald-600 shadow-sm hover:scale-105'
                          }`}>
                            <node.icon className="w-4 h-4" strokeWidth={1.5} />
                          </div>
                          
                          {/* Node Label (positioned smartly) */}
                          <div className={`absolute whitespace-nowrap transition-all duration-300 ${
                            isActive ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100 pointer-events-none'
                          } ${
                            angle > -45 && angle < 45 ? 'right-full mr-3 top-1/2 -translate-y-1/2' : // Right side
                            angle >= 45 && angle <= 135 ? 'bottom-full mb-3 left-1/2 -translate-x-1/2' : // Bottom
                            angle > 135 || angle < -135 ? 'left-full ml-3 top-1/2 -translate-y-1/2' : // Left side
                            'top-full mt-3 left-1/2 -translate-x-1/2' // Top
                          }`}>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md border shadow-sm ${
                              isActive ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-700 border-stone-200'
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

              {/* Dynamic Context Card (For the active node) */}
              <div className="w-full max-w-md mx-auto mb-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeNodeId}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col items-center text-center p-5 bg-white border border-stone-100 rounded-2xl shadow-sm"
                  >
                    <span className="text-xs font-bold tracking-wider text-emerald-700 mb-1 uppercase opacity-80">{activeNode.label}</span>
                    <p className="text-sm text-slate-600 font-medium mb-4">أستطيع مساعدتك في {activeNode.desc}.</p>
                    <button 
                      onClick={() => handleSend(activeNode.prompt)}
                      className="flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <span>اسأل المساعد</span>
                      <ArrowRight className="w-3 h-3 rtl:-scale-x-100" />
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* QUICK ACTIONS ROW */}
              <div className="w-full max-w-2xl mx-auto flex flex-wrap justify-center gap-2 sm:gap-3 px-4">
                {QUICK_ACTIONS.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(action.prompt)}
                    className="text-xs font-medium text-slate-600 bg-stone-50 hover:bg-stone-100 border border-stone-200 px-4 py-2 rounded-full transition-colors focus:outline-none focus:border-emerald-300"
                  >
                    {action.label}
                  </button>
                ))}
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
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    m.sender === 'user' 
                      ? 'bg-stone-50 border-stone-200 text-slate-500' 
                      : 'bg-emerald-50/50 border-emerald-100/50 text-emerald-700 shadow-sm'
                  }`}>
                    {m.sender === 'user' ? <User className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} /> : <Bot className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />}
                  </div>

                  <div className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[80%]`}>
                    <div className={`px-4 sm:px-5 py-3 sm:py-4 text-sm leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-white border border-stone-100 text-slate-800 rounded-2xl shadow-sm'
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
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50/50 border border-emerald-100/50 text-emerald-700 shadow-sm flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-4">
                    <span className="flex gap-1">
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-1.5 h-1.5 bg-emerald-600/40 rounded-full" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 bg-emerald-600/40 rounded-full" />
                      <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 bg-emerald-600/40 rounded-full" />
                    </span>
                    <span className="text-xs text-slate-400 font-medium ml-2">يقوم المساعد العلمي بتحليل المعطيات...</span>
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
              placeholder="اكتب سؤالك عن بيانات نوى التمر..."
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
            <p className="text-[9px] text-slate-400 font-medium tracking-wide">
              NAWAH AI ASSISTANT — SCIENTIFIC INTELLIGENCE FOR DATE PALM PITS
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
