const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf-8');

const featuresComp = `
function InteractiveFeatures() {
  const [activeFeature, setActiveFeature] = useState(0);
  const features = [
    { 
      num: "01", 
      title: "إدارة الدفعات", 
      desc: "تسجيل وتتبع دفعات نوى التمر وربطها ببيانات المصدر والكمية والحالة وطرق التخزين والمعالجة لتكوين سجل رقمي موثوق وقابل للتتبع داخل المنصة.", 
      points: ["تسجيل البيانات بسهولة", "ربط الدفعات بالمصدر", "تتبع الحالة والمعالجة"],
      icon: Database 
    },
    { 
      num: "02", 
      title: "الذكاء الاصطناعي", 
      desc: "تحليل وتوقع الفرص والمسارات باستخدام نماذج الذكاء الاصطناعي.", 
      points: [],
      icon: BrainCircuit 
    },
    { 
      num: "03", 
      title: "قاعدة الأدلة", 
      desc: "مكتبة الأبحاث العلمية الموثقة التي تدعم مسارات الاستخدام المحتملة.", 
      points: [],
      icon: BookOpen 
    },
    { 
      num: "04", 
      title: "إدارة التجارب", 
      desc: "توثيق نتائج المعالجة المخبرية وربطها بالدفعات لضمان تتبع جودة التجارب.", 
      points: [],
      icon: TestTube2 
    },
    { 
      num: "05", 
      title: "الخريطة الذكية", 
      desc: "توزيع المصادر والمصانع جغرافياً لتسهيل فهم وتتبع مسارات الإمداد.", 
      points: [],
      icon: Map 
    },
    { 
      num: "06", 
      title: "لوحة البيانات", 
      desc: "مؤشرات أداء وتحليلات فورية توفر رؤية شاملة للمنظومة واتخاذ قرارات مبنية على بيانات.", 
      points: [],
      icon: LayoutDashboard 
    },
    { 
      num: "07", 
      title: "قياس الأثر", 
      desc: "تتبع العوائد البيئية والاقتصادية لمسارات معالجة وإعادة استخدام نوى التمر.", 
      points: [],
      icon: LineChart 
    },
    { 
      num: "08", 
      title: "التتبع", 
      desc: "مسح سريع لمعلومات الشحنات والدفعات لضمان موثوقية وسرعة تدفق البيانات.", 
      points: [],
      icon: QrCode 
    }
  ];

  return (
    <div className="flex flex-col xl:flex-row items-center gap-16 xl:gap-24 w-full py-10 overflow-visible">
      {/* 1. Circular Features System */}
      <div className="xl:w-1/2 flex justify-center items-center w-full relative h-[450px] sm:h-[550px]">
         {/* The dashed circular track */}
         <div className="absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full border-2 border-slate-100 border-dashed" />
         
         {/* Animated flowing data */}
         <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full pointer-events-none"
         >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_20px_#34d399]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_15px_#34d399] opacity-70" />
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-300 rounded-full opacity-60" />
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-300 rounded-full opacity-60" />
         </motion.div>

         {/* Center NAWAH Circle */}
         <div className="absolute z-20 w-28 h-28 sm:w-36 sm:h-36 bg-white rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.05)] border-[8px] border-slate-50">
            <span className="text-emerald-950 font-black text-xl sm:text-2xl tracking-tighter">نواة</span>
            <span className="text-emerald-600/80 font-bold text-[10px] sm:text-xs tracking-widest mt-1">NAWAH</span>
         </div>

         {/* 8 Nodes */}
         {features.map((feature, idx) => {
            const angle = (idx * (360 / 8)) - 90;
            const rad = angle * (Math.PI / 180);
            return (
              <button
                key={idx}
                onClick={() => setActiveFeature(idx)}
                className={\`absolute z-30 flex flex-col items-center justify-center transition-all duration-500 group \${
                  activeFeature === idx ? 'scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                }\`}
                style={{ 
                  left: \`\${50 + Math.cos(rad)*50}%\`, 
                  top: \`\${50 + Math.sin(rad)*50}%\`, 
                  transform: 'translate(-50%, -50%)' 
                }}
              >
                <div className={\`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 \${
                  activeFeature === idx 
                    ? 'bg-emerald-600 text-white shadow-[0_0_25px_rgba(5,150,105,0.4)] ring-4 ring-emerald-100' 
                    : 'bg-white border-2 border-slate-100 text-slate-500 hover:border-emerald-300 hover:text-emerald-600'
                }\`}>
                  <feature.icon className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                {/* Node Label */}
                <div className="absolute top-full mt-2 sm:mt-3 w-28 text-center pointer-events-none">
                   <div className={\`inline-block text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 \${
                     activeFeature === idx ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                   }\`}>{feature.num}</div>
                   <div className={\`text-[10px] sm:text-xs font-bold leading-tight \${
                     activeFeature === idx ? 'text-emerald-950' : 'text-slate-500'
                   }\`}>{feature.title}</div>
                </div>
              </button>
            )
         })}
      </div>

      {/* 2. Details Panel */}
      <div className="xl:w-1/3 w-full max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden"
          >
            {/* Subtle top border glow for active step */}
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
               <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  {(() => {
                    const Icon = features[activeFeature].icon;
                    return <Icon className="w-7 h-7" />;
                  })()}
               </div>
               <div>
                 <div className="text-emerald-500 font-bold text-xs mb-1 uppercase tracking-widest">{features[activeFeature].num}</div>
                 <h3 className="text-lg sm:text-xl font-black text-emerald-950">{features[activeFeature].title}</h3>
               </div>
            </div>
            
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium mb-6 relative z-10">
              {features[activeFeature].desc}
            </p>
            
            {features[activeFeature].points && features[activeFeature].points.length > 0 && (
              <ul className="space-y-3 mb-8 relative z-10">
                {features[activeFeature].points.map((pt, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
            )}
            
            {/* Prev / Next Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 relative z-10">
               <button 
                 onClick={() => setActiveFeature(prev => prev === 0 ? features.length - 1 : prev - 1)}
                 className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                 aria-label="السابق"
               >
                 <ChevronRight className="w-5 h-5" />
               </button>
               
               <div className="text-sm font-bold text-slate-400 font-mono tracking-widest bg-slate-50 px-4 py-1.5 rounded-full">
                 {features[activeFeature].num} <span className="text-slate-300 mx-1">/</span> 08
               </div>

               <button 
                 onClick={() => setActiveFeature(prev => prev === features.length - 1 ? 0 : prev + 1)}
                 className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                 aria-label="التالي"
               >
                 <ChevronLeft className="w-5 h-5" />
               </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
`;

const insertIndex = page.indexOf('function InteractiveTimeline() {');
if (insertIndex !== -1) {
    page = page.substring(0, insertIndex) + featuresComp + '\n\n' + page.substring(insertIndex);
}

const featStart = page.indexOf('{/* 5. FEATURES SHOWCASE */}');
const featEnd = page.indexOf('{/* 6. IMPACT VISUALIZATION');

if (featStart !== -1 && featEnd !== -1) {
    const replacement = `{/* 5. FEATURES SHOWCASE */}
      <section className="py-24 bg-white border-t border-slate-100 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-black text-emerald-950">مميزات نواة</h2>
            <p className="text-emerald-600/70 text-lg font-bold">منظومة واحدة بدل بيانات متفرقة</p>
          </div>

          <InteractiveFeatures />
        </div>
      </section>

      `;
    page = page.substring(0, featStart) + replacement + page.substring(featEnd);
    fs.writeFileSync('src/app/page.tsx', page, 'utf-8');
    console.log('Success!');
} else {
    console.log('Could not find section');
}
