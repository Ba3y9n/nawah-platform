const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf-8');

// 1. Fix the dark green background to be even darker for better contrast (emerald-950)
page = page.replace(
  '<section className="py-8 bg-emerald-900 border-t border-emerald-950 text-white">',
  '<section className="py-12 sm:py-16 bg-emerald-950 border-t border-emerald-900/50 text-white relative overflow-hidden">'
);

// Add an ambient glow to the background to make it less flat
page = page.replace(
  '<div className="text-center space-y-4 mb-16">',
  '<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />\n          <div className="text-center space-y-4 mb-16 relative z-10">'
);

// 2. Make the cards pop more (subtle green shadow, slightly better border)
const oldCardClass = 'className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center group hover:border-emerald-200 transition-colors"';
const newCardClass = 'className="bg-white p-6 md:p-8 rounded-[2rem] border-4 border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] flex flex-col justify-center items-center text-center group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.4)] transition-all duration-300 relative z-10"';
page = page.replaceAll(oldCardClass, newCardClass);

// 3. Fix the unreadable text at the bottom (was text-slate-600 on dark green bg!)
page = page.replace(
  '<p className="text-lg text-slate-600 leading-relaxed">',
  '<p className="text-lg text-emerald-50/90 leading-relaxed font-medium relative z-10">'
);

// 4. Improve the pill badge to pop better on the dark bg
page = page.replace(
  '<div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 px-4 sm:px-6 py-3 rounded-full border border-emerald-100">',
  '<div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold text-emerald-950 bg-amber-400 px-5 sm:px-8 py-3.5 rounded-full border border-amber-300 shadow-lg shadow-amber-400/20 relative z-10">'
);
page = page.replace(
  '<div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />',
  '<div className="w-1.5 h-1.5 rounded-full bg-emerald-950/40" />'
);

fs.writeFileSync('src/app/page.tsx', page, 'utf-8');
console.log("Problem section fixes applied!");
