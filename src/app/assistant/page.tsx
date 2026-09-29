"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Send, User, RefreshCw, 
  Database, Activity, LineChart, BookOpen, FlaskConical, Leaf,
  Home, Sparkles
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
    id: 'batches',
    label: 'الدفعات',
    icon: Database,
    desc: 'سجلات موثقة لبيانات ومصادر دفعات نوى التمر المسجلة في النظام.',
    prompt: 'كيف أسجل دفعة نوى جديدة في المنصة وأوثق مصدرها؟'
  },
  {
    id: 'data',
    label: 'البيانات',
    icon: Activity,
    desc: 'مؤشرات ومعطيات رقمية للخصائص الفيزيائية والكيميائية المستخرجة.',
    prompt: 'ما هي البيانات والخصائص التي يتم جمعها لكل دفعة من نوى التمر؟'
  },
  {
    id: 'analyze',
    label: 'التحليل',
    icon: LineChart,
    desc: 'معالجة وتحليل المطابقة مع معايير الجودة للاستخدامات المختلفة.',
    prompt: 'كيف يتم تحليل الخصائص الحيوية لنوى التمر وما هي المؤشرات الأساسية؟'
  },
  {
    id: 'evidence',
    label: 'الأدلة',
    icon: BookOpen,
    desc: 'قاعدة المعرفة والأبحاث والدراسات العلمية الداعمة للنتائج.',
    prompt: 'ابحث في الأدلة والدراسات العلمية الموثقة حول نوى التمر.'
  },
  {
    id: 'application',
    label: 'الاستخدامات',
    icon: FlaskConical,
    desc: 'مسارات الاستفادة الصناعية والتجارية (الفحم، الزيوت، البدائل).',
    prompt: 'ما هي مسارات الاستفادة الصناعية المتاحة لزيت وفحم نوى التمر؟'
  },
  {
    id: 'impact',
    label: 'الأثر',
    icon: Leaf,
    desc: 'قياس الأثر البيئي والاقتصادي وحجم خفض الانبعاثات الكربونية.',
    prompt: 'كيف نقيم الأثر البيئي ونحسب تقليل الانبعاثات عند إعادة تدوير النوى؟'
  }
];

const QUICK_ACTIONS = [
  { label: 'تحليل دفعة', prompt: 'قم بتحليل بيانات أحدث دفعة نوى تمر تم تسجيلها وما هي أبرز خصائصها؟' },
  { label: 'استكشاف الاستخدامات', prompt: 'ما هي مسارات الاستخدامات الصناعية المثلى لنوى التمر بناءً على البيانات؟' },
  { label: 'البحث في الأدلة', prompt: 'ابحث في الأدلة العلمية عن استخدام نوى التمر كبديل للقهوة الخالية من الكافيين.' },
  { label: 'تحليل الأثر', prompt: 'كيف يمكن تقييم الأثر البيئي وتقليل الانبعاثات عند إعادة تدوير النوى؟' }
];

function renderFormattedText(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    let trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={`br-${lineIdx}`} className="h-1.5" />);
      return;
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h4 key={lineIdx} className="font-bold text-sm mt-3 mb-1 text-slate-800">
          {trimmed.replace(/^###\s+/, "")}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h3 key={lineIdx} className="font-bold text-sm mt-4 mb-2 text-emerald-900 border-b border-emerald-100 pb-1 inline-block">
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

      if (trimmed.includes(":") && !trimmed.includes("http")) {
        const [key, ...valueParts] = trimmed.split(":");
        const val = valueParts.join(":");
        elements.push(
          <div key={lineIdx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 my-2 p-2.5 bg-stone-50/50 rounded-lg border border-stone-200 text-xs sm:text-sm">
            <span className="font-bold text-emerald-800 shrink-0">{key.replace(/\*\*/g, '')}:</span>
            <span className="text-slate-700">{val.replace(/\*\*/g, '')}</span>
          </div>
        );
      } else {
        elements.push(
          <div key={lineIdx} className="flex items-start gap-2 my-1 pr-1 text-xs sm:text-sm">
            <span className="w-1.5 h-1.5 rounded-sm bg-emerald-500/50 mt-1.5 shrink-0"></span>
            <span className="flex-1 text-slate-700 leading-relaxed">{content}</span>
          </div>
        );
      }
      return;
    }

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
      <p key={lineIdx} className="my-1 text-slate-700 leading-relaxed text-xs sm:text-sm">
        {content}
      </p>
    );
  });

  return elements;
}

export default function AssistantWorkspace() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [activeNodeId, setActiveNodeId] = useState<string>(SCIENTIFIC_FLOW[0].id);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeNode = SCIENTIFIC_FLOW.find(t => t.id === activeNodeId) || SCIENTIFIC_FLOW[0];
  const isChatEmpty = messages.length === 0;

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
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

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const historyPayload = [...messages, userMessage].map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageContent, history: historyPayload })
      });

      if (!res.ok) throw new Error('فشل الاتصال بخدمة المساعد');

      const data = await res.json();
      const replyText = data.reply || 'تم استلام استفسارك وتأكيده.';

      const assistantReply: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantReply]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("تعذر الاتصال بالخوادم حالياً، يرجى إعادة المحاولة.");
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
    <div className="h-[calc(100vh-80px)] w-full flex flex-row bg-white overflow-hidden font-sans text-slate-800" dir="rtl">
      
      {/* 1. RIGHT SIDEBAR (Navigation) */}
      <aside className="hidden md:flex w-64 flex-col border-l border-stone-200 bg-stone-50/30 shrink-0 h-full">
        <div className="p-6">
          <h2 className="text-emerald-800 font-black text-lg tracking-wide mb-6">نواة NAWAH</h2>
          <nav className="flex flex-col gap-1.5">
            <Link href="/pit-management/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors font-medium">
              <Home size={16} strokeWidth={2} /> الرئيسية
            </Link>
            <div className="my-2 border-b border-stone-200/60" />
            
            {SCIENTIFIC_FLOW.map(node => (
              <button 
                key={node.id} 
                onClick={() => setActiveNodeId(node.id)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors font-bold ${
                  activeNodeId === node.id 
                    ? 'bg-emerald-100/60 text-emerald-800' 
                    : 'text-slate-500 hover:bg-stone-100 hover:text-slate-800'
                }`}
              >
                <node.icon size={16} strokeWidth={2} /> {node.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white p-3 rounded-xl border border-stone-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            المساعد متصل
          </div>
        </div>
      </aside>

      {/* 2. CENTRAL WORKSPACE (Chat) */}
      <div className="flex-1 flex flex-col h-full bg-white relative min-w-0">
        
        {/* Workspace Header */}
        <header className="px-4 sm:px-8 py-4 border-b border-stone-100 flex items-center justify-between shrink-0 bg-white/90 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-100">
              <Bot size={18} strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-sm">مساعد نواة</h1>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">مساعد ذكي لفهم بيانات نوى التمر واستكشاف مسارات الاستفادة منها.</p>
            </div>
          </div>
          {!isChatEmpty && (
            <button
              onClick={handleClearChat}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors border border-stone-100"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>محادثة جديدة</span>
            </button>
          )}
        </header>
        
        {/* Workspace Main (Messages) */}
        <main ref={scrollContainerRef} className="flex-1 overflow-y-auto scroll-smooth p-4 sm:p-8">
          {isChatEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-200 text-emerald-700 flex items-center justify-center mb-6 shadow-sm">
                <Sparkles size={28} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 tracking-tight">كيف يمكنني مساعدتك؟</h2>
              <p className="text-sm text-slate-500 mb-10 font-medium">اختر أحد الإجراءات السريعة أدناه أو اكتب سؤالك مباشرة للبدء في الاستكشاف.</p>
              
              {/* Horizontal Quick Actions */}
              <div className="flex flex-row flex-wrap justify-center gap-2 sm:gap-3">
                {QUICK_ACTIONS.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(action.prompt)}
                    className="px-4 py-2 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-lg text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-800 transition-colors shadow-sm"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto flex flex-col gap-6 sm:gap-8">
              {messages.map((m) => (
                <div key={m.id} className={`flex items-start gap-4 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    m.sender === 'user' ? 'bg-stone-50 border-stone-200 text-slate-500' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                  }`}>
                    {m.sender === 'user' ? <User size={16} strokeWidth={2} /> : <Bot size={16} strokeWidth={2} />}
                  </div>
                  <div className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[80%]`}>
                    <div className={`px-4 sm:px-5 py-3 sm:py-4 rounded-2xl ${
                      m.sender === 'user'
                        ? 'bg-white border border-stone-200 text-slate-800 shadow-sm'
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
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Bot size={16} strokeWidth={2} />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-4">
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Workspace Footer (Input) */}
        <footer className="p-4 sm:p-6 shrink-0 border-t border-stone-100 bg-white">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="max-w-3xl mx-auto flex items-end gap-3 bg-stone-50 border border-stone-200 focus-within:bg-white focus-within:border-emerald-500 focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] rounded-xl p-2 transition-all"
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
        </footer>
      </div>

      {/* 3. LEFT CONTEXT PANEL (Right in English, Left in RTL) */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-stone-200 bg-stone-50/30 shrink-0 h-full p-6 overflow-y-auto">
        <h3 className="font-bold text-slate-800 text-xs tracking-widest mb-6 flex items-center gap-2 uppercase">
          <Activity size={14} className="text-emerald-600" /> سياق نواة
        </h3>
        
        {/* Miniature Interactive Circular Flow Widget */}
        <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
          <svg className="absolute inset-2 pointer-events-none" viewBox="-60 -60 120 120">
            <circle cx="0" cy="0" r="50" fill="none" stroke="#e7e5e4" strokeWidth="1" strokeDasharray="3 3" />
            {[-60, 0, 60, 120, 180, 240].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 50 * Math.cos(rad);
              const y = 50 * Math.sin(rad);
              return (
                <g key={i} transform={`translate(${x}, ${y}) rotate(${angle + 90})`} opacity="0.4">
                  <path d="M-3,3 L0,0 L3,3" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              );
            })}
          </svg>
          
          <div className="w-10 h-10 bg-white border border-stone-200 rounded-full flex items-center justify-center z-10 shadow-sm">
             <Bot className="text-emerald-700 w-5 h-5" strokeWidth={1.5} />
          </div>

          {SCIENTIFIC_FLOW.map((node, i) => {
            const angle = (i * 60) - 90;
            const isActive = activeNodeId === node.id;
            return (
              <div key={node.id} className="absolute inset-2 pointer-events-none" style={{ transform: `rotate(${angle}deg)` }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                  <button 
                    onClick={() => setActiveNodeId(node.id)}
                    title={node.label}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive ? 'bg-emerald-600 text-white shadow-md scale-110' : 'bg-white text-slate-400 border border-stone-200 hover:border-emerald-300 hover:text-emerald-600'
                    }`} 
                    style={{ transform: `rotate(${-angle}deg)` }}
                  >
                    <node.icon size={12} strokeWidth={2} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Context Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNodeId}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <activeNode.icon size={16} strokeWidth={2} /> {activeNode.label}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {activeNode.desc}
            </p>
            
            {/* Dynamic Data Chips connected to the context */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex justify-between items-center bg-stone-50 px-3 py-2.5 rounded-lg border border-stone-100 text-[10px] font-bold">
                <span className="text-slate-600">الدفعات المرتبطة</span>
                <span className="text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded">3 دفعات</span>
              </div>
              <div className="flex justify-between items-center bg-stone-50 px-3 py-2.5 rounded-lg border border-stone-100 text-[10px] font-bold">
                <span className="text-slate-600">الأدلة المتوفرة</span>
                <span className="text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded">7 أدلة</span>
              </div>
              <div className="flex justify-between items-center bg-stone-50 px-3 py-2.5 rounded-lg border border-stone-100 text-[10px] font-bold">
                <span className="text-slate-600">مسارات الاستخدام</span>
                <span className="text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded">4 مسارات</span>
              </div>
            </div>
            
            <button 
              onClick={() => handleSend(activeNode.prompt)}
              className="mt-2 text-[11px] font-bold text-white bg-slate-900 hover:bg-emerald-700 px-4 py-2.5 rounded-lg transition-colors w-full"
            >
              اسأل المساعد
            </button>
          </motion.div>
        </AnimatePresence>
      </aside>

    </div>
  );
}
