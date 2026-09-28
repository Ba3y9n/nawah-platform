"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bot, X, Send, Sparkles, User, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatWidget() {
  const pathname = usePathname();
  if (pathname === "/assistant") return null;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "مرحباً بك! أنا مساعد نواة الذكي 🌴 كيف أستطيع إرشادك في إدارة نوى التمر أو مسارات الاستفادة والأثر البيئي؟" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    const updated = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(updated);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage, 
          history: updated 
        }),
      });

      if (!response.ok) throw new Error("Network error");
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || "تم استلام استفسارك." }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "عذراً، تعذر الاتصال حالياً. يرجى المحاولة بعد قليل." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-full p-4 shadow-xl shadow-emerald-900/20 flex items-center gap-2 border border-emerald-600/40 cursor-pointer group"
              aria-label="افتح مساعد نواة الذكي"
            >
              <div className="relative">
                <Bot className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-emerald-700 animate-pulse"></span>
              </div>
              <span className="hidden sm:inline text-xs font-bold pl-1">مساعد نواة</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 left-6 w-[calc(100vw-3rem)] sm:w-[380px] h-[520px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col border border-slate-200 overflow-hidden"
            dir="rtl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                  <Bot className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">مساعد نواة الذكي</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>متصل الآن</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-2 text-xs ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.role === 'user' 
                      ? 'bg-emerald-700 text-white' 
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-emerald-700 text-white rounded-tr-none shadow-xs font-medium' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs whitespace-pre-line'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 text-emerald-800 text-xs w-max animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span>جاري الرد...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-slate-100">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  placeholder="اسأل عن الدفعات أو مسارات النوى..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4 rtl:rotate-180" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
