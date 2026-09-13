const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf-8');

const featuresComp = `
function InteractiveFeatures() {
  const [active, setActive] = useState(0);
  
  const features = [
    { 
      num: "01", title: "إدارة الدفعات", icon: Database,
      desc: "تسجيل وتتبع دفعات نوى التمر وربطها ببيانات المصدر والكمية والحالة وطرق التخزين والمعالجة لتكوين سجل رقمي موثوق وقابل للتتبع.", 
      visual: (
        <div className="flex flex-col gap-3 w-full max-w-[220px]">
          {[1,2,3].map(i => (
             <div key={i} className={\`h-14 rounded-xl border flex items-center px-4 gap-4 transition-all duration-500 \${i===1 ? 'bg-emerald-500 border-emerald-400 shadow-[0_10px_30px_rgba(16,185,129,0.3)] scale-110' : 'bg-white border-slate-100 opacity-60'}\`}>
               <div className={\`w-2.5 h-2.5 rounded-full shrink-0 \${i===1 ? 'bg-amber-300' : 'bg-slate-200'}\`} />
               <div className="flex-1 space-y-2">
                 <div className={\`h-1.5 rounded-full w-full \${i===1 ? 'bg-white/40' : 'bg-slate-100'}\`} />
                 <div className={\`h-1.5 rounded-full w-2/3 \${i===1 ? 'bg-white/20' : 'bg-slate-50'}\`} />
               </div>
             </div>
          ))}
        </div>
      )
    },
    { 
      num: "02", title: "الذكاء الاصطناعي", icon: BrainCircuit,
      desc: "تحليل وتوقع الفرص والمسارات باستخدام نماذج الذكاء الاصطناعي لاكتشاف أفضل الاستخدامات.", 
      visual: (
        <div className="relative w-48 h-48 flex items-center justify-center">
           <div className="absolute inset-0 border border-emerald-500/20 rounded-full animate-[spin_10s_linear_infinite] border-dashed" />
           <div className="absolute inset-6 border border-emerald-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse] border-dotted" />
           <div className="w-20 h-20 bg-emerald-500 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.5)] flex items-center justify-center relative z-10 border-4 border-white">
              <BrainCircuit className="w-8 h-8 text-white" />
           </div>
           {/* Pulsing nodes */}
           <div className="absolute top-2 right-1/4 w-3.5 h-3.5 bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.8)] animate-pulse" />
           <div className="absolute bottom-6 left-6 w-4 h-4 bg-emerald-300 rounded-full shadow-[0_0_15px_rgba(110,231,183,0.8)] animate-pulse" />
        </div>
      )
    },
    { 
      num: "03", title: "قاعدة الأدلة", icon: BookOpen,
      desc: "مكتبة الأبحاث العلمية الموثقة التي تدعم مسارات الاستخدام المحتملة وتميز بين ما هو مثبت وما يحتاج للتحقق.", 
      visual: (
        <div className="flex gap-4 w-full max-w-[280px]">
           <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="h-2 bg-slate-100 rounded-full w-full" />
              <div className="h-2 bg-slate-100 rounded-full w-5/6" />
              <div className="h-2 bg-slate-50 rounded-full w-4/6" />
           </div>
           <div className="flex-1 bg-emerald-500 rounded-2xl p-5 shadow-xl scale-110 origin-left space-y-4 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-6 border border-white/30">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div className="h-2 bg-white/40 rounded-full w-full" />
              <div className="h-2 bg-white/30 rounded-full w-5/6" />
              <div className="h-2 bg-white/20 rounded-full w-4/6" />
           </div>
        </div>
      )
    },
    { 
      num: "04", title: "إدارة التجارب", icon: TestTube2,
      desc: "توثيق نتائج المعالجة المخبرية وربطها بالدفعات لضمان تتبع جودة التجارب وسهولة العودة لها.", 
      visual: (
        <div className="flex items-end justify-center gap-4 h-40">
           <div className="w-12 h-full bg-white border border-slate-100 rounded-full p-2 flex flex-col justify-end relative overflow-hidden shadow-sm">
             <motion.div animate={{ height: ["40%", "80%", "40%"] }} transition={{ duration: 4, repeat: Infinity }} className="w-full bg-slate-100 rounded-full" />
           </div>
           <div className="w-14 h-full bg-emerald-500 rounded-full p-2 flex flex-col justify-end shadow-[0_0_30px_rgba(16,185,129,0.3)] relative overflow-hidden">
             <motion.div animate={{ height: ["20%", "90%", "20%"] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} className="w-full bg-white/95 rounded-full shadow-inner relative">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-100 rounded-full blur-[1px]" />
             </motion.div>
           </div>
           <div className="w-12 h-full bg-white border border-slate-100 rounded-full p-2 flex flex-col justify-end relative overflow-hidden shadow-sm">
             <motion.div animate={{ height: ["60%", "30%", "60%"] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="w-full bg-amber-400 rounded-full" />
           </div>
        </div>
      )
    },
    { 
      num: "05", title: "الخريطة الذكية", icon: Map,
      desc: "توزيع المصادر والمصانع جغرافياً لتسهيل فهم وتتبع مسارات الإمداد وتوضيح العلاقة بين المنتج والمصدر.", 
      visual: (
        <div className="relative w-56 h-56 bg-slate-50 border border-slate-100 rounded-[2rem] overflow-hidden flex items-center justify-center shadow-inner">
           <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
           
           <div className="relative z-10">
             <div className="w-6 h-6 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,1)] relative z-20 border-2 border-white" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-emerald-500/50 rounded-full animate-ping" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-emerald-500/20 rounded-full animate-[ping_2s_infinite_0.5s]" />
           </div>
           
           <div className="absolute top-10 right-12 w-4 h-4 bg-amber-400 rounded-full shadow-md border-2 border-white" />
           <div className="absolute bottom-12 left-12 w-5 h-5 bg-emerald-600 rounded-full shadow-md border-2 border-white" />
        </div>
      )
    },
    { 
      num: "06", title: "لوحة البيانات", icon: LayoutDashboard,
      desc: "مؤشرات أداء وتحليلات فورية توفر رؤية شاملة للمنظومة وتدعم اتخاذ قرارات مبنية على بيانات دقيقة.", 
      visual: (
        <div className="w-64 grid grid-cols-2 gap-4">
           <div className="col-span-2 bg-emerald-500 rounded-3xl h-28 p-5 relative overflow-hidden shadow-[0_10px_30px_rgba(16,185,129,0.3)]">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.15)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]" />
              <div className="w-10 h-10 rounded-full bg-white/20 mb-4" />
              <div className="h-2 w-1/2 bg-white/50 rounded-full mb-2" />
              <div className="h-2 w-1/3 bg-white/30 rounded-full" />
           </div>
           <div className="bg-white border border-slate-100 rounded-2xl h-24 p-4 flex flex-col justify-end gap-2 shadow-sm">
              <div className="h-10 bg-emerald-50 rounded-lg w-full" />
              <div className="h-2 bg-slate-100 rounded-full w-2/3" />
           </div>
           <div className="bg-white border border-slate-100 rounded-2xl h-24 p-4 flex flex-col items-center justify-center shadow-sm">
              <div className="w-12 h-12 border-[5px] border-emerald-500 border-r-amber-400 rounded-full" />
           </div>
        </div>
      )
    },
    { 
      num: "07", title: "قياس الأثر", icon: LineChart,
      desc: "تتبع العوائد البيئية والاقتصادية لمسارات معالجة وإعادة استخدام نوى التمر وتحويلها من مخلف إلى مورد.", 
      visual: (
        <div className="w-64 h-48 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-md flex flex-col justify-end relative">
           <div className="absolute top-6 right-6 h-2 w-16 bg-slate-100 rounded-full" />
           <div className="flex items-end justify-between h-24 w-full gap-2">
             <div className="w-full bg-emerald-50 rounded-t-lg h-[20%] transition-all duration-1000 hover:h-[30%]" />
             <div className="w-full bg-emerald-100 rounded-t-lg h-[40%] transition-all duration-1000 hover:h-[50%]" />
             <div className="w-full bg-emerald-200 rounded-t-lg h-[60%] transition-all duration-1000 hover:h-[70%]" />
             <div className="w-full bg-emerald-400 rounded-t-lg h-[80%] transition-all duration-1000 relative hover:h-[90%] group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_15px_#fbbf24]" />
             </div>
             <div className="w-full bg-emerald-600 rounded-t-lg h-[100%] shadow-[0_0_20px_rgba(5,150,105,0.3)]" />
           </div>
        </div>
      )
    },
    { 
      num: "08", title: "التتبع", icon: QrCode,
      desc: "مسح سريع لمعلومات الشحنات والدفعات لضمان موثوقية وسرعة تدفق البيانات في أي مرحلة من السلسلة.", 
      visual: (
        <div className="relative w-48 h-48 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-center shadow-lg">
           <div className="absolute inset-5 border-2 border-emerald-500/20 rounded-2xl" />
           {/* Scanning line */}
           <motion.div animate={{ top: ["15%", "85%", "15%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute left-4 right-4 h-1 bg-emerald-500 shadow-[0_0_20px_#10b981] z-20 rounded-full" />
           
           <div className="grid grid-cols-2 gap-3 opacity-20">
              <div className="w-8 h-8 bg-slate-800 rounded-lg" />
              <div className="w-8 h-8 bg-slate-800 rounded-lg" />
              <div className="w-8 h-8 bg-slate-800 rounded-lg" />
              <div className="w-8 h-8 bg-emerald-600 rounded-lg" />
           </div>
        </div>
      )
    }
  ];

  return (
    <div className="w-full flex flex-col gap-10 py-6 overflow-hidden">
      
      {/* Active Feature Large Panel */}
      <div className="w-full bg-white border border-slate-100 rounded-[2.5rem] p-8 lg:p-14 overflow-hidden relative shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-24"
          >
             {/* Visual Side */}
             <div className="w-full lg:w-1/2 flex justify-center items-center h-64 lg:h-80 relative bg-slate-50 rounded-[2rem] border border-slate-100">
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-[2rem]" />
               {features[active].visual}
             </div>

             {/* Content Side */}
             <div className="w-full lg:w-1/2 space-y-6">
               <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 bg-emerald-50 shadow-sm rounded-2xl flex items-center justify-center shrink-0 text-emerald-600">
                    {(() => {
                      const Icon = features[active].icon;
                      return <Icon className="w-8 h-8" />;
                    })()}
                  </div>
                  <div>
                    <div className="text-emerald-500 font-bold text-sm tracking-widest mb-1">{features[active].num}</div>
                    <h3 className="text-3xl lg:text-4xl font-black text-emerald-950">{features[active].title}</h3>
                  </div>
               </div>
               
               <p className="text-slate-600 text-lg leading-relaxed font-medium pb-4">
                 {features[active].desc}
               </p>
               
               <div className="pt-6 border-t border-slate-100 flex items-center gap-6">
                 <div className="flex gap-3">
                   <button 
                     onClick={() => setActive(prev => prev === 0 ? features.length - 1 : prev - 1)}
                     className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-500 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all bg-slate-50"
                     aria-label="السابق"
                   >
                     <ChevronRight className="w-5 h-5" />
                   </button>
                   <button 
                     onClick={() => setActive(prev => prev === features.length - 1 ? 0 : prev + 1)}
                     className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-500 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all bg-slate-50"
                     aria-label="التالي"
                   >
                     <ChevronLeft className="w-5 h-5" />
                   </button>
                 </div>
                 <div className="text-slate-400 font-bold tracking-widest text-sm bg-slate-50 px-5 py-2.5 rounded-full">
                   <span className="text-emerald-950 text-lg">{features[active].num}</span> / 08
                 </div>
               </div>
             </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Horizontal Scrollable Track */}
      <div className="w-full relative py-4">
         {/* Fade Edges for scroll indication */}
         <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none" />
         <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none" />
         
         <div className="flex items-center gap-4 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4 pb-4">
           {features.map((feature, idx) => (
             <button
               key={idx}
               onClick={() => setActive(idx)}
               className={\`shrink-0 snap-center flex items-center gap-4 p-3 pl-6 rounded-2xl transition-all duration-300 border-2 \${
                 active === idx 
                   ? 'bg-emerald-950 border-emerald-950 text-white shadow-xl scale-105' 
                   : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-200 hover:bg-slate-50'
               }\`}
             >
               <div className={\`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors \${
                 active === idx ? 'bg-white/10 text-amber-400' : 'bg-slate-50 text-slate-400'
               }\`}>
                 <feature.icon className="w-5 h-5" />
               </div>
               <div className="text-right">
                 <div className={\`text-[10px] font-bold tracking-widest uppercase mb-0.5 \${active === idx ? 'text-emerald-400/80' : 'text-slate-400'}\`}>
                   {feature.num}
                 </div>
                 <div className={\`text-sm md:text-base font-bold whitespace-nowrap \${active === idx ? 'text-white' : 'text-slate-700'}\`}>
                   {feature.title}
                 </div>
               </div>
             </button>
           ))}
         </div>
      </div>
    </div>
  );
}
`;

const startIndex = page.indexOf('function InteractiveFeatures() {');
const endIndex = page.indexOf('function InteractiveTimeline() {');

if (startIndex !== -1 && endIndex !== -1) {
    page = page.substring(0, startIndex) + featuresComp + '\n\n' + page.substring(endIndex);
    fs.writeFileSync('src/app/page.tsx', page, 'utf-8');
    console.log("Success!");
} else {
    console.log("Could not find start or end index.");
}
