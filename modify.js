
const fs = require("fs");

let content = fs.readFileSync("src/app/page.tsx", "utf-8");

const startHero = content.indexOf("{/* 1. PRODUCT HERO */}");
const endHero = content.indexOf("{/* 2. THE PROBLEM (Visual Storytelling) */}");

if (startHero !== -1 && endHero !== -1) {
  const newHero = `{/* 1. PRODUCT HERO */}
      <section className="relative pt-20 pb-20 lg:pt-24 lg:pb-24 bg-white overflow-hidden min-h-[auto] lg:min-h-[720px] flex items-center">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
        
        <div className="container mx-auto px-5 sm:px-6 lg:px-16 relative z-10 max-w-[1440px]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            
            {/* Text Column (40%) */}
            <div className="lg:w-[40%] space-y-6 text-center lg:text-right pt-4 lg:pt-0">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 mb-2"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                „‰’… —ﬁ„Ì… –ﬂÌ…
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="text-[34px] sm:text-[40px] lg:text-[48px] xl:text-[60px] font-black tracking-tight leading-[1.2]"
              >
                „‰ ‰Ê«… «· „—... <br />
                <span className="text-emerald-600">‰’‰⁄ ﬁÌ„…</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-slate-500 leading-[1.8] max-w-[520px] mx-auto lg:mx-0"
              >
                „‰’… —ﬁ„Ì… –ﬂÌ… ·≈œ«—… ‰ÊÏ «· „— Ê«” ﬂ‘«› ›—’ «·«” ›«œ… „‰Â«°  —»ÿ «·»Ì«‰«  Ê«·–ﬂ«¡ «·«’ÿ‰«⁄Ì Ê«·√œ·… «·⁄·„Ì… Ê«· Ã«—» ÊﬁÌ«” «·√À— ›Ì „‰ŸÊ„… Ê«Õœ…° ·œ⁄„ «·«‰ ﬁ«· „‰ «· ⁄«„· „⁄ «·‰ÊÏ ﬂ„Œ·› ≈·Ï «· ⁄«„· „⁄Â ﬂ„Ê—œ ﬁ«»· ··  »⁄ Ê«·œ—«”… Ê«· À„Ì‰.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-6"
              >
                <Link
                  href="/register"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-xl shadow-emerald-600/20 hover:-translate-y-0.5"
                >
                  <span>«»œ√ „⁄ ‰Ê«…</span>
                </Link>
                <Link
                  href="/pit-management/dashboard"
                  className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-8 py-4 rounded-2xl text-sm transition-all"
                >
                  <span>«” ﬂ‘› «·„‰’…</span>
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>

            {/* Visual Column (60%) */}
            <div className="lg:w-[60%] w-full relative flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12 pt-12 lg:pt-0 max-w-[430px] md:max-w-none mx-auto">
              
              {/* Image Box */}
              <div className="relative w-full aspect-square md:w-[420px] lg:w-[520px] max-w-[520px] bg-transparent z-10 rounded-[2rem] overflow-hidden">
                <Image 
                  src="/hero-visual.png" 
                  alt="«·⁄—÷ «·—∆Ì”Ì ·‰Ê«…" 
                  fill 
                  className="object-contain"
                  priority
                />
              </div>

              {/* CircularSystem component */}
              <div className="relative z-20 shrink-0 scale-90 md:scale-100">
                <CircularSystem />
              </div>

            </div>

          </div>
        </div>
      </section>

      `;
  content = content.substring(0, startHero) + newHero + content.substring(endHero);
}

const startTeam = content.indexOf("{/* 9. DEVELOPMENT TEAM */}");
if (startTeam !== -1) {
  content = content.substring(0, startTeam) + "    </div>\\n  );\\n}\\n";
}

fs.writeFileSync("src/app/page.tsx", content, "utf-8");
console.log("Modified page.tsx");

