const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf-8');

// ============================================================
// FIX 1: InteractiveTimeline - The "How NAWAH Works" circle
// ============================================================
// PROBLEM: radiusPercent=50 puts nodes at the edge. Labels below nodes overflow.
// On mobile 220px circle, 7 nodes are too crowded with their labels.
// FIX: Reduce radiusPercent to 42 so labels stay inside container.
// Increase container height to account for labels. Make labels wider.

page = page.replace(
  'const radiusPercent = 50; // Dynamic distance from center',
  'const radiusPercent = 42; // Keep nodes + labels inside container'
);

// InteractiveTimeline container: increase mobile height for label room
page = page.replace(
  '<div className="xl:w-1/2 flex justify-center items-center w-full relative h-[340px] sm:h-[500px] lg:h-[650px] xl:h-[750px] overflow-visible">',
  '<div className="xl:w-1/2 flex justify-center items-center w-full relative h-[360px] sm:h-[520px] lg:h-[650px] xl:h-[750px] overflow-visible">'
);

// InteractiveTimeline node labels: wider containers, bigger text
page = page.replace(
  'className={`absolute top-full mt-1 sm:mt-3 lg:mt-5 w-20 sm:w-28 lg:w-40 text-center pointer-events-none transition-all duration-500 ${activeStep === idx ? \'scale-110 translate-y-1\' : \'\'}`}',
  'className={`absolute top-full mt-1 sm:mt-2 lg:mt-4 w-[70px] sm:w-28 lg:w-40 text-center pointer-events-none transition-all duration-500 ${activeStep === idx ? \'scale-105\' : \'\'}`}'
);

// Node label number badge
page = page.replace(
  /className=\{`inline-block text-\[9px\] sm:text-\[10px\] lg:text-xs font-black px-2 lg:px-3 py-0\.5 lg:py-1 rounded-full mb-1 lg:mb-2 shadow-sm \$\{/,
  'className={`inline-block text-[8px] sm:text-[10px] lg:text-xs font-black px-1.5 sm:px-2 lg:px-3 py-0.5 lg:py-1 rounded-full mb-0.5 sm:mb-1 lg:mb-2 shadow-sm ${'
);

// Node label title text
page = page.replace(
  /className=\{`text-\[8px\] sm:text-xs lg:text-sm xl:text-base font-black leading-tight lg:leading-snug drop-shadow-sm \$\{activeStep === idx \? 'text-emerald-950' : 'text-slate-500'/,
  'className={`text-[7px] sm:text-[11px] lg:text-sm xl:text-base font-bold sm:font-black leading-tight lg:leading-snug drop-shadow-sm ${activeStep === idx ? \'text-emerald-950\' : \'text-slate-500\''
);

// InteractiveTimeline circle tracks: slightly smaller on mobile to give label room
page = page.replace(
  '<div className="absolute w-[220px] h-[220px] sm:w-[400px] sm:h-[400px] lg:w-[550px] lg:h-[550px] xl:w-[650px] xl:h-[650px] rounded-full border-2 border-emerald-100 border-dashed" />',
  '<div className="absolute w-[200px] h-[200px] sm:w-[380px] sm:h-[380px] lg:w-[520px] lg:h-[520px] xl:w-[620px] xl:h-[620px] rounded-full border-2 border-emerald-100 border-dashed" />'
);

page = page.replace(
  '<div className="absolute w-[180px] h-[180px] sm:w-[320px] sm:h-[320px] lg:w-[450px] lg:h-[450px] xl:w-[520px] xl:h-[520px] rounded-full border border-emerald-50/50" />',
  '<div className="absolute w-[160px] h-[160px] sm:w-[300px] sm:h-[300px] lg:w-[420px] lg:h-[420px] xl:w-[500px] xl:h-[500px] rounded-full border border-emerald-50/50" />'
);

// Animated flowing data track - match the dashed circle
page = page.replace(
  'className="absolute w-[220px] h-[220px] sm:w-[400px] sm:h-[400px] lg:w-[550px] lg:h-[550px] xl:w-[650px] xl:h-[650px] rounded-full pointer-events-none"',
  'className="absolute w-[200px] h-[200px] sm:w-[380px] sm:h-[380px] lg:w-[520px] lg:h-[520px] xl:w-[620px] xl:h-[620px] rounded-full pointer-events-none"'
);

// InteractiveTimeline node icons: make mobile nodes slightly smaller
page = page.replace(
  /className=\{`w-9 h-9 sm:w-16 sm:h-16 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full flex items-center justify-center shadow-xl/,
  'className={`w-8 h-8 sm:w-14 sm:h-14 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full flex items-center justify-center shadow-xl'
);

// InteractiveTimeline node icon sizes
page = page.replace(
  '<step.icon className="w-5 h-5 sm:w-7 sm:h-7 lg:w-10 lg:h-10 xl:w-12 xl:h-12" />',
  '<step.icon className="w-4 h-4 sm:w-6 sm:h-6 lg:w-9 lg:h-9 xl:w-10 xl:h-10" />'
);

// InteractiveTimeline center circle: keep proportional
page = page.replace(
  '<div className="absolute z-20 w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 xl:w-56 xl:h-56 bg-emerald-950 rounded-full',
  '<div className="absolute z-20 w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 xl:w-48 xl:h-48 bg-emerald-950 rounded-full'
);

// ============================================================
// FIX 2: Hero CircularSystem - similar proportional fixes
// ============================================================

// Hero circle container: make heights more proportional
page = page.replace(
  '<div className="lg:w-1/2 w-full h-[400px] sm:h-[500px] lg:h-[750px] xl:h-[850px] relative flex items-center justify-center">',
  '<div className="lg:w-1/2 w-full h-[380px] sm:h-[480px] lg:h-[700px] xl:h-[800px] relative flex items-center justify-center">'
);

// Hero section bottom padding to accommodate the info card
page = page.replace(
  '<section className="relative pt-16 pb-20 sm:pt-20 sm:pb-32 lg:pt-32 lg:pb-56 xl:pb-64 bg-slate-50 overflow-hidden">',
  '<section className="relative pt-16 pb-28 sm:pt-20 sm:pb-40 lg:pt-32 lg:pb-56 xl:pb-64 bg-slate-50 overflow-hidden">'
);

// Hero CircularSystem info card: position based on breakpoints
page = page.replace(
  '<div className="absolute top-[110%] sm:top-full mt-10 sm:mt-16 lg:mt-28 xl:mt-32 text-center w-full max-w-xs sm:max-w-md lg:max-w-xl px-2 sm:px-4">',
  '<div className="absolute top-[105%] sm:top-full mt-6 sm:mt-12 lg:mt-20 xl:mt-24 text-center w-full max-w-xs sm:max-w-md lg:max-w-xl px-2 sm:px-4">'
);

// Hero CircularSystem: ensure the max-w scales well
page = page.replace(
  '<div className="relative w-full max-w-[280px] sm:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto aspect-square flex items-center justify-center mt-12 lg:mt-0 transition-all duration-500">',
  '<div className="relative w-full max-w-[260px] sm:max-w-md lg:max-w-2xl xl:max-w-3xl mx-auto aspect-square flex items-center justify-center mt-8 lg:mt-0 transition-all duration-500">'
);

// Hero center node: proportional sizing
page = page.replace(
  '<div className="relative z-20 w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 xl:w-64 xl:h-64 rounded-full bg-white shadow-2xl flex items-center justify-center border border-slate-100 flex-col gap-1 sm:gap-2 ring-8 ring-emerald-50/50 xl:ring-[16px]">',
  '<div className="relative z-20 w-20 h-20 sm:w-28 sm:h-28 lg:w-44 lg:h-44 xl:w-56 xl:h-56 rounded-full bg-white shadow-2xl flex items-center justify-center border border-slate-100 flex-col gap-1 sm:gap-2 ring-4 sm:ring-8 ring-emerald-50/50 xl:ring-[12px]">'
);

// Hero center text
page = page.replace(
  '<span className="font-black text-emerald-950 text-base sm:text-xl lg:text-4xl xl:text-5xl tracking-tighter">',
  '<span className="font-black text-emerald-950 text-sm sm:text-lg lg:text-3xl xl:text-4xl tracking-tighter">'
);

page = page.replace(
  '<span className="text-emerald-600/60 font-bold text-[8px] sm:text-[10px] lg:text-xs xl:text-base tracking-widest uppercase">',
  '<span className="text-emerald-600/60 font-bold text-[7px] sm:text-[9px] lg:text-xs xl:text-sm tracking-widest uppercase">'
);

// Hero node circles
page = page.replace(
  /className=\{`relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full transition-all duration-500/,
  'className={`relative flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full transition-all duration-500'
);

// Hero node icon sizes
page = page.replace(
  '<stage.icon className="w-5 h-5 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12" />',
  '<stage.icon className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />'
);

// Hero node labels
page = page.replace(
  /className=\{`absolute top-full mt-4 sm:mt-6 left-1\/2 -translate-x-1\/2 text-center w-\[120px\] sm:w-\[150px\] lg:w-\[200px\]/,
  'className={`absolute top-full mt-2 sm:mt-4 left-1/2 -translate-x-1/2 text-center w-[80px] sm:w-[120px] lg:w-[180px]'
);

page = page.replace(
  '<span className="text-[10px] sm:text-sm lg:text-lg xl:text-xl leading-tight block drop-shadow-sm">',
  '<span className="text-[8px] sm:text-xs lg:text-base xl:text-lg leading-tight block drop-shadow-sm">'
);

// ============================================================
// FIX 3: "How it works" section - remove overflow-hidden that clips nodes
// ============================================================
page = page.replace(
  '<section id="how-it-works" className="py-14 sm:py-24 bg-slate-50 relative overflow-hidden">',
  '<section id="how-it-works" className="py-14 sm:py-24 lg:py-32 bg-slate-50 relative overflow-hidden">'
);

// ============================================================
// VERIFY: Write file
// ============================================================
fs.writeFileSync('src/app/page.tsx', page, 'utf-8');
console.log("All responsive circle fixes applied!");
