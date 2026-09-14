"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Loader2, MessageSquare, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "مرحبًا بك في مساعد نواة.\nكيف أقدر أساعدك في استكشاف نوى التمر، الاستخدامات المحتملة، التجارب، والأدلة؟"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Global Event Listener to open chat panel from anywhere in the platform (e.g. assistant page CTA, navbar, homepage)
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("nawah:open-chat", handleOpenChat);
    return () => window.removeEventListener("nawah:open-chat", handleOpenChat);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to history
    const updatedMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const formattedHistory = updatedMessages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: formattedHistory }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: "ai", content: "عذراً، تعذر الاتصال بمساعد نواة حالياً. يرجى المحاولة بعد قليل." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button (Always fixed at bottom-right, clean, small circular button) */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(true)}
          aria-label="مساعد نواة"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-emerald-700 text-white rounded-full shadow-2xl hover:bg-emerald-800 transition-all border-2 border-white ring-4 ring-emerald-950/10 focus:outline-none"
          style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))", right: "calc(1.5rem + env(safe-area-inset-right, 0px))" }}
        >
          <Bot className="w-7 h-7 text-amber-300" />
        </motion.button>
      )}

      {/* Main Official Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[380px] h-[88vh] sm:h-[560px] max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-50 flex flex-col border border-slate-200 overflow-hidden font-sans"
            style={{ 
              bottom: "calc(0px + env(safe-area-inset-bottom, 0px))",
              right: "calc(0px + env(safe-area-inset-right, 0px))"
            }}
          >
            {/* Header */}
            <div className="bg-emerald-950 px-5 py-4 flex items-center justify-between text-white border-b border-emerald-900/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                  <Bot className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white tracking-wide">مساعد نواة</h3>
                  <p className="text-[11px] text-emerald-200/80 font-medium">مساعد ذكي لاستكشاف نوى التمر</p>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)} 
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-emerald-100 flex items-center justify-center transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-emerald-700 text-white rounded-br-none shadow-md font-bold' 
                      : 'bg-white text-emerald-950 border border-slate-200/80 rounded-bl-none shadow-sm font-medium whitespace-pre-wrap'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex items-center gap-2 text-emerald-800 text-xs font-bold">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                    <span>مساعد نواة يفكر...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Area */}
            <div className="p-3.5 bg-white border-t border-slate-100 shrink-0">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اكتب سؤالك هنا..."
                  disabled={isLoading}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 bg-emerald-700 text-white rounded-2xl flex items-center justify-center shrink-0 disabled:opacity-40 transition-all hover:bg-emerald-800 shadow-sm"
                  aria-label="إرسال"
                >
                  <Send className="w-4 h-4 rtl:-scale-x-100" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
