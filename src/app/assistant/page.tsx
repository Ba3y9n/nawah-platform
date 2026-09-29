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
    <div className="h-[calc(100vh-80px)] w-full flex flex-row bg-[#FAFDFB] overflow-hidden font-sans text-slate-800" dir="rtl">
      
      {/* 1. RIGHT SIDEBAR (Navigation) */}
      <aside className="hidden md:flex w-64 flex-col border-l border-stone-200/80 bg-white/70 backdrop-blur-xl shrink-0 h-full">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center font-black text-sm shadow-md shadow-emerald-700/20">
              ن
            </div>
            <div>
              <h2 className="text-emerald-950 font-black text-base tracking-wide">منصة نواة</h2>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">AI Intelligence</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            <Link href="/pit-management/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 text-xs text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/80 rounded-xl transition-all font-bold group">
              <Home size={16} strokeWidth={2} className="text-slate-400 group-hover:text-emerald-600 transition-colors" /> 
              <span>لوحة التحكم</span>
            </Link>
            <div className="my-2 border-b border-stone-200/60" />
            
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 mb-1">المحاور العلمية</span>
            {SCIENTIFIC_FLOW.map(node => {
              const isActive = activeNodeId === node.id;
              return (
                <button 
                  key={node.id} 
                  onClick={() => setActiveNodeId(node.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl transition-all font-bold ${
                    isActive 
                      ? 'bg-emerald-900 text-white shadow-md shadow-emerald-900/20 scale-[1.02]' 
                      : 'text-slate-600 hover:bg-stone-100/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <node.icon size={16} strokeWidth={2} className={isActive ? "text-emerald-300" : "text-slate-400"} />
                    <span>{node.label}</span>
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6">
          <div className="flex items-center gap-3 text-xs font-bold text-slate-700 bg-white/90 p-3.5 rounded-2xl border border-stone-200/80 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-900">المساعد متصل</span>
              <span className="text-[10px] text-emerald-600 font-medium">Gemini 2.5 Active</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. CENTRAL WORKSPACE (Chat) */}
      <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-[#FAFDFB] via-white to-[#F5F8F6] relative min-w-0">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none"></div>

        {/* Workspace Header */}
        <header className="px-6 sm:px-8 py-3.5 border-b border-stone-200/60 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent flex items-center justify-center text-emerald-700 border border-emerald-500/20 shadow-sm">
              <Bot size={20} strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-slate-900 text-sm">مساعد نواة الذكي</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">AI Workspace</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">بيئة عمل ذكية لتحليل ومطابقة بيانات نوى التمر مع مسارات الاستفادة الصناعية.</p>
            </div>
          </div>
          {!isChatEmpty && (
            <button
              onClick={handleClearChat}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-xl hover:bg-stone-100 transition-colors border border-stone-200/80 bg-white shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>محادثة جديدة</span>
            </button>
          )}
        </header>
        
        {/* Workspace Main (Messages) */}
        <main ref={scrollContainerRef} className="flex-1 overflow-y-auto scroll-smooth p-4 sm:p-8 relative z-0">
          {isChatEmpty ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center justify-center h-full text-center max-w-3xl mx-auto py-6"
            >
              {/* Glowing Hero Icon */}
              <motion.div 
                animate={{ y: [0, -6, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-900 text-white flex items-center justify-center mb-6 shadow-[0_12px_30px_rgba(5,150,105,0.25)] ring-8 ring-emerald-50 relative"
              >
                <Sparkles size={32} strokeWidth={1.75} className="relative z-10" />
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">
                كيف يمكن لمساعد نواة دعم بحثك اليوم؟
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-8 max-w-xl font-medium leading-relaxed">
                حلل بيانات الدفعات، استكشف مسارات الاستثمار الصناعي، وابحث في الأدلة والأوراق العلمية الموثقة.
              </p>
              
              {/* 2x2 LUXURY ACTION CARDS */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.08 }
                  }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-2xl text-right"
              >
                {[
                  {
                    title: 'تحليل أحدث الدفعات',
                    sub: 'فحص الخصائص والمؤشرات الحيوية المسجلة',
                    icon: Database,
                    color: 'text-emerald-700 bg-emerald-50 border-emerald-200/60',
                    prompt: 'قم بتحليل بيانات أحدث دفعة نوى تمر تم تسجيلها وما هي أبرز خصائصها؟'
                  },
                  {
                    title: 'استكشاف مسارات الاستثمار',
                    sub: 'مسارات الفحم الحيوي، الزيوت، والبدائل الصحية',
                    icon: FlaskConical,
                    color: 'text-amber-700 bg-amber-50 border-amber-200/60',
                    prompt: 'ما هي مسارات الاستخدامات الصناعية المثلى لنوى التمر بناءً على البيانات؟'
                  },
                  {
                    title: 'البحث في الأدلة العلمية',
                    sub: 'استعراض الدراسات والأبحاث الموثقة حول النوى',
                    icon: BookOpen,
                    color: 'text-blue-700 bg-blue-50 border-blue-200/60',
                    prompt: 'ابحث في الأدلة العلمية عن استخدام نوى التمر كبديل للقهوة الخالية من الكافيين.'
                  },
                  {
                    title: 'تقدير الأثر البيئي',
                    sub: 'احتساب خفض الانبعاثات ورفع كفاءة المياه',
                    icon: Leaf,
                    color: 'text-emerald-800 bg-emerald-50 border-emerald-200/60',
                    prompt: 'كيف يمكن تقييم الأثر البيئي وتقليل الانبعاثات عند إعادة تدوير النوى؟'
                  }
                ].map((action, idx) => (
                  <motion.button
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    key={idx}
                    onClick={() => handleSend(action.prompt)}
                    className="p-4 bg-white/90 hover:bg-white border border-stone-200/90 hover:border-emerald-400/80 rounded-2xl transition-all shadow-sm hover:shadow-md hover:-translate-y-1 group flex items-start gap-3.5"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${action.color} group-hover:scale-110 transition-transform`}>
                      <action.icon size={18} strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {action.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                        {action.sub}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <div className="max-w-3xl mx-auto flex flex-col gap-6 sm:gap-8">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    key={m.id} 
                    className={`flex items-start gap-4 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                      m.sender === 'user' ? 'bg-slate-900 border-slate-800 text-white shadow-sm' : 'bg-gradient-to-br from-emerald-600 to-emerald-800 border-emerald-700 text-white shadow-md shadow-emerald-700/20'
                    }`}>
                      {m.sender === 'user' ? <User size={18} strokeWidth={2} /> : <Bot size={18} strokeWidth={2} />}
                    </div>
                    <div className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[80%]`}>
                      <div className={`px-5 sm:px-6 py-4 rounded-3xl ${
                        m.sender === 'user'
                          ? 'bg-white border border-stone-200/90 text-slate-800 shadow-sm'
                          : 'bg-white/80 border border-emerald-100 text-slate-800 shadow-sm'
                      }`}>
                        <div className="w-full break-words">
                          {renderFormattedText(m.text)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-700/20">
                    <Bot size={18} strokeWidth={2} />
                  </div>
                  <div className="flex items-center gap-1.5 px-4 py-4 bg-white rounded-2xl border border-stone-200/80 shadow-sm">
                    <motion.span animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <motion.span animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <motion.span animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-xs font-bold text-slate-500 mr-2">جاري التفكير وتحليل البيانات...</span>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </main>

        {/* Workspace Footer (Input) */}
        <footer className="p-4 sm:p-6 shrink-0 border-t border-stone-200/60 bg-white/70 backdrop-blur-md z-10">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="max-w-3xl mx-auto flex items-end gap-3 bg-white border border-stone-300/80 focus-within:border-emerald-500 focus-within:shadow-[0_8px_30px_rgb(16,185,129,0.15)] rounded-2xl p-2.5 transition-all duration-300 shadow-sm"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="اكتب سؤالك عن بيانات نوى التمر، مسارات الاستفادة، أو الأدلة العلمية..."
              className="flex-1 bg-transparent border-none outline-none text-slate-900 px-4 py-3 text-xs sm:text-sm resize-none max-h-32 min-h-[48px] placeholder:text-slate-400 disabled:opacity-50 font-medium"
              rows={1}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-emerald-800 hover:bg-emerald-700 disabled:bg-stone-200 disabled:text-stone-400 text-white w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all focus:outline-none hover:shadow-lg hover:shadow-emerald-700/25"
            >
              <Send className="w-5 h-5 rtl:-translate-x-0.5" strokeWidth={2} />
            </button>
          </form>
        </footer>
      </div>

      {/* 3. LEFT CONTEXT PANEL (Right in English, Left in RTL) */}
      <aside className="hidden lg:flex w-80 flex-col border-r border-stone-200/80 bg-white/70 backdrop-blur-xl shrink-0 h-full p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-slate-800 text-xs tracking-wider flex items-center gap-2 uppercase">
            <Activity size={14} className="text-emerald-600" /> سياق نواة العلمي
          </h3>
          <span className="text-[10px] bg-emerald-100/60 text-emerald-800 px-2 py-0.5 rounded font-bold">Interactive Orbit</span>
        </div>
        
        {/* Miniature Interactive Circular Flow Widget */}
        <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
          
          {/* Outer Ambient Glow */}
          <div className="absolute inset-4 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>

          {/* Rotating Dashed Track */}
          <motion.svg 
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 pointer-events-none origin-center" 
            viewBox="-60 -60 120 120"
          >
            <circle cx="0" cy="0" r="50" fill="none" stroke="#d6d3d1" strokeWidth="1.25" strokeDasharray="4 4" />
          </motion.svg>
          
          {/* Static Arrows */}
          <svg className="absolute inset-2 pointer-events-none" viewBox="-60 -60 120 120">
            {[-60, 0, 60, 120, 180, 240].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 50 * Math.cos(rad);
              const y = 50 * Math.sin(rad);
              return (
                <g key={i} transform={`translate(${x}, ${y}) rotate(${angle + 90})`} opacity="0.7">
                  <path d="M-3,3 L0,0 L3,3" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              );
            })}
          </svg>
          
          <div className="w-12 h-12 bg-gradient-to-tr from-emerald-50 to-white border-2 border-emerald-200/80 rounded-full flex items-center justify-center z-10 shadow-md relative">
             <Bot className="text-emerald-800 w-6 h-6 relative z-10" strokeWidth={2} />
          </div>

          {SCIENTIFIC_FLOW.map((node, i) => {
            const angle = (i * 60) - 90;
            const isActive = activeNodeId === node.id;
            return (
              <div key={node.id} className="absolute inset-2 pointer-events-none" style={{ transform: `rotate(${angle}deg)` }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                  
                  {isActive && (
                    <motion.div 
                      layoutId="activeNodeGlow"
                      className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-50"
                    />
                  )}
                  
                  <button 
                    onClick={() => setActiveNodeId(node.id)}
                    title={node.label}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-800/30 scale-125 ring-2 ring-emerald-300' : 'bg-white text-slate-500 border border-stone-200 hover:border-emerald-400 hover:text-emerald-700 hover:scale-110 shadow-sm'
                    }`} 
                    style={{ transform: `rotate(${-angle}deg)` }}
                  >
                    <node.icon size={13} strokeWidth={2} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Context Details Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNodeId}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.2 }}
            className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col gap-4 relative overflow-hidden"
          >
            {/* Subtle corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-100/60 to-transparent rounded-tr-3xl pointer-events-none"></div>

            <div className="flex items-center gap-2.5 text-emerald-900 font-black text-sm relative z-10">
              <div className="w-7 h-7 rounded-lg bg-emerald-100/70 flex items-center justify-center text-emerald-800">
                <activeNode.icon size={15} strokeWidth={2} />
              </div>
              <span>{activeNode.label}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium relative z-10">
              {activeNode.desc}
            </p>
            
            {/* Dynamic Data Chips */}
            <div className="flex flex-col gap-2 mt-1 relative z-10">
              <div className="flex justify-between items-center bg-stone-50/80 hover:bg-stone-100/80 transition-colors px-3 py-2.5 rounded-xl border border-stone-100 text-[10px] font-bold">
                <span className="text-slate-600">الدفعات المرتبطة بالسياق</span>
                <span className="text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">3 دفعات</span>
              </div>
              <div className="flex justify-between items-center bg-stone-50/80 hover:bg-stone-100/80 transition-colors px-3 py-2.5 rounded-xl border border-stone-100 text-[10px] font-bold">
                <span className="text-slate-600">الأدلة والدراسات المتوفرة</span>
                <span className="text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">7 أدلة</span>
              </div>
              <div className="flex justify-between items-center bg-stone-50/80 hover:bg-stone-100/80 transition-colors px-3 py-2.5 rounded-xl border border-stone-100 text-[10px] font-bold">
                <span className="text-slate-600">مسارات الاستخدام المحتملة</span>
                <span className="text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">4 مسارات</span>
              </div>
            </div>
            
            <button 
              onClick={() => handleSend(activeNode.prompt)}
              className="mt-2 text-xs font-bold text-white bg-emerald-900 hover:bg-emerald-800 px-4 py-3 rounded-xl transition-all hover:shadow-md hover:shadow-emerald-900/20 w-full relative z-10"
            >
              اسأل المساعد عن هذا المحور
            </button>
          </motion.div>
        </AnimatePresence>
      </aside>

    </div>
  );
}
