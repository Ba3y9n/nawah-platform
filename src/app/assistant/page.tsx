"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Send, User, RefreshCw, 
  Database, Activity, LineChart, BookOpen, FlaskConical, Leaf,
  Home, Sparkles, ArrowRight, CheckCircle2, ChevronLeft
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
    step: '01',
    desc: 'سجلات موثقة لبيانات ومصادر دفعات نوى التمر المسجلة في المنظومة الوطنية.',
    prompt: 'كيف أسجل دفعة نوى جديدة في المنصة وأوثق مصدرها وكميتها؟',
    stats: { count: '3 دفعات', active: 'جاهزة للتحليل' }
  },
  {
    id: 'data',
    label: 'البيانات',
    icon: Activity,
    step: '02',
    desc: 'مؤشرات ومعطيات رقمية للخصائص الفيزيائية والكيميائية المستخرجة من الفحص المخبري.',
    prompt: 'ما هي البيانات والخصائص الحيوية التي يتم جمعها لكل دفعة من نوى التمر؟',
    stats: { count: '12 مؤشر', active: 'كثافة ورطوبة وزيوت' }
  },
  {
    id: 'analyze',
    label: 'التحليل',
    icon: LineChart,
    step: '03',
    desc: 'معالجة ومطابقة ذكية مع معايير الجودة للاستخدامات الصناعية والبيئية المختلفة.',
    prompt: 'كيف يتم تحليل الخصائص ومطابقتها مع المعايير الصناعية للاستفادة من النوى؟',
    stats: { count: '98% دقة', active: 'مطابقة قياسية' }
  },
  {
    id: 'evidence',
    label: 'الأدلة',
    icon: BookOpen,
    step: '04',
    desc: 'قاعدة المعرفة والأبحاث والدراسات العلمية المحكمة الداعمة للنتائج والتطبيقات.',
    prompt: 'ابحث في الأدلة والدراسات العلمية الموثقة حول نوى التمر واستخداماتها.',
    stats: { count: '7 دراسات', active: 'أوراق محكمة' }
  },
  {
    id: 'application',
    label: 'الاستخدامات',
    icon: FlaskConical,
    step: '05',
    desc: 'مسارات الاستفادة الصناعية والتجارية مثل الفحم الحيوي، الزيوت، وبدائل الأغذية.',
    prompt: 'ما هي مسارات الاستفادة الصناعية المثلى لزيت وفحم نوى التمر بناءً على البيانات؟',
    stats: { count: '4 مسارات', active: 'فحم، زيت، أعلاف، كربون' }
  },
  {
    id: 'impact',
    label: 'الأثر',
    icon: Leaf,
    step: '06',
    desc: 'قياس الأثر البيئي والاقتصادي وحجم خفض الانبعاثات الكربونية ورفع كفاءة الاستدامة.',
    prompt: 'كيف نقيم الأثر البيئي ونحسب تقليل الانبعاثات عند استثمار وتدوير نوى التمر؟',
    stats: { count: '4.2 طن CO2', active: 'خفض متوقع لكل 10 طن' }
  }
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
        <h4 key={lineIdx} className="font-black text-sm mt-3 mb-1 text-emerald-950">
          {trimmed.replace(/^###\s+/, "")}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h3 key={lineIdx} className="font-black text-sm mt-4 mb-2 text-emerald-900 border-b border-emerald-200 pb-1 inline-block">
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
          <div key={lineIdx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 my-2 p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 text-xs sm:text-sm">
            <span className="font-black text-emerald-900 shrink-0">{key.replace(/\*\*/g, '')}:</span>
            <span className="text-slate-800 leading-relaxed">{val.replace(/\*\*/g, '')}</span>
          </div>
        );
      } else {
        elements.push(
          <div key={lineIdx} className="flex items-start gap-2 my-1 pr-1 text-xs sm:text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
            <span className="flex-1 text-slate-800 leading-relaxed">{content}</span>
          </div>
        );
      }
      return;
    }

    const parts = trimmed.split(/(\*\*.*?\*\*)/g);
    const content = parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={pIdx} className="font-black text-slate-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    elements.push(
      <p key={lineIdx} className="my-1.5 text-slate-800 leading-relaxed text-xs sm:text-sm">
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
      
      {/* 1. RIGHT SIDEBAR (Navigation & Flow Indicators) */}
      <aside className="hidden md:flex w-64 flex-col border-l border-stone-200/80 bg-white/90 backdrop-blur-xl shrink-0 h-full">
        <div className="p-6">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-900 text-white flex items-center justify-center font-black text-sm shadow-md shadow-emerald-800/20">
              ن
            </div>
            <div>
              <h2 className="text-emerald-950 font-black text-sm tracking-wide">منصة نواة</h2>
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
          <div className="flex items-center gap-3 text-xs font-bold text-slate-700 bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-black text-emerald-950">المساعد متصل</span>
              <span className="text-[10px] text-emerald-700 font-medium">Gemini 2.5 Active</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. CENTRAL WORKSPACE - LUXURY GREEN GRADIENT THEME */}
      <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-[#052e1f] via-[#042418] to-[#02140d] relative min-w-0 text-white">
        
        {/* Ambient Radial Lighting Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(16,185,129,0.15),transparent_70%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(5,150,105,0.08),transparent_50%)] pointer-events-none"></div>

        {/* Workspace Top Header Bar */}
        <header className="px-6 sm:px-8 py-3.5 border-b border-emerald-800/40 flex items-center justify-between shrink-0 bg-[#032015]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 border border-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Bot size={20} strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-white text-sm">مساعد نواة الذكي</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">AI Scientific Workspace</span>
              </div>
              <p className="text-[11px] text-emerald-200/70 font-medium">بيئة عمل لتحليل ومطابقة بيانات نوى التمر مع مسارات الاستفادة الصناعية المعتمدة.</p>
            </div>
          </div>
          {!isChatEmpty && (
            <button
              onClick={handleClearChat}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-200 hover:text-white px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-emerald-500/30 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>محادثة جديدة</span>
            </button>
          )}
        </header>
        
        {/* Workspace Main Chat Container */}
        <main ref={scrollContainerRef} className="flex-1 overflow-y-auto scroll-smooth p-4 sm:p-8 relative z-0">
          {isChatEmpty ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.97 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center justify-center h-full text-center max-w-3xl mx-auto py-4"
            >
              {/* Glowing Center Hero Icon */}
              <motion.div 
                animate={{ y: [0, -6, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-700 text-slate-950 flex items-center justify-center mb-6 shadow-[0_0_35px_rgba(16,185,129,0.4)] ring-4 ring-emerald-500/20 relative"
              >
                <Sparkles size={32} strokeWidth={2} className="text-white" />
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
                كيف يمكن لمساعد نواة دعم بحثك اليوم؟
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/80 mb-8 max-w-xl font-medium leading-relaxed">
                حلل بيانات الدفعات، استكشف مسارات الاستثمار الصناعي، وابحث في الأدلة والأوراق العلمية الموثقة.
              </p>
              
              {/* 2x2 LUXURY ACTION CARDS (Frosted Glass Emerald Theme) */}
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
                    prompt: 'قم بتحليل بيانات أحدث دفعة نوى تمر تم تسجيلها وما هي أبرز خصائصها؟'
                  },
                  {
                    title: 'استكشاف مسارات الاستثمار',
                    sub: 'مسارات الفحم الحيوي، الزيوت، والبدائل الصحية',
                    icon: FlaskConical,
                    prompt: 'ما هي مسارات الاستخدامات الصناعية المثلى لنوى التمر بناءً على البيانات؟'
                  },
                  {
                    title: 'البحث في الأدلة العلمية',
                    sub: 'استعراض الدراسات والأبحاث الموثقة حول النوى',
                    icon: BookOpen,
                    prompt: 'ابحث في الأدلة العلمية عن استخدام نوى التمر كبديل للقهوة الخالية من الكافيين.'
                  },
                  {
                    title: 'تقدير الأثر البيئي',
                    sub: 'احتساب خفض الانبعاثات ورفع كفاءة المياه',
                    icon: Leaf,
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
                    className="p-4 bg-white/[0.07] hover:bg-white/[0.12] border border-emerald-500/20 hover:border-emerald-400/60 rounded-2xl transition-all backdrop-blur-md shadow-lg hover:shadow-[0_8px_25px_rgba(16,185,129,0.15)] hover:-translate-y-0.5 group flex items-start gap-3.5 text-right"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-300 group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all">
                      <action.icon size={18} strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
                        {action.title}
                      </h4>
                      <p className="text-[11px] text-emerald-200/70 font-medium mt-0.5 leading-snug">
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
                    className={`flex items-start gap-3.5 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                      m.sender === 'user' 
                        ? 'bg-emerald-600 border-emerald-400/40 text-white shadow-md' 
                        : 'bg-emerald-950 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                    }`}>
                      {m.sender === 'user' ? <User size={18} strokeWidth={2} /> : <Bot size={18} strokeWidth={2} />}
                    </div>
                    <div className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[82%]`}>
                      <div className={`px-5 sm:px-6 py-4 rounded-3xl ${
                        m.sender === 'user'
                          ? 'bg-emerald-700/90 border border-emerald-500/40 text-white shadow-lg backdrop-blur-md'
                          : 'bg-white text-slate-900 border border-emerald-100 shadow-2xl'
                      }`}>
                        <div className="w-full break-words">
                          {renderFormattedText(m.text)}
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-300/60 mt-1.5 px-2 font-medium">
                        {m.timestamp}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                    <Bot size={18} strokeWidth={2} />
                  </div>
                  <div className="flex items-center gap-2 px-5 py-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-emerald-500/30 shadow-md">
                    <motion.span animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-2 h-2 bg-emerald-400 rounded-full" />
                    <motion.span animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-2 h-2 bg-emerald-400 rounded-full" />
                    <motion.span animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-2 h-2 bg-emerald-400 rounded-full" />
                    <span className="text-xs font-bold text-emerald-200 mr-2">جاري المعالجة وتحليل البيانات...</span>
                  </div>
                </motion.div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-200 text-center font-bold">
                  {errorMsg}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Workspace Footer (Input Bar) */}
        <footer className="p-4 sm:p-6 shrink-0 border-t border-emerald-800/40 bg-[#031d13]/90 backdrop-blur-xl z-10">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="max-w-3xl mx-auto flex items-end gap-3 bg-white/[0.08] border border-emerald-500/30 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:shadow-[0_0_30px_rgba(16,185,129,0.2)] rounded-2xl p-2.5 transition-all duration-300 shadow-xl backdrop-blur-md"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="اكتب استفسارك عن بيانات الدفعات، مسارات الاستفادة الصناعية، أو الأبحاث الموثقة..."
              className="flex-1 bg-transparent border-none outline-none text-white px-4 py-3 text-xs sm:text-sm resize-none max-h-32 min-h-[48px] placeholder:text-emerald-200/50 disabled:opacity-50 font-medium"
              rows={1}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 disabled:bg-white/10 disabled:text-emerald-400/40 text-white w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all focus:outline-none shadow-lg shadow-emerald-900/40"
            >
              <Send className="w-5 h-5 rtl:-translate-x-0.5" strokeWidth={2} />
            </button>
          </form>
        </footer>
      </div>

      {/* 3. LEFT CONTEXT PANEL WITH DYNAMIC INTERACTIVE ORBIT */}
      <aside className="hidden lg:flex w-80 flex-col border-r border-stone-200/80 bg-white/90 backdrop-blur-xl shrink-0 h-full p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-slate-800 text-xs tracking-wider flex items-center gap-2 uppercase">
            <Activity size={14} className="text-emerald-600" /> سياق نواة العلمي
          </h3>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
            مدار تفاعلي
          </span>
        </div>
        
        {/* INTERACTIVE CIRCULAR ORBIT WIDGET */}
        <div className="relative w-52 h-52 mx-auto mb-6 flex items-center justify-center select-none">
          
          {/* Ambient Glow */}
          <div className="absolute inset-4 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>

          {/* Continuous Rotating Dashed Track */}
          <motion.svg 
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute inset-1 pointer-events-none origin-center" 
            viewBox="-65 -65 130 130"
          >
            <circle cx="0" cy="0" r="52" fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="5 5" />
          </motion.svg>

          {/* Directional Flow Arrows on the Track */}
          <svg className="absolute inset-1 pointer-events-none" viewBox="-65 -65 130 130">
            {[-60, 0, 60, 120, 180, 240].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 52 * Math.cos(rad);
              const y = 52 * Math.sin(rad);
              return (
                <g key={i} transform={`translate(${x}, ${y}) rotate(${angle + 90})`} opacity="0.8">
                  <path d="M-3,3 L0,0 L3,3" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              );
            })}
          </svg>
          
          {/* Center Interactive Node */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSend(activeNode.prompt)}
            className="w-14 h-14 bg-gradient-to-tr from-emerald-900 to-emerald-700 border-2 border-emerald-400 text-white rounded-full flex flex-col items-center justify-center z-10 shadow-lg shadow-emerald-900/30 relative group cursor-pointer"
          >
            <Bot className="w-6 h-6 text-emerald-300 group-hover:scale-110 transition-transform" strokeWidth={2} />
            <span className="text-[8px] font-black text-emerald-200 mt-0.5">{activeNode.step}</span>
          </motion.button>

          {/* Orbital Nodes along circle */}
          {SCIENTIFIC_FLOW.map((node, i) => {
            const angle = (i * 60) - 90;
            const isActive = activeNodeId === node.id;
            return (
              <div key={node.id} className="absolute inset-1 pointer-events-none" style={{ transform: `rotate(${angle}deg)` }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                  
                  {isActive && (
                    <motion.div 
                      layoutId="activeOrbitGlow"
                      className="absolute inset-0 bg-emerald-500 rounded-full blur-md opacity-60 animate-pulse"
                    />
                  )}
                  
                  <motion.button 
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveNodeId(node.id)}
                    title={`${node.step} - ${node.label}`}
                    className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? 'bg-emerald-900 text-white shadow-xl shadow-emerald-900/40 scale-125 ring-2 ring-emerald-400' 
                        : 'bg-white text-slate-600 border border-stone-300 hover:border-emerald-500 hover:text-emerald-800 hover:bg-emerald-50 shadow-sm'
                    }`} 
                    style={{ transform: `rotate(${-angle}deg)` }}
                  >
                    <node.icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Context Card based on active orbital node */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNodeId}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: 0.2 }}
            className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col gap-3.5 relative overflow-hidden"
          >
            {/* Top Badge & Title */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-emerald-950 font-black text-sm">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/80 flex items-center justify-center text-emerald-800">
                  <activeNode.icon size={16} strokeWidth={2} />
                </div>
                <span>{activeNode.label}</span>
              </div>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                المرحلة {activeNode.step}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {activeNode.desc}
            </p>
            
            {/* Context Data Metrics */}
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex justify-between items-center bg-stone-50 hover:bg-stone-100/80 transition-colors px-3 py-2.5 rounded-xl border border-stone-100 text-[11px] font-bold">
                <span className="text-slate-600">المؤشرات المتاحة</span>
                <span className="text-emerald-900 bg-emerald-100/80 px-2.5 py-0.5 rounded-md">{activeNode.stats.count}</span>
              </div>
              <div className="flex justify-between items-center bg-stone-50 hover:bg-stone-100/80 transition-colors px-3 py-2.5 rounded-xl border border-stone-100 text-[11px] font-bold">
                <span className="text-slate-600">حالة المسار</span>
                <span className="text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  {activeNode.stats.active}
                </span>
              </div>
            </div>
            
            {/* Quick Action Trigger */}
            <button 
              onClick={() => handleSend(activeNode.prompt)}
              className="mt-2 text-xs font-bold text-white bg-emerald-900 hover:bg-emerald-800 px-4 py-3 rounded-xl transition-all hover:shadow-md hover:shadow-emerald-900/20 w-full flex items-center justify-center gap-2"
            >
              <span>تحليل هذا المحور عبر المساعد</span>
              <ArrowRight size={14} className="rtl:rotate-180" />
            </button>
          </motion.div>
        </AnimatePresence>
      </aside>

    </div>
  );
}
