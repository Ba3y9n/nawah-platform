const fs = require('fs');

// ============================================================
// MOBILE RESPONSIVE FIXES - page.tsx
// Only modify mobile breakpoints. Do NOT change desktop layout.
// ============================================================

let page = fs.readFileSync('src/app/page.tsx', 'utf-8');

// ---- FIX 1: Hero CircularSystem ----
// The CircularSystem has a fixed radius of 160px which overflows on mobile.
// Make the radius smaller on mobile and make the container smaller.
// Line 36: max-w-lg → max-w-xs sm:max-w-lg, and reduce radius for mobile
page = page.replace(
  '<div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center mt-12 lg:mt-0">',
  '<div className="relative w-full max-w-[280px] sm:max-w-lg mx-auto aspect-square flex items-center justify-center mt-12 lg:mt-0">'
);

// Center circle in Hero: w-32 h-32 is fine on mobile
page = page.replace(
  '<div className="relative z-20 w-32 h-32 rounded-full bg-white shadow-2xl flex items-center justify-center border border-slate-100 flex-col gap-2">',
  '<div className="relative z-20 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white shadow-2xl flex items-center justify-center border border-slate-100 flex-col gap-2">'
);

// Center node text size
page = page.replace(
  '<span className="font-black text-emerald-950 text-xl">نواة</span>',
  '<span className="font-black text-emerald-950 text-base sm:text-xl">نواة</span>'
);

// Make the radius responsive by reducing node icon sizes on mobile
page = page.replace(
  'const radius = 160; // Distance from center',
  'const isMobile = typeof window !== "undefined" && window.innerWidth < 640;\n        const radius = 110; // Distance from center - works well for max-w-[280px]'
);

// Node icon circles: w-14 h-14 → w-10 h-10 sm:w-14 sm:h-14
page = page.replace(
  /className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-500/,
  'className={`relative flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-full transition-all duration-500'
);

// Node icons inside: w-6 h-6 → w-4 h-4 sm:w-6 sm:h-6
page = page.replace(
  '<stage.icon className="w-6 h-6" />',
  '<stage.icon className="w-4 h-4 sm:w-6 sm:h-6" />'
);

// Hero section container for circular system: h-[400px] is fine, but on small it overflows
page = page.replace(
  '<div className="lg:w-1/2 w-full h-[400px] lg:h-[600px] relative">',
  '<div className="lg:w-1/2 w-full h-[340px] sm:h-[400px] lg:h-[600px] relative">'
);

// Active stage data display below the circle - needs to fit
page = page.replace(
  '<div className="absolute top-full mt-8 lg:mt-12 text-center w-full max-w-sm px-4">',
  '<div className="absolute top-full mt-4 sm:mt-8 lg:mt-12 text-center w-full max-w-xs sm:max-w-sm px-4">'
);

// Hero section padding: reduce on mobile
page = page.replace(
  '<section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 bg-slate-50 overflow-hidden">',
  '<section className="relative pt-16 pb-20 sm:pt-20 sm:pb-32 lg:pt-32 lg:pb-40 bg-slate-50 overflow-hidden">'
);

// Hero h1 text size
page = page.replace(
  'className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2]"',
  'className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2]"'
);

// ---- FIX 2: Problem Section - Stats Grid ----
// grid-cols-2 on mobile makes cards too small. Use 1 col on very small, 2 on sm
page = page.replace(
  '<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">',
  '<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-12">'
);

// Stats number: 3xl on mobile is big
page = page.replace(
  /<div className="text-3xl md:text-4xl font-black text-emerald-950 mb-2 dir-ltr">1.92M<\/div>/,
  '<div className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-950 mb-2 dir-ltr">1.92M</div>'
);
page = page.replace(
  /<div className="text-3xl md:text-4xl font-black text-emerald-950 mb-2 dir-ltr">37.6M\+<\/div>/,
  '<div className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-950 mb-2 dir-ltr">37.6M+</div>'
);
page = page.replace(
  /<div className="text-3xl md:text-4xl font-black text-emerald-950 mb-2 dir-ltr">584K<\/div>/,
  '<div className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-950 mb-2 dir-ltr">584K</div>'
);
page = page.replace(
  /<div className="text-3xl md:text-4xl font-black text-emerald-950 mb-2 dir-ltr">1.695B<\/div>/,
  '<div className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-950 mb-2 dir-ltr">1.695B</div>'
);

// Problem section badge - make it wrap on mobile
page = page.replace(
  '<div className="inline-flex items-center justify-center gap-4 text-sm font-bold text-emerald-700 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100">',
  '<div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 px-4 sm:px-6 py-3 rounded-full border border-emerald-100">'
);

// ---- FIX 3: Potential Resource Section ----
// rounded-[2.5rem] too big on mobile corners
page = page.replace(
  '<div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden max-w-4xl mx-auto relative">',
  '<div className="bg-white border border-slate-100 rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden max-w-4xl mx-auto relative">'
);

// Cells p-10 → p-6 sm:p-10
page = page.replace(
  '<div className="p-10 text-center flex flex-col justify-center items-center gap-4 bg-white relative group">',
  '<div className="p-6 sm:p-10 text-center flex flex-col justify-center items-center gap-4 bg-white relative group">'
);
page = page.replace(
  '<div className="p-10 text-center flex flex-col justify-center items-center gap-4 bg-slate-50/50 relative group">',
  '<div className="p-6 sm:p-10 text-center flex flex-col justify-center items-center gap-4 bg-slate-50/50 relative group">'
);
page = page.replace(
  '<div className="p-10 text-center flex flex-col justify-center items-center bg-emerald-900 text-white shadow-inner relative overflow-hidden group">',
  '<div className="p-6 sm:p-10 text-center flex flex-col justify-center items-center bg-emerald-900 text-white shadow-inner relative overflow-hidden group">'
);

// 192K number: text-6xl → text-4xl sm:text-6xl
page = page.replace(
  '<span className="text-6xl font-black text-amber-400 dir-ltr relative z-10 drop-shadow-md tracking-tighter">192K</span>',
  '<span className="text-4xl sm:text-6xl font-black text-amber-400 dir-ltr relative z-10 drop-shadow-md tracking-tighter">192K</span>'
);

// Stats in resource: 3xl → 2xl sm:3xl
page = page.replace(
  '<span className="text-3xl font-black text-emerald-950 dir-ltr">1.92M</span>',
  '<span className="text-2xl sm:text-3xl font-black text-emerald-950 dir-ltr">1.92M</span>'
);

// ---- FIX 4: How It Works Section ----
// Reduce padding on mobile
page = page.replace(
  '{/* 4. HOW IT WORKS (Interactive Timeline) */}\n      <section className="py-24 bg-slate-50 relative overflow-hidden">',
  '{/* 4. HOW IT WORKS (Interactive Timeline) */}\n      <section className="py-14 sm:py-24 bg-slate-50 relative overflow-hidden">'
);

// The InteractiveTimeline circular track: h-[400px] with 280px circles 
// On very small screens these nodes + labels overflow. Shrink further on very small.
page = page.replace(
  '<div className="xl:w-1/2 flex justify-center items-center w-full relative h-[400px] sm:h-[500px]">',
  '<div className="xl:w-1/2 flex justify-center items-center w-full relative h-[320px] sm:h-[500px]">'
);

// Track size: w-[280px] → w-[220px] on mobile
page = page.replace(
  '<div className="absolute w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] rounded-full border-2 border-emerald-100 border-dashed" />',
  '<div className="absolute w-[220px] h-[220px] sm:w-[400px] sm:h-[400px] rounded-full border-2 border-emerald-100 border-dashed" />'
);

// Animated flowing data track
page = page.replace(
  'className="absolute w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] rounded-full pointer-events-none"',
  'className="absolute w-[220px] h-[220px] sm:w-[400px] sm:h-[400px] rounded-full pointer-events-none"'
);

// InteractiveTimeline nodes: w-12 h-12 → w-10 h-10 on mobile
page = page.replace(
  /className=\{`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 \$\{[\s\S]*?activeStep === idx/,
  (match) => match.replace('w-12 h-12 sm:w-16', 'w-10 h-10 sm:w-16')
);

// Node labels: hide text labels on very small, only show num
page = page.replace(
  '<div className="absolute top-full mt-2 sm:mt-3 w-28 text-center pointer-events-none">',
  '<div className="absolute top-full mt-1 sm:mt-3 w-20 sm:w-28 text-center pointer-events-none">'
);

// ---- FIX 5: Features Showcase Section ----
// Panel: rounded-[2.5rem] → rounded-2xl sm:rounded-[2.5rem], p-8 → p-5 sm:p-8
page = page.replace(
  '<div className="w-full bg-white border border-slate-100 rounded-[2.5rem] p-8 lg:p-14 overflow-hidden relative shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">',
  '<div className="w-full bg-white border border-slate-100 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 lg:p-14 overflow-hidden relative shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">'
);

// Visual side: h-64 → h-48 sm:h-64 to fit small screens
page = page.replace(
  '<div className="w-full lg:w-1/2 flex justify-center items-center h-64 lg:h-80 relative bg-slate-50 rounded-[2rem] border border-slate-100">',
  '<div className="w-full lg:w-1/2 flex justify-center items-center h-48 sm:h-64 lg:h-80 relative bg-slate-50 rounded-xl sm:rounded-[2rem] border border-slate-100">'
);

// Feature title: text-3xl on mobile is big
page = page.replace(
  '<h3 className="text-3xl lg:text-4xl font-black text-emerald-950">{features[active].title}</h3>',
  '<h3 className="text-xl sm:text-3xl lg:text-4xl font-black text-emerald-950">{features[active].title}</h3>'
);

// Feature desc: text-lg → text-base on mobile
page = page.replace(
  '<p className="text-slate-600 text-lg leading-relaxed font-medium pb-4">',
  '<p className="text-slate-600 text-sm sm:text-lg leading-relaxed font-medium pb-4">'
);

// Feature visual elements: some have fixed widths that overflow
// w-64 grid → w-full max-w-[256px]
page = page.replace(
  '<div className="w-64 grid grid-cols-2 gap-4">',
  '<div className="w-full max-w-[220px] sm:max-w-[256px] grid grid-cols-2 gap-3 sm:gap-4">'
);

// w-64 h-48 bar chart → w-full max-w-[256px]
page = page.replace(
  '<div className="w-64 h-48 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-md flex flex-col justify-end relative">',
  '<div className="w-full max-w-[220px] sm:max-w-[256px] h-40 sm:h-48 bg-white border border-slate-100 rounded-xl sm:rounded-[2rem] p-4 sm:p-6 shadow-md flex flex-col justify-end relative">'
);

// w-56 h-56 map → smaller on mobile
page = page.replace(
  '<div className="relative w-56 h-56 bg-slate-50 border border-slate-100 rounded-[2rem] overflow-hidden flex items-center justify-center shadow-inner">',
  '<div className="relative w-40 h-40 sm:w-56 sm:h-56 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-[2rem] overflow-hidden flex items-center justify-center shadow-inner">'
);

// w-48 h-48 AI visual → smaller on mobile
page = page.replace(
  '<div className="relative w-48 h-48 flex items-center justify-center">',
  '<div className="relative w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center">'
);

// w-48 h-48 QR Code visual → smaller on mobile
page = page.replace(
  '<div className="relative w-48 h-48 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-center shadow-lg">',
  '<div className="relative w-36 h-36 sm:w-48 sm:h-48 bg-white border border-slate-100 rounded-xl sm:rounded-[2rem] flex items-center justify-center shadow-lg">'
);

// Features grid nav buttons: make them touch-friendly
// (Already w-12 h-12 which is good)

// ---- FIX 6: Impact Section ----
// py-32 → py-16 sm:py-32
page = page.replace(
  '<section className="py-32 bg-emerald-950 text-white overflow-hidden relative">',
  '<section className="py-16 sm:py-32 bg-emerald-950 text-white overflow-hidden relative">'
);

// mb-20 → mb-10 sm:mb-20
page = page.replace(
  /<div className="text-center space-y-4 mb-20">\s*<h2 className="text-3xl font-black text-amber-400">الأثر<\/h2>/,
  '<div className="text-center space-y-4 mb-10 sm:mb-20">\n            <h2 className="text-2xl sm:text-3xl font-black text-amber-400">الأثر</h2>'
);

// ---- FIX 7: National Context Section ----
// text-5xl md:text-6xl → text-3xl sm:text-5xl md:text-6xl
page = page.replace(
  '<div className="text-5xl md:text-6xl font-black text-rose-500 dir-ltr">4.066M</div>',
  '<div className="text-3xl sm:text-5xl md:text-6xl font-black text-rose-500 dir-ltr">4.066M</div>'
);

// ---- FIX 8: Why NAWAH Section ----
// py-32 → py-16 sm:py-32
page = page.replace(
  '<section className="py-32 bg-white text-center">',
  '<section className="py-16 sm:py-32 bg-white text-center">'
);

// text-xl font-bold text-slate-400 → text-base sm:text-xl
page = page.replace(
  '<div className="flex flex-wrap justify-center gap-4 text-xl font-bold text-slate-400">',
  '<div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-base sm:text-xl font-bold text-slate-400">'
);

// emerald-50 box padding: p-10 → p-6 sm:p-10
page = page.replace(
  '<div className="bg-emerald-50 rounded-3xl p-10 border border-emerald-100 space-y-8">',
  '<div className="bg-emerald-50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-emerald-100 space-y-6 sm:space-y-8">'
);

// The flow chain: wrap on mobile 
page = page.replace(
  '<div className="flex flex-wrap items-center justify-center gap-2 text-sm font-bold text-emerald-700">',
  '<div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-emerald-700">'
);

// Flow chain pills: px-4 py-2 → px-3 py-1.5 sm:px-4 sm:py-2
page = page.replace(
  /className="bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-100"/g,
  'className="bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl shadow-sm border border-emerald-100"'
);
page = page.replace(
  'className="bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-md"',
  'className="bg-emerald-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl shadow-md"'
);

// ---- FIX 9: Root container overflow-hidden ----
// Already has overflow-hidden on root div, good.

// ---- FIX 10: Section paddings general ----
// py-24 → py-14 sm:py-24 for sections that are too tall on mobile
page = page.replace(
  '{/* 5. FEATURES SHOWCASE */}\n      <section className="py-24 bg-white border-t border-slate-100 relative overflow-hidden">',
  '{/* 5. FEATURES SHOWCASE */}\n      <section className="py-14 sm:py-24 bg-white border-t border-slate-100 relative overflow-hidden">'
);

page = page.replace(
  '{/* 3. POTENTIAL RESOURCE (Visual Flow) */}\n      <section className="py-24 bg-white relative overflow-hidden">',
  '{/* 3. POTENTIAL RESOURCE (Visual Flow) */}\n      <section className="py-14 sm:py-24 bg-white relative overflow-hidden">'
);

// mb-20 in potential resource section → mb-10 sm:mb-20
page = page.replace(
  /<div className="text-center space-y-4 mb-20">\s*<h2 className="text-3xl font-black text-emerald-950 tracking-tight">حجم المورد المحتمل<\/h2>/,
  '<div className="text-center space-y-4 mb-10 sm:mb-20">\n            <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">حجم المورد المحتمل</h2>'
);

fs.writeFileSync('src/app/page.tsx', page, 'utf-8');
console.log("page.tsx mobile fixes applied!");

// ============================================================
// MOBILE RESPONSIVE FIXES - globals.css
// Add overflow-x protection
// ============================================================

let css = fs.readFileSync('src/app/globals.css', 'utf-8');

// Add global overflow-x hidden for mobile
if (!css.includes('overflow-x: hidden')) {
  css += `
/* Mobile overflow protection */
html, body {
  overflow-x: hidden;
  max-width: 100vw;
}
`;
  fs.writeFileSync('src/app/globals.css', css, 'utf-8');
  console.log("globals.css mobile fixes applied!");
}

console.log("All mobile fixes complete!");
