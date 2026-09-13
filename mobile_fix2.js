const fs = require('fs');

// ============================================================
// MOBILE FIX 2: pit-management/layout.tsx
// ============================================================
let layout = fs.readFileSync('src/app/pit-management/layout.tsx', 'utf-8');

// Header bar: the buttons can wrap poorly on mobile
// Make the "تسجيل دفعة" and "تسجيل تجربة" buttons stack on very small screens
layout = layout.replace(
  '<div className="flex items-center gap-2">',
  '<div className="flex items-center gap-2 flex-wrap">'
);

// The main header container - make it more mobile friendly
layout = layout.replace(
  '<div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">',
  '<div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">'
);

// The title with long Supabase badge - make it wrap
layout = layout.replace(
  '<h1 className="text-lg font-black text-emerald-950 flex items-center gap-2">',
  '<h1 className="text-base sm:text-lg font-black text-emerald-950 flex flex-wrap items-center gap-2">'
);

// The sidebar: on mobile (grid-cols-1), the sticky sidebar should not be sticky
layout = layout.replace(
  '<div className="bg-emerald-50/90 border border-emerald-200/70 rounded-3xl p-4 shadow-xl backdrop-blur-md sticky top-36">',
  '<div className="bg-emerald-50/90 border border-emerald-200/70 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xl backdrop-blur-md lg:sticky lg:top-36">'
);

// On mobile, sidebar nav could be horizontal scrollable or 2-col grid
// Make the sidebar nav items a horizontal scroll on mobile
layout = layout.replace(
  '<nav className="space-y-1.5">',
  '<nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">'
);

// Nav item links: make them shrink-0 on mobile for the horizontal scroll
layout = layout.replace(
  /className=\{`flex items-start gap-3 p-3 rounded-2xl transition-all \$\{/g,
  'className={`flex items-start gap-3 p-3 rounded-2xl transition-all shrink-0 lg:shrink ${'
);

// The "data flow" info box at bottom of sidebar - hide on mobile, it's too much info
layout = layout.replace(
  '<div className="mt-6 p-3.5 rounded-2xl bg-emerald-100/40 border border-emerald-200/60 text-[11px] text-emerald-700/80 space-y-1">',
  '<div className="hidden lg:block mt-6 p-3.5 rounded-2xl bg-emerald-100/40 border border-emerald-200/60 text-[11px] text-emerald-700/80 space-y-1">'
);

// The Supabase badge: hide on small screens
layout = layout.replace(
  '<span className="text-[10px] bg-emerald-200/80 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-300/60 font-semibold">',
  '<span className="hidden sm:inline text-[10px] bg-emerald-200/80 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-300/60 font-semibold">'
);

// Description under title: text-xs on mobile is fine, but line can be too long
layout = layout.replace(
  '<p className="text-xs text-emerald-700/80 font-medium">',
  '<p className="text-[10px] sm:text-xs text-emerald-700/80 font-medium">'
);

fs.writeFileSync('src/app/pit-management/layout.tsx', layout, 'utf-8');
console.log("pit-management/layout.tsx mobile fixes applied!");

// ============================================================
// MOBILE FIX 3: layout.tsx (footer & team)
// ============================================================
let rootLayout = fs.readFileSync('src/app/layout.tsx', 'utf-8');

// Footer grid: md:grid-cols-4 → grid-cols-1 sm:grid-cols-2 md:grid-cols-4
rootLayout = rootLayout.replace(
  '<div className="grid md:grid-cols-4 gap-8 mb-8">',
  '<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">'
);

// Team section: team members are w-24 h-24 which works, but gap should be smaller on mobile
rootLayout = rootLayout.replace(
  '<div className="flex flex-wrap items-center justify-center gap-3 relative z-10">',
  '<div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 relative z-10">'
);

// Team member boxes: w-24 h-24 → w-20 h-20 sm:w-24 sm:h-24
rootLayout = rootLayout.replace(
  /className="bg-emerald-900\/40 border border-emerald-800\/60 hover:bg-emerald-800 hover:border-emerald-600 rounded-xl w-24 h-24 flex flex-col items-center justify-center gap-1.5 transition-all group shadow-sm"/g,
  'className="bg-emerald-900/40 border border-emerald-800/60 hover:bg-emerald-800 hover:border-emerald-600 rounded-xl w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center gap-1 sm:gap-1.5 transition-all group shadow-sm"'
);

rootLayout = rootLayout.replace(
  'className="bg-emerald-900/20 border border-emerald-900/40 rounded-xl w-24 h-24 flex flex-col items-center justify-center gap-1.5 shadow-sm cursor-default"',
  'className="bg-emerald-900/20 border border-emerald-900/40 rounded-xl w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center gap-1 sm:gap-1.5 shadow-sm cursor-default"'
);

// Footer bottom bar: flex-col on mobile
rootLayout = rootLayout.replace(
  '<div className="border-t border-emerald-800 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-emerald-400/80">',
  '<div className="border-t border-emerald-800 pt-4 sm:pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-emerald-400/80">'
);

fs.writeFileSync('src/app/layout.tsx', rootLayout, 'utf-8');
console.log("layout.tsx mobile fixes applied!");

console.log("All inner page mobile fixes complete!");
