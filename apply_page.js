
const fs = require("fs");
let page = fs.readFileSync("src/app/page.tsx", "utf-8");

// A. Potential Resource
const resStart = page.indexOf("{/* 3. POTENTIAL RESOURCE");
const resEnd = page.indexOf("{/* 4. HOW IT WORKS");
if (resStart !== -1 && resEnd !== -1) {
    const newResSection = `{/* 3. POTENTIAL RESOURCE (Visual Flow) */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Subtle decorative circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-3xl font-black text-emerald-950 tracking-tight">ÕÃ„ «·„Ê—œ «·„Õ „·</h2>
            <p className="text-emerald-600/80 text-lg font-bold">„‰ ﬂ· À„—…... „Ê—œ Ì” Õﬁ «·œ—«”…</p>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden max-w-4xl mx-auto relative">
             <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100">
                
                <div className="p-10 text-center flex flex-col justify-center items-center gap-4 bg-white relative group">
                   <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                     <span className="font-black text-2xl">1</span>
                   </div>
                   <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">≈‰ «Ã «· „Ê— »«·„„·ﬂ…</span>
                   <span className="text-3xl font-black text-emerald-950 dir-ltr">1.92M</span>
                   
                   {/* Mobile connector */}
                   <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center md:hidden z-20">
                     <ArrowDown className="w-4 h-4 text-emerald-400" />
                   </div>
                   {/* Desktop connector */}
                   <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 bg-white border border-slate-100 rounded-full hidden md:flex items-center justify-center z-20">
                     <ChevronLeft className="w-4 h-4 text-emerald-400" />
                   </div>
                </div>
                
                <div className="p-10 text-center flex flex-col justify-center items-center gap-4 bg-slate-50/50 relative group">
                   <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                     <span className="font-black text-2xl">2</span>
                   </div>
                   <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">‰”»… «·‰ÊÏ „‰ «·À„—…</span>
                   <span className="text-3xl font-black text-emerald-950 dir-ltr">? 10%</span>
                   
                   {/* Mobile connector */}
                   <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center md:hidden z-20">
                     <ArrowDown className="w-4 h-4 text-emerald-400" />
                   </div>
                   {/* Desktop connector */}
                   <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 bg-white border border-slate-100 rounded-full hidden md:flex items-center justify-center z-20">
                     <ChevronLeft className="w-4 h-4 text-emerald-400" />
                   </div>
                </div>
                
                <div className="p-10 text-center flex flex-col justify-center items-center bg-emerald-900 text-white shadow-inner relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-400/20 transition-colors duration-700" />
                   <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                   
                   <span className="text-emerald-100/80 text-sm font-bold mb-6 relative z-10 uppercase tracking-widest">ÕÃ„ «·‰ÊÏ «·„Õ „·</span>
                   <span className="text-6xl font-black text-amber-400 dir-ltr relative z-10 drop-shadow-md tracking-tighter">192K</span>
                   <span className="text-emerald-50 font-bold mt-4 text-xs relative z-10 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/5">ÿ‰ ( ﬁœÌ— ‰Ÿ—Ì)</span>
                </div>

             </div>
             
             <div className="p-5 bg-slate-50 text-center border-t border-slate-100">
                 <span className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto block">„·«ÕŸ…: Â–«  ﬁœÌ— Õ”«»Ì „»‰Ì ⁄·Ï ‰”»… „‰‘Ê—… ›Ì «·œ—«”« ° Ê·Ì” ≈Õ’«∆Ì… —”„Ì… ·ﬂ„Ì… ‰ÊÏ «· „— «·„ Œ·›… ›⁄·Ì« ›Ì «·„„·ﬂ…. ÊÂÊ ÌÊ÷Õ ÕÃ„ «·›—’… «·„Õ „·… ·œ—«”… Ê À„Ì‰ ‰ÊÏ «· „—.</span>
             </div>
          </div>
        </div>
      </section>
  
      `;
    page = page.substring(0, resStart) + newResSection + page.substring(resEnd);
}

// B. Features Showcase
const featStart = page.indexOf("{/* 5. FEATURES SHOWCASE");
const featEnd = page.indexOf("{/* 6. PLATFORM PROCESS");
if (featStart !== -1 && featEnd !== -1) {
    const newFeatSection = `{/* 5. FEATURES SHOWCASE */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-black text-emerald-950">„„Ì“«  ‰Ê«…</h2>
            <p className="text-emerald-600/70 text-lg font-bold">„‰ŸÊ„… Ê«Õœ… »œ· »Ì«‰«  „ ›—ﬁ…</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "≈œ«—… «·œ›⁄« ", icon: Database, desc: " ”ÃÌ· Ê  »⁄ »Ì«‰«  «· Ê—Ìœ Ê«·„⁄«·Ã…" },
              { title: "«·–ﬂ«¡ «·«’ÿ‰«⁄Ì", icon: BrainCircuit, desc: " Õ·Ì· Ê Êﬁ⁄ «·›—’ Ê«·„”«—« " },
              { title: "ﬁ«⁄œ… «·√œ·…", icon: BookOpen, desc: "„ﬂ »… «·√»Õ«À «·⁄·„Ì… «·„ÊÀﬁ…" },
              { title: "≈œ«—… «· Ã«—»", icon: TestTube2, desc: " ÊÀÌﬁ ‰ «∆Ã «·„⁄«·Ã… «·„Œ»—Ì…" },
              { title: "«·Œ—Ìÿ… «·–ﬂÌ…", icon: Map, desc: " Ê“Ì⁄ «·„’«œ— Ê«·„’«‰⁄ Ã€—«›Ì«" },
              { title: "·ÊÕ… «·»Ì«‰« ", icon: LayoutDashboard, desc: "„ƒ‘—«  √œ«¡ Ê Õ·Ì·«  ›Ê—Ì…" },
              { title: "ﬁÌ«” «·√À—", icon: LineChart, desc: "  »⁄ «·⁄Ê«∆œ «·»Ì∆Ì… Ê«·«ﬁ ’«œÌ…" },
              { title: "«·  »⁄ ⁄»— QR", icon: QrCode, desc: "„”Õ ”—Ì⁄ ·„⁄·Ê„«  «·‘Õ‰« " },
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                className="group relative flex flex-col p-6 rounded-3xl bg-white border border-slate-100 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-emerald-950 mb-2 group-hover:text-emerald-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
  
      `;
    page = page.substring(0, featStart) + newFeatSection + page.substring(featEnd);
}

fs.writeFileSync("src/app/page.tsx", page);
console.log("Page applied");

