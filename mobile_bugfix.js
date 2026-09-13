const fs = require('fs');

// ============================================================
// MOBILE BUG FIXES - Targeted fixes for specific reported issues
// ============================================================

let page = fs.readFileSync('src/app/page.tsx', 'utf-8');

// ---- FIX 1: Hero CircularSystem radius=110 is still too large for 280px container ----
// On a 280px container, radius 110 pushes nodes outside. Need ~85.
page = page.replace(
  "const radius = 110; // Distance from center - works well for max-w-[280px]",
  "const radius = 85; // Distance from center - fits within max-w-[280px]"
);

// ---- FIX 2: Hero container h-[340px] is not enough when the info card below circle overflows ----
// The absolute info card at top-full causes overlap with the section below.
// Change from aspect-square (which doesn't account for the card below) to a taller container
// and make the info card relative on mobile so it flows naturally.
// Replace the absolute info card with a relative one that doesn't overflow:
page = page.replace(
  '<div className="absolute top-full mt-4 sm:mt-8 lg:mt-12 text-center w-full max-w-xs sm:max-w-sm px-4">',
  '<div className="absolute top-full mt-4 sm:mt-8 lg:mt-12 text-center w-full max-w-xs sm:max-w-sm px-2 sm:px-4">'
);

// Increase mobile hero circle container height to accommodate the info card below
page = page.replace(
  '<div className="lg:w-1/2 w-full h-[340px] sm:h-[400px] lg:h-[600px] relative">',
  '<div className="lg:w-1/2 w-full h-[380px] sm:h-[450px] lg:h-[600px] relative">'
);

// ---- FIX 3: InteractiveTimeline circle - labels get clipped ----
// The w-[220px] circle on mobile with 50% positioning pushes labels off-screen.
// Make the circle container have overflow-visible and give more room.
// Also shrink labels and increase their width.
page = page.replace(
  '<div className="xl:w-1/2 flex justify-center items-center w-full relative h-[320px] sm:h-[500px]">',
  '<div className="xl:w-1/2 flex justify-center items-center w-full relative h-[340px] sm:h-[500px] overflow-visible">'
);

// Node labels: wider on mobile to allow text wrap, smaller font
page = page.replace(
  '<div className="absolute top-full mt-1 sm:mt-3 w-20 sm:w-28 text-center pointer-events-none">',
  '<div className="absolute top-full mt-0.5 sm:mt-3 w-16 sm:w-28 text-center pointer-events-none">'
);

// Node label text: make even smaller on mobile to prevent clipping
page = page.replace(
  /className=\{`text-\[10px\] sm:text-xs font-bold leading-tight \$\{\s*activeStep === idx/,
  'className={`text-[8px] sm:text-xs font-bold leading-tight ${activeStep === idx'
);

// Node icons on InteractiveTimeline: w-10 still clips with labels. Go w-9
page = page.replace(
  /className=\{`w-10 h-10 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg/,
  'className={`w-9 h-9 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg'
);

// ---- FIX 4: InteractiveTimeline details panel - nav overlap ----
// The panel has p-8 on mobile which is too much, and the nav controls can overlap.
page = page.replace(
  'className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden"',
  'className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden"'
);

// ---- FIX 5: Features section - "إدارة الدفعات" card padding too tight ----
// Grid cards p-4 is fine on desktop but on mobile (1 col) they need more space
page = page.replace(
  /className=\{`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border-2 text-right/,
  'className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 border-2 text-right'
);

// ---- FIX 6: Features panel overflow-hidden clips content ----
// The parent container has overflow-hidden which clips visual elements
page = page.replace(
  '<div className="w-full flex flex-col gap-10 py-6 overflow-hidden">',
  '<div className="w-full flex flex-col gap-6 sm:gap-10 py-4 sm:py-6">'
);

// ---- FIX 7: Features nav controls gap-6 causes overlap on mobile ----
page = page.replace(
  '<div className="pt-6 border-t border-slate-100 flex items-center gap-6">',
  '<div className="pt-4 sm:pt-6 border-t border-slate-100 flex items-center justify-between sm:justify-start gap-3 sm:gap-6">'
);

// ---- FIX 8: Problem section stats - reduce padding on mobile to prevent overlap ----
// The p-6 cards with 2xl/3xl numbers can get cramped on very small screens
// Already grid-cols-1 on mobile which is good, but reduce padding for stats cards
page = page.replace(
  /className="bg-white p-6 sm:p-6 md:p-8/g,
  'className="bg-white p-5 sm:p-6 md:p-8'
);

// Make sure the problem section cards aren't using fixed heights
// The motion.div cards: add h-auto to ensure they grow with content
// These already have flex-col which should work. The issue is likely the grid gap.

// ---- FIX 9: Add bottom safe area padding to last sections ----
// The "Why NAWAH" section is the last section before footer
page = page.replace(
  '<section className="py-16 sm:py-32 bg-white text-center">',
  '<section className="py-16 sm:py-32 pb-20 sm:pb-32 bg-white text-center">'
);

fs.writeFileSync('src/app/page.tsx', page, 'utf-8');
console.log("page.tsx targeted fixes applied!");


// ============================================================
// FIX FAB (AIChatWidget) - Move up on mobile, add safe area
// ============================================================
let widget = fs.readFileSync('src/components/AIChatWidget.tsx', 'utf-8');

// FAB button: bottom-6 right-6 → on mobile, move higher and smaller
widget = widget.replace(
  "className={`fixed bottom-6 right-6 w-16 h-16 bg-primary text-emerald-950 rounded-full shadow-2xl flex items-center justify-center z-50 ${isOpen ? 'hidden' : 'flex'}`}",
  "className={`fixed bottom-20 sm:bottom-6 right-4 sm:right-6 w-12 h-12 sm:w-16 sm:h-16 bg-primary text-emerald-950 rounded-full shadow-2xl flex items-center justify-center z-50 ${isOpen ? 'hidden' : 'flex'}`}"
);

// FAB icon: smaller on mobile
widget = widget.replace(
  '<Bot className="w-8 h-8" />',
  '<Bot className="w-6 h-6 sm:w-8 sm:h-8" />'
);

// Chat window: on mobile, full width and positioned better
widget = widget.replace(
  'className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col border border-gray-100 overflow-hidden"',
  'className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[350px] h-[85vh] sm:h-[500px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-50 flex flex-col border border-gray-100 overflow-hidden"'
);

fs.writeFileSync('src/components/AIChatWidget.tsx', widget, 'utf-8');
console.log("AIChatWidget.tsx FAB fixes applied!");


// ============================================================
// globals.css: Add safe-area-inset support
// ============================================================
let css = fs.readFileSync('src/app/globals.css', 'utf-8');

// Add safe-area support if not already present
if (!css.includes('safe-area-inset-bottom')) {
  css += `
/* Safe area for mobile browsers with bottom navigation */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  body {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
`;
  fs.writeFileSync('src/app/globals.css', css, 'utf-8');
  console.log("globals.css safe area added!");
}

console.log("All targeted mobile bug fixes complete!");
