
const fs = require("fs");
let page = fs.readFileSync("src/app/page.tsx", "utf-8");

const regex = /\{\/\*\ 1\.\ PRODUCT\ HERO\ \*\/\}\s*<section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 bg-white overflow-hidden">\s*\{\/\*\ Subtle\ Background\ Pattern\ \*\/\}\s*<div className="absolute inset-0 bg-\[radial-gradient\(#e2e8f0_1px,transparent_1px\)\] \[background-size:24px_24px\] opacity-40"><\/div>/;

const newSection = `{/* 1. PRODUCT HERO */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 bg-slate-50 overflow-hidden">
        
        {/* --- Premium Tech Background --- */}
        {/* 1. Ambient Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-emerald-200/20 rounded-full blur-[120px] pointer-events-none" />
        
        {/* 2. Modern Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#94a3b8_1px,transparent_1px),linear-gradient(to_bottom,#94a3b8_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />`;

if (regex.test(page)) {
    page = page.replace(regex, newSection);
    fs.writeFileSync("src/app/page.tsx", page);
    console.log("Enhanced Hero Background via Regex!");
} else {
    console.log("Failed to match Regex.");
}

