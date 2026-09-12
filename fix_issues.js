
const fs = require("fs");

// 1. Fix Problem Section in page.tsx
let page = fs.readFileSync("src/app/page.tsx", "utf-8");
page = page.replace(
    `      {/* 2. THE PROBLEM (Visual Storytelling) */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">`,
    `      {/* 2. THE PROBLEM (Visual Storytelling) */}
      <section className="py-16 bg-emerald-900 border-t border-emerald-950 text-white">`
);
// Ensure the text is white (it might already be white from the previous bad replace, let us make sure)
page = page.replace(
    `<h2 className="text-3xl font-black text-white">«·„‘ﬂ·…</h2>
            <p className="text-slate-500 text-lg">ﬁÿ«⁄ ÷Œ„`,
    `<h2 className="text-3xl font-black text-white">«·„‘ﬂ·…</h2>
            <p className="text-emerald-100 text-lg">ﬁÿ«⁄ ÷Œ„`
);
// If it was still text-emerald-950:
page = page.replace(
    `<h2 className="text-3xl font-black text-emerald-950">«·„‘ﬂ·…</h2>
            <p className="text-slate-500 text-lg">ﬁÿ«⁄ ÷Œ„`,
    `<h2 className="text-3xl font-black text-white">«·„‘ﬂ·…</h2>
            <p className="text-emerald-100 text-lg">ﬁÿ«⁄ ÷Œ„`
);
fs.writeFileSync("src/app/page.tsx", page);


// 2. Fix Team Section in layout.tsx
let layout = fs.readFileSync("src/app/layout.tsx", "utf-8");

// Change background to match footer and remove top padding so it blends
layout = layout.replace(
    `<section className="py-12 bg-white">`,
    `<section className="pb-12 pt-4 bg-emerald-950">`
);

// Make the heading white
layout = layout.replace(
    `<h2 className="text-2xl font-black text-emerald-950">›—Ìﬁ «· ÿÊÌ—</h2>`,
    `<h2 className="text-lg font-black text-white opacity-50 mb-4">›—Ìﬁ «· ÿÊÌ—</h2>`
);

// We need to replace the mapping of cards to make them very small squares.
const oldCardBlock = `            {[
              { name: "»Ì«‰ «·„ÿÌ—Ì", link: "https://www.linkedin.com/in/bayan-almutairi-93a872333?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
              { name: "¬Ì… «·”⁄œ‰Ì", link: "https://www.linkedin.com/in/ayah-alsadany" },
              { name: "Â»Â ⁄»œ«··ÿÌ›", link: "https://www.linkedin.com/in/hibah-alharbi-ab0b2938a?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
              { name: "Õ‰Ì‰ «·ﬁ’Ì—", link: "https://www.linkedin.com/in/haneen-al-qassir-b68aa4387?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
              { name: "Ê›«¡ «·„’—Ì", link: "https://www.linkedin.com/in/wafaa-undefined-975a7829a?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
              { name: "œ. ‰ÃÊÏ «·ŒÿÌ»", link: null }
            ].map((m, i) => (
              m.link ? (
                <a key={i} href={m.link} target="_blank" rel="noopener noreferrer" className="bg-slate-50 border border-slate-100 hover:border-emerald-500 rounded-xl p-4 aspect-square flex flex-col items-center justify-center gap-2 transition-colors group shadow-sm hover:shadow-md">
                  <span className="font-bold text-xs text-slate-700 group-hover:text-emerald-700 transition-colors">{m.name}</span>
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full">LinkedIn</span>
                </a>
              ) : (
                <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-4 aspect-square flex flex-col items-center justify-center gap-2 shadow-sm cursor-default">
                  <span className="font-bold text-xs text-slate-700">{m.name}</span>
                </div>
              )
            ))}`;

const newCardBlock = `            {[
              { name: "»Ì«‰ «·„ÿÌ—Ì", link: "https://www.linkedin.com/in/bayan-almutairi-93a872333?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
              { name: "¬Ì… «·”⁄œ‰Ì", link: "https://www.linkedin.com/in/ayah-alsadany" },
              { name: "Â»Â ⁄»œ«··ÿÌ›", link: "https://www.linkedin.com/in/hibah-alharbi-ab0b2938a?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
              { name: "Õ‰Ì‰ «·ﬁ’Ì—", link: "https://www.linkedin.com/in/haneen-al-qassir-b68aa4387?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
              { name: "Ê›«¡ «·„’—Ì", link: "https://www.linkedin.com/in/wafaa-undefined-975a7829a?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
              { name: "œ. ‰ÃÊÏ «·ŒÿÌ»", link: null }
            ].map((m, i) => (
              m.link ? (
                <a key={i} href={m.link} target="_blank" rel="noopener noreferrer" className="bg-emerald-900/30 border border-emerald-800/50 hover:border-emerald-500 rounded-lg w-24 h-24 mx-auto flex flex-col items-center justify-center gap-1 transition-colors group">
                  <span className="font-bold text-[11px] text-emerald-100 group-hover:text-white text-center leading-tight">{m.name}</span>
                  <span className="text-[9px] text-emerald-400/70 font-bold">LinkedIn</span>
                </a>
              ) : (
                <div key={i} className="bg-emerald-900/10 border border-emerald-900/30 rounded-lg w-24 h-24 mx-auto flex flex-col items-center justify-center gap-1 cursor-default opacity-70">
                  <span className="font-bold text-[11px] text-emerald-100 text-center leading-tight">{m.name}</span>
                </div>
              )
            ))}`;

layout = layout.replace(oldCardBlock, newCardBlock);

// Also fix the grid to flow these small squares nicely in the center
layout = layout.replace(
    `<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">`,
    `<div className="flex flex-wrap items-center justify-center gap-4">`
);

fs.writeFileSync("src/app/layout.tsx", layout);
console.log("Success");

