
const fs = require("fs");
let page = fs.readFileSync("src/app/page.tsx", "utf-8");

const marker = "{/* 4. HOW IT WORKS (Interactive Timeline) */}";
const start = page.indexOf(marker);

if (start !== -1) {
    const end = page.indexOf("<div className=\"text-center space-y-4 mb-16\">", start);
    
    const replacement = `{/* 4. HOW IT WORKS (Interactive Timeline) */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-200/20 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Dotted Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] opacity-[0.05] pointer-events-none mix-blend-overlay" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          `;
    
    page = page.substring(0, start) + replacement + page.substring(end);
    fs.writeFileSync("src/app/page.tsx", page);
    console.log("Applied bg successfully");
} else {
    console.log("Could not find the section");
}

