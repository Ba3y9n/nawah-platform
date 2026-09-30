"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Send, User, RefreshCw, 
  Database, Activity, LineChart, BookOpen, FlaskConical, Leaf,
  Home, Target, CheckCircle, Server, Search
} from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const ANALYSIS_PATHWAYS = [
  "تحليل المورد",
  "المعرفة العلمية",
  "الاستخدامات التطبيقية",
  "الأثر والاستدامة"
];

const EXPLORE_CARDS = [
  {
    title: 'تحليل أحدث الدفعات',
    desc: 'تحليل خصائص الدفعات المسجلة، ومقارنة الكميات والمواصفات ومؤشرات الجودة لاستخراج الأنماط والفرص ذات الصلة.',
    icon: Database,
    prompt: 'قم بتحليل أحدث الدفعات المسجلة واستخراج الأنماط ومؤشرات الجودة المتعلقة بها.'
  },
  {
    title: 'البحث في الأدلة العلمية',
    desc: 'استكشاف الدراسات والأبحاث المرتبطة بنوى التمر، وربط المعرفة العلمية بالخصائص والاستخدامات المحتملة للمورد.',
    icon: BookOpen,
    prompt: 'ابحث في الأدلة العلمية والدراسات المرتبطة بخصائص نوى التمر واستخداماتها المحتملة.'
  },
  {
    title: 'استكشاف مسارات الاستخدام',
    desc: 'مقارنة مسارات الاستفادة الصناعية والزراعية للمورد، وتحديد الاستخدامات التي تتوافق مع خصائص الدفعة والبيانات المتاحة.',
    icon: FlaskConical,
    prompt: 'ما هي مسارات الاستخدام الصناعية والزراعية التي تتوافق مع بيانات الدفعات الحالية؟'
  },
  {
    title: 'تقييم الأثر البيئي',
    desc: 'تحليل الأثر المحتمل لإعادة استخدام المورد، بما يشمل تقليل الهدر ودعم كفاءة الموارد وتطبيقات الاقتصاد الدائري.',
    icon: Leaf,
    prompt: 'قم بتقييم الأثر البيئي لاستخدام نوى التمر وفوائده في دعم كفاءة الموارد والاقتصاد الدائري.'
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
        <h4 key={lineIdx} className="font-bold text-sm mt-4 mb-2 text-slate-900">
          {trimmed.replace(/^###\s+/, "")}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h3 key={lineIdx} className="font-bold text-base mt-5 mb-3 text-emerald-800 border-b border-stone-200 pb-2">
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
          <div key={lineIdx} className="flex flex-col sm:flex-row sm:items-baseline gap-2 my-2 p-3 bg-stone-50 rounded-lg border border-stone-200/60 text-sm">
            <span className="font-bold text-emerald-800 shrink-0">{key.replace(/\*\*/g, '')}:</span>
            <span className="text-slate-700 leading-relaxed">{val.replace(/\*\*/g, '')}</span>
          </div>
        );
      } else {
        elements.push(
          <div key={lineIdx} className="flex items-start gap-2.5 my-1.5 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
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
      <p key={lineIdx} className="my-2 text-slate-700 leading-relaxed text-sm">
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
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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
      const replyText = data.reply || 'تم استلام استفسارك وتأكيده. جاري معالجة البيانات وإعداد التقرير المطلوب.';

      const assistantReply: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantReply]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("حدث خطأ في النظام أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePathwayClick = (pathway: string) => {
    setInput(`أريد معلومات حول ${pathway} بناءً على بيانات المورد المتاحة.`);
  };

  return (
    <div className="h-[calc(100vh-80px)] w-full flex flex-row bg-[#FAFAFA] overflow-hidden font-sans text-slate-800" dir="rtl">
      
      {/* 1. RIGHT SIDEBAR */}
      <aside className="hidden md:flex w-64 flex-col border-l border-stone-200 bg-white shrink-0 h-full z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              ن
            </div>
            <div>
              <h2 className="text-slate-900 font-bold text-sm tracking-wide">منصة نواة</h2>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block mt-0.5">Scientific Platform</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            <Link href="/pit-management/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 text-sm text-slate-600 hover:text-emerald-700 hover:bg-stone-50 rounded-lg transition-colors font-medium">
              <Home size={18} strokeWidth={1.5} className="text-slate-400" /> 
              <span>لوحة التحكم</span>
            </Link>
            
            <div className="my-4 border-b border-stone-100" />
            
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">أدوات التحليل</span>
            
            <button className="flex items-center justify-between px-3.5 py-2.5 text-sm rounded-lg transition-colors font-bold bg-emerald-50 text-emerald-800">
              <div className="flex items-center gap-3">
                <Bot size={18} strokeWidth={1.5} className="text-emerald-600" />
                <span>مساعد نواة</span>
              </div>
            </button>

            <button className="flex items-center justify-between px-3.5 py-2.5 text-sm rounded-lg transition-colors font-medium text-slate-600 hover:bg-stone-50 hover:text-slate-900">
              <div className="flex items-center gap-3">
                <Database size={18} strokeWidth={1.5} className="text-slate-400" />
                <span>قاعدة البيانات</span>
              </div>
            </button>

            <button className="flex items-center justify-between px-3.5 py-2.5 text-sm rounded-lg transition-colors font-medium text-slate-600 hover:bg-stone-50 hover:text-slate-900">
              <div className="flex items-center gap-3">
                <Activity size={18} strokeWidth={1.5} className="text-slate-400" />
                <span>التقارير العلمية</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-stone-100">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <div className="w-8 h-8 bg-stone-50 rounded-lg flex items-center justify-center shrink-0 border border-stone-200">
              <Server size={16} className="text-emerald-600" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900">النظام متصل</span>
              <span className="text-[10px] text-emerald-600 font-medium">البيانات متزامنة</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. CENTRAL WORKSPACE */}
      <div className="flex-1 flex flex-col h-full bg-white relative min-w-0">
        
        {/* Top Header */}
        <header className="px-8 py-5 border-b border-stone-200 bg-white flex items-center justify-between shrink-0 z-10">
          <div className="flex flex-col">
            <h1 className="font-bold text-slate-900 text-lg mb-1">مساعد نواة</h1>
            <p className="text-sm text-slate-500 font-medium">محرك المعرفة والتحليل لاتخاذ القرار</p>
          </div>
          
          {!isChatEmpty && (
            <button
              onClick={handleClearChat}
              className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-stone-50 transition-colors border border-stone-200 bg-white shadow-sm"
            >
              <RefreshCw className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
              <span>تهيئة جلسة جديدة</span>
            </button>
          )}
        </header>
        
        {/* Main Content Area */}
        <main ref={scrollContainerRef} className="flex-1 overflow-y-auto p-8 relative z-0 bg-[#FAFAFA]">
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            
            {isChatEmpty && (
              <div className="flex flex-col gap-8">
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col">
                  <h2 className="text-base font-bold text-slate-900 mb-2">منصة الذكاء العلمي لنواة</h2>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                    اسأل عن دفعات نوى التمر، استكشف الأدلة العلمية، حلّل فرص الاستخدام والاستثمار، واربط البيانات المتاحة بالمسارات التطبيقية المناسبة.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-slate-800">ماذا تريد أن تستكشف؟</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {EXPLORE_CARDS.map((card, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(card.prompt)}
                        className="p-5 bg-white border border-stone-200 rounded-xl hover:border-emerald-500 hover:shadow-sm transition-all flex flex-col h-full text-right"
                      >
                        <div className="w-10 h-10 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center text-slate-600 mb-4">
                          <card.icon size={20} strokeWidth={1.5} />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mb-2">
                          {card.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mt-auto">
                          {card.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {!isChatEmpty && (
              <div className="flex flex-col gap-6">
                <AnimatePresence initial={false}>
                  {messages.map((m) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={m.id} 
                      className={`flex items-start gap-4 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                        m.sender === 'user' 
                          ? 'bg-slate-900 border-slate-800 text-white' 
                          : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                      }`}>
                        {m.sender === 'user' ? <User size={20} strokeWidth={1.5} /> : <Bot size={20} strokeWidth={1.5} />}
                      </div>
                      
                      <div className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                        <div className={`px-5 py-4 rounded-xl text-sm ${
                          m.sender === 'user'
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-white border border-stone-200 text-slate-800 shadow-sm'
                        }`}>
                          <div className="w-full break-words">
                            {m.sender === 'user' ? m.text : renderFormattedText(m.text)}
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1.5 px-1 font-medium">
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
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Bot size={20} strokeWidth={1.5} />
                    </div>
                    <div className="flex items-center gap-2 px-5 py-4 bg-white rounded-xl border border-stone-200 shadow-sm">
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0 }} className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-xs font-bold text-slate-500 mr-3">جاري تحليل البيانات...</span>
                    </div>
                  </motion.div>
                )}

                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
                    {errorMsg}
                  </div>
                )}
              </div>
            )}

            {/* Professional Search/Input Block */}
            <div className="mt-8 flex flex-col bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-stone-100 bg-stone-50/50">
                <h3 className="text-sm font-bold text-slate-900">اسأل مساعد نواة</h3>
                <p className="text-xs text-slate-500 mt-1">اكتب سؤالك حول الدفعات، التحليلات، الأدلة العلمية، مسارات الاستخدام أو الأثر البيئي، وسيقوم المساعد بتحليل البيانات المتاحة وتقديم إجابة موثقة قدر الإمكان.</p>
              </div>
              
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">مسارات التحليل:</span>
                  <div className="flex flex-wrap gap-2">
                    {ANALYSIS_PATHWAYS.map((pathway, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePathwayClick(pathway)}
                        className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        {pathway}
                      </button>
                    ))}
                  </div>
                </div>
                
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <div className="flex-1 relative">
                    <Search className="absolute right-4 top-3.5 text-slate-400" size={18} strokeWidth={1.5} />
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={loading}
                      placeholder="اكتب استفسارك حول بيانات المورد أو التحليل العلمي أو مسارات الاستخدام..."
                      className="w-full bg-stone-50 border border-stone-200 outline-none text-slate-900 pl-4 pr-12 py-3 rounded-lg text-sm resize-none h-12 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 font-medium transition-all"
                      rows={1}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-100 disabled:text-stone-400 disabled:border-stone-200 border border-transparent text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 shrink-0 transition-colors font-bold text-sm"
                  >
                    <span>إرسال الاستفسار</span>
                    <Send size={16} strokeWidth={2} className="rtl:-scale-x-100" />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* 3. LEFT CONTEXT PANEL (سياق التحليل) */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-stone-200 bg-white shrink-0 h-full">
        <div className="p-6 border-b border-stone-100">
          <h3 className="font-bold text-slate-900 text-sm">سياق التحليل</h3>
          <p className="text-xs text-slate-500 mt-1">محددات البيانات للوحة الحالية</p>
        </div>
        
        <div className="p-6 flex flex-col gap-4 overflow-y-auto">
          
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-slate-400">المرحلة الحالية</span>
            <span className="text-sm font-bold text-slate-800">تحليل بيانات المورد</span>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-slate-400">الدفعات المرتبطة</span>
            <span className="text-sm font-bold text-slate-800">03 دفعات مسجلة</span>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-slate-400">المصادر المتاحة</span>
            <span className="text-sm font-bold text-slate-800">07 مصادر علمية</span>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-slate-400">حالة البيانات</span>
            <span className="text-sm font-bold text-emerald-700">جاهزة للتحليل</span>
          </div>

          <button 
            onClick={() => handleSend("قم بتحليل سياق البيانات المتاحة للمورد، متضمنة الدفعات الـ 3 والمصادر الـ 7، لاستخلاص التوصيات الأولية.")}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold text-sm transition-colors mt-2"
          >
            تحليل السياق
          </button>
          
        </div>
      </aside>

    </div>
  );
}
