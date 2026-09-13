const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf-8');

// ============================================================
// FIX 1: Hero circles too big on laptop - reduce lg radius
// ============================================================
// Current radius on lg: 260, too big. Reduce to 220
page = page.replace(
  'else if (window.innerWidth >= 1024) setRadius(260); // LG',
  'else if (window.innerWidth >= 1024) setRadius(200); // LG'
);

// Also reduce XL slightly
page = page.replace(
  'else if (window.innerWidth >= 1280) setRadius(300); // XL',
  'else if (window.innerWidth >= 1280) setRadius(250); // XL'
);

// 2XL
page = page.replace(
  'if (window.innerWidth >= 1536) setRadius(340); // 2XL',
  'if (window.innerWidth >= 1536) setRadius(280); // 2XL'
);

// ============================================================
// FIX 2: "حجم المورد المحتمل" - add light green background
// ============================================================
page = page.replace(
  '{/* 3. POTENTIAL RESOURCE (Visual Flow) */}\n      <section className="py-14 sm:py-24 bg-white relative overflow-hidden">',
  '{/* 3. POTENTIAL RESOURCE (Visual Flow) */}\n      <section className="py-14 sm:py-24 bg-emerald-50/60 relative overflow-hidden">'
);

// ============================================================
// FIX 3: "كيف تعمل نواة" - change to emerald dark bg for contrast
// ============================================================
page = page.replace(
  '<section id="how-it-works" className="py-14 sm:py-24 lg:py-32 bg-slate-50 relative overflow-hidden">',
  '<section id="how-it-works" className="py-14 sm:py-24 lg:py-32 bg-emerald-950 relative overflow-hidden">'
);

// Fix the title color (was emerald-950 which won't show on dark bg)
page = page.replace(
  '<h2 className="text-3xl font-black text-emerald-950">كيف تعمل نواة؟</h2>',
  '<h2 className="text-3xl font-black text-white">كيف تعمل نواة؟</h2>'
);

// Fix subtitle (was emerald-100 which is fine on dark)
// Already text-emerald-100 which works

// Fix the InteractiveTimeline node labels - they need to be lighter text on dark bg
// The active label is emerald-950 (dark) which won't show on dark bg
// We need to change the label colors inside InteractiveTimeline
page = page.replace(
  "activeStep === idx ? 'text-emerald-950' : 'text-slate-500'",
  "activeStep === idx ? 'text-white' : 'text-emerald-300/70'"
);

// Also fix the num badge colors
page = page.replace(
  "activeStep === idx ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'",
  "activeStep === idx ? 'bg-emerald-400 text-emerald-950' : 'bg-emerald-800/50 text-emerald-300'"
);

// Fix the details panel - it's white bg so it works, but the nodes have white bg
// Node circles: inactive ones have bg-white border which still works on dark bg
// Active ones have emerald-600 which is fine

// The center circle is already emerald-950 which will blend. Add a ring to separate it
page = page.replace(
  '<div className="absolute z-20 w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 xl:w-48 xl:h-48 bg-emerald-950 rounded-full',
  '<div className="absolute z-20 w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 xl:w-48 xl:h-48 bg-emerald-900 rounded-full'
);

// ============================================================
// FIX 4: "مميزات نواة" - change to light emerald bg for contrast
// ============================================================
page = page.replace(
  '<section id="features" className="py-14 sm:py-24 bg-white border-t border-slate-100 relative overflow-hidden">',
  '<section id="features" className="py-14 sm:py-24 bg-emerald-50/50 border-t border-emerald-100/50 relative overflow-hidden">'
);

fs.writeFileSync('src/app/page.tsx', page, 'utf-8');
console.log("All visual fixes applied!");
