"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ScanLine, ArrowLeft, RefreshCw, Wrench, HeartHandshake, Leaf, Camera, Cpu, GitCompare, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

const AnimatedNumber = ({ value, suffix = "" }: { value: number, suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}{suffix}</span>;
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] flex items-center overflow-hidden">
        {/* Background Image with Parallax & Cinematic Overlay */}
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <Image src="/hero.jpg" alt="THAMAR AI Hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-dark/90 via-secondary-dark/70 to-transparent z-10" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-20 flex flex-col lg:flex-row items-center gap-12 pt-20">
          <div className="flex-1 text-white">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl lg:text-7xl font-bold mb-6 leading-[1.2]"
            >
              قبل أن ترميه... <br />
              <span className="text-gold">دع الذكاء يعرف قيمته</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl lg:text-2xl text-gray-200 mb-2 font-medium"
            >
              Before you waste it... Let AI discover its value
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg text-gray-300 mb-10 max-w-2xl leading-relaxed"
            >
              حل ذكي لتحليل المنتجات الغذائية وتحديد أفضل مسار دائري لها باستخدام الذكاء الاصطناعي، للحفاظ على القيمة وتقليل الهدر.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/scanner" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-2 shadow-lg shadow-primary/30 hover:scale-105">
                <ScanLine className="w-5 h-5" />
                افحص منتجك الآن
              </Link>
              <Link href="#how-it-works" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-2 hover:scale-105">
                تعرف على الطريقة
              </Link>
            </motion.div>
          </div>

          {/* Interactive Circular Element */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex-1 hidden lg:flex justify-center items-center"
          >
            <div className="relative w-[400px] h-[400px] rounded-full border border-white/20 flex items-center justify-center group">
              <div className="absolute inset-0 rounded-full border border-gold/30 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-primary/40 animate-[spin_15s_linear_infinite_reverse]" />
              
              <div className="text-center z-10 glass-dark p-8 rounded-full w-48 h-48 flex items-center justify-center shadow-2xl">
                <Leaf className="w-16 h-16 text-gold mb-2 mx-auto absolute opacity-20" />
                <h3 className="text-2xl font-bold text-white relative">المسار<br/>الدائري</h3>
              </div>

              {/* Floating Options */}
              <div className="absolute top-0 -translate-y-1/2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-bold group-hover:-translate-y-6 transition-transform flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-primary" /> إعادة الاستخدام
              </div>
              <div className="absolute bottom-0 translate-y-1/2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-bold group-hover:translate-y-6 transition-transform flex items-center gap-2">
                <RecycleIcon className="w-4 h-4 text-primary" /> التدوير
              </div>
              <div className="absolute right-0 translate-x-1/2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-bold group-hover:translate-x-6 transition-transform flex items-center gap-2">
                <Wrench className="w-4 h-4 text-gold" /> الإصلاح
              </div>
              <div className="absolute left-0 -translate-x-1/2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-bold group-hover:-translate-x-6 transition-transform flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-gold" /> التبرع
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">الآلية</h2>
            <h3 className="text-4xl font-bold text-secondary">كيف يعمل THAMAR AI</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "01", title: "صوّر المنتج", icon: <Camera className="w-8 h-8" /> },
              { num: "02", title: "يحلله الذكاء الاصطناعي", icon: <Cpu className="w-8 h-8" /> },
              { num: "03", title: "يقارن المسارات الدائرية", icon: <GitCompare className="w-8 h-8" /> },
              { num: "04", title: "تحصل على أفضل قرار", icon: <CheckCircle2 className="w-8 h-8" /> },
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all group"
              >
                <div className="text-6xl font-black text-gray-100 mb-6 group-hover:text-gold/10 transition-colors">{step.num}</div>
                <div className="text-primary mb-6 bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">{step.icon}</div>
                <h4 className="text-xl font-bold text-secondary">{step.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">التحليل</h2>
              <h3 className="text-4xl font-bold text-secondary">أمثلة للمسارات الدائرية</h3>
            </div>
            <Link href="/scanner" className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors">
              ابدأ فحص منتجاتك <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "طماطم عضوية", score: 95, path: "تغليف حيوي ثمر", img: "🍅" },
              { name: "عبوات PET", score: 88, path: "إعادة تدوير (درجة أولى)", img: "💧" },
              { name: "أجهزة إلكترونية", score: 94, path: "إعادة استخدام / إصلاح", img: "💻" },
            ].map((prod, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center text-7xl">
                  {prod.img}
                </div>
                <div className="p-8">
                  <h4 className="text-2xl font-bold text-secondary mb-4">{prod.name}</h4>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">درجة الاستدامة</p>
                      <p className="text-xl font-bold text-primary">{prod.score}<span className="text-sm text-gray-400">/100</span></p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-500 mb-1">أفضل مسار دائري</p>
                      <p className="font-bold text-secondary">{prod.path}</p>
                    </div>
                  </div>
                  <button className="w-full py-4 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors">
                    عرض المسار البيئي
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-secondary-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-sm font-bold text-gold tracking-widest uppercase mb-2">الأثر</h2>
          <h3 className="text-4xl font-bold text-white mb-16">نصنع أثراً مستداماً للأجيال</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-6xl md:text-8xl font-black text-gold mb-4 font-mono">
                <AnimatedNumber value={80} suffix="%" />
              </div>
              <p className="text-xl text-gray-300 font-medium">الحفاظ على القيمة</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-6xl md:text-8xl font-black text-primary mb-4 font-mono">
                <AnimatedNumber value={12} suffix="K+" />
              </div>
              <p className="text-xl text-gray-300 font-medium">منتج تم إنقاذه</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-6xl md:text-8xl font-black text-gold mb-4 font-mono">
                <AnimatedNumber value={18.5} />
              </div>
              <p className="text-xl text-gray-300 font-medium">kgCO2 أثر مناخي تم تجنبه</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Temporary icon to avoid undefined error
const RecycleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 15.3l-3-3 3-3"/><path d="M4 12.3h10a5 5 0 0 1 5 5v3"/><path d="M17 8.7l3 3-3 3"/><path d="M20 11.7H10a5 5 0 0 1-5-5v-3"/></svg>
);
