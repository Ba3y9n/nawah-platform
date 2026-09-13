
const fs = require("fs");
let layout = fs.readFileSync("src/app/layout.tsx", "utf-8");

const start = layout.indexOf("{/* 9. DEVELOPMENT TEAM */}");
if (start !== -1) {
    const end = layout.lastIndexOf("</body>");
    const newTeamSection = `{/* 9. DEVELOPMENT TEAM */}
      <section className="pb-16 pt-6 bg-emerald-950">
        <div className="container mx-auto px-4 max-w-5xl text-center space-y-8 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#10b981_0%,transparent_70%)] opacity-20 pointer-events-none -top-20" />
          
          <h2 className="text-xs font-bold text-emerald-400/80 tracking-widest uppercase relative z-10">›—Ìﬁ «· ÿÊÌ—</h2>
          
          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            {[
              { name: "»Ì«‰ «·„ÿÌ—Ì", link: "https://www.linkedin.com/in/bayan-almutairi-93a872333?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
              { name: "¬Ì… «·”⁄œ‰Ì", link: "https://www.linkedin.com/in/ayah-alsadany" },
              { name: "Â»Â ⁄»œ«··ÿÌ›", link: "https://www.linkedin.com/in/hibah-alharbi-ab0b2938a?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
              { name: "Õ‰Ì‰ «·ﬁ’Ì—", link: "https://www.linkedin.com/in/haneen-al-qassir-b68aa4387?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
              { name: "Ê›«¡ «·„’—Ì", link: "https://www.linkedin.com/in/wafaa-undefined-975a7829a?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
              { name: "œ. ‰ÃÊÏ «·ŒÿÌ»", link: null }
            ].map((m, i) => (
              m.link ? (
                <a key={i} href={m.link} target="_blank" rel="noopener noreferrer" className="bg-emerald-900/30 border border-emerald-800/50 hover:bg-emerald-800/80 hover:border-emerald-500/80 rounded-2xl w-28 h-28 flex flex-col items-center justify-center gap-2 transition-all group shadow-sm backdrop-blur-sm">
                  <span className="font-bold text-xs text-emerald-100/90 group-hover:text-white transition-colors text-center leading-tight px-1">{m.name}</span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded-full group-hover:bg-emerald-900 transition-colors">LinkedIn</span>
                </a>
              ) : (
                <div key={i} className="bg-emerald-900/10 border border-emerald-900/30 rounded-2xl w-28 h-28 flex flex-col items-center justify-center gap-2 shadow-sm cursor-default backdrop-blur-sm">
                  <span className="font-bold text-xs text-emerald-200/50 text-center leading-tight px-1">{m.name}</span>
                </div>
              )
            ))}
          </div>
        </div>
      </section>
      `;
    layout = layout.substring(0, start) + newTeamSection + "\n      " + layout.substring(end);
    fs.writeFileSync("src/app/layout.tsx", layout);
    console.log("Team applied");
}

