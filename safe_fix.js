const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf-8');

const start = page.indexOf('function InteractiveTimeline() {');
const end = page.indexOf('// --- Main Page ---');

if (start !== -1 && end !== -1) {
    const newTimeline = `function InteractiveTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { num: "01", title: "تسجيل الدفعات", desc: "تسجيل وتتبع دفعات نوى التمر وربطها بالمصدر والكمية والحالة وطرق التخزين والمعالجة لتكوين سجل رقمي قابل للتتبع داخل المنصة.", icon: Database },
    { num: "02", title: "التحليل بالذكاء الاصطناعي", desc: "ارفع صورة لنوى التمر للحصول على تحليل بصري مبدئي. يساعد في التعرف على الخصائص البصرية الظاهرة كالشكل واللون والتجانس.", icon: BrainCircuit },
    { num: "03", title: "اكتشاف الاستخدامات المحتملة", desc: "استكشف مسارات الاستفادة المحتملة من نوى التمر بناءً على البيانات المتاحة ومستوى الأدلة العلمية (استخدامات مدعومة بالدراسات، قيد التحقق، وتجريبية).", icon: Search },
    { num: "04", title: "التجارب", desc: "أنشئ تجربة مرتبطة بالدفعة التي تعمل عليها. وثّق هدف التجربة، الكمية المستخدمة، طريقة المعالجة، والنتائج، لتكوين سجل قابل للتتبع.", icon: TestTube2 },
    { num: "05", title: "الأدلة والمصادر", desc: "تربط نواة مسارات الاستخدام بالمصادر والدراسات المتاحة، مع توضيح مستوى الأدلة وتمييز ما هو مثبت عما يحتاج للتحقق.", icon: BookOpen },
    { num: "06", title: "الخريطة الذكية", desc: "تعرض الخريطة المصادر والدفعات المرتبطة بها جغرافيًا، مع تنظيم البيانات (المنطقة ← المدينة ← المصدر ← الدفعات).", icon: Map },
    { num: "07", title: "قياس الأثر", desc: "تحول البيانات المسجلة في المنصة إلى مؤشرات أداء ككمية النوى المسجلة وعدد الدفعات والمصادر والتجارب لدعم اتخاذ القرار.", icon: LineChart },
  ];

  return (
    <div className="flex flex-col xl:flex-row items-center gap-16 xl:gap-24 w-full py-10 overflow-visible">
      {/* 1. Circular Data Flow System */}
      <div className="xl:w-1/2 flex justify-center items-center w-full relative h-[400px] sm:h-[500px]">
         {/* The dashed circular track */}
         <div className="absolute w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] rounded-full border-2 border-emerald-100 border-dashed" />
         
         {/* Animated flowing data */}
         <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] rounded-full pointer-events-none"
         >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_20px_#34d399]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_15px_#fbbf24]" />
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-300 rounded-full opacity-60" />
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-300 rounded-full opacity-60" />
         </motion.div>

         {/* Center NAWAH Circle */}
         <div className="absolute z-20 w-24 h-24 sm:w-32 sm:h-32 bg-emerald-950 rounded-full flex flex-col items-center justify-center shadow-[0_0_30px_rgba(2,44,34,0.3)] border-4 border-white">
            <span className="text-white font-black text-xl sm:text-2xl tracking-tighter">نواة</span>
            <span className="text-emerald-400/80 font-bold text-[10px] sm:text-xs tracking-widest mt-1">NAWAH</span>
         </div>

         {/* 7 Nodes */}
         {steps.map((step, idx) => {
            const angle = (idx * (360 / 7)) - 90;
            const rad = angle * (Math.PI / 180);
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={\`absolute z-30 flex flex-col items-center justify-center transition-all duration-500 group \${
                  activeStep === idx ? 'scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                }\`}
                style={{ 
                  left: \`\${50 + Math.cos(rad)*50}%\`, 
                  top: \`\${50 + Math.sin(rad)*50}%\`, 
                  transform: 'translate(-50%, -50%)' 
                }}
              >
                <div className={\`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 \${
                  activeStep === idx 
                    ? 'bg-emerald-600 text-white shadow-[0_0_25px_rgba(5,150,105,0.5)] ring-4 ring-emerald-100' 
                    : 'bg-white border-2 border-slate-100 text-slate-500 hover:border-emerald-300 hover:text-emerald-600'
                }\`}>
                  <step.icon className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                {/* Node Label */}
                <div className="absolute top-full mt-2 sm:mt-3 w-28 text-center pointer-events-none">
                   <div className={\`inline-block text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 \${
                     activeStep === idx ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                   }\`}>{step.num}</div>
                   <div className={\`text-[10px] sm:text-xs font-bold leading-tight \${
                     activeStep === idx ? 'text-emerald-950' : 'text-slate-500'
                   }\`}>{step.title}</div>
                </div>
              </button>
            )
         })}
      </div>

      {/* 2. Details Panel */}
      <div className="xl:w-1/3 w-full max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden"
          >
            {/* Subtle top border glow for active step */}
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
               <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  {(() => {
                    const Icon = steps[activeStep].icon;
                    return <Icon className="w-7 h-7" />;
                  })()}
               </div>
               <div>
                 <div className="text-emerald-500 font-bold text-xs mb-1 uppercase tracking-widest">{steps[activeStep].num}</div>
                 <h3 className="text-lg sm:text-xl font-black text-emerald-950">{steps[activeStep].title}</h3>
               </div>
            </div>
            
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium mb-8 relative z-10">
              {steps[activeStep].desc}
            </p>
            
            {/* Prev / Next Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 relative z-10">
               <button 
                 onClick={() => setActiveStep(prev => prev === 0 ? steps.length - 1 : prev - 1)}
                 className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                 aria-label="السابق"
               >
                 <ChevronRight className="w-5 h-5" />
               </button>
               
               <div className="text-sm font-bold text-slate-400 font-mono tracking-widest bg-slate-50 px-4 py-1.5 rounded-full">
                 {steps[activeStep].num} <span className="text-slate-300 mx-1">/</span> 07
               </div>

               <button 
                 onClick={() => setActiveStep(prev => prev === steps.length - 1 ? 0 : prev + 1)}
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
    
    page = page.substring(0, start) + newTimeline + page.substring(end);
    fs.writeFileSync('src/app/page.tsx', page, 'utf-8');
} else {
    console.log("Could not find start or end index.");
}
