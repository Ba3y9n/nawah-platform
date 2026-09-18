
const fs = require("fs");

let content = fs.readFileSync("src/app/layout.tsx", "utf-8");

const startFooter = content.indexOf("<footer");
const endFooter = content.indexOf("</body>");

if (startFooter !== -1 && endFooter !== -1) {
  const newFooterAndTeam = `
        <footer className="bg-white border-t border-slate-100 text-slate-600 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="text-xl font-extrabold text-emerald-950">‰Ê«… | NAWAH</span>
              </div>
              <p className="text-sm text-slate-500">
                „‰’… —ﬁ„Ì… –ﬂÌ… ·≈œ«—… ‰ÊÏ «· „— Ê«” ﬂ‘«› „”«—«  «·«” ›«œ… „‰Â«.
              </p>
              <div className="text-xs text-slate-400">
                &copy; ${new Date().getFullYear()} Ã„Ì⁄ «·ÕﬁÊﬁ „Õ›ÊŸ….
              </div>
            </div>
          </div>
        </footer>

        {/* TEAM SECTION AT THE VERY END */}
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 max-w-6xl text-center space-y-12">
            <h2 className="text-2xl font-black text-emerald-950">›—Ìﬁ «· ÿÊÌ—</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: "»Ì«‰ «·„ÿÌ—Ì", link: "https://www.linkedin.com/in/bayan-almutairi-93a872333?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
                { name: "¬Ì… «·”⁄œ‰Ì", link: "https://www.linkedin.com/in/ayah-alsadany" },
                { name: "Â»Â ⁄»œ«··ÿÌ›", link: "https://www.linkedin.com/in/hibah-alharbi-ab0b2938a?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
                { name: "Õ‰Ì‰ «·ﬁ’Ì—", link: "https://www.linkedin.com/in/haneen-al-qassir-b68aa4387?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
                { name: "Ê›«¡ «·„’—Ì", link: "https://www.linkedin.com/in/wafaa-undefined-975a7829a?utm_source=share_via&utm_content=profile&utm_medium=member_ios" },
                { name: "œ. ‰ÃÊÏ «·ŒÿÌ»", link: null }
              ].map((m, i) => (
                m.link ? (
                  <a key={i} href={m.link} target="_blank" rel="noopener noreferrer" className="bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:shadow-md group">
                    <span className="font-bold text-sm text-slate-700 group-hover:text-emerald-700 transition-colors">{m.name}</span>
                    <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">LinkedIn</span>
                  </a>
                ) : (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm cursor-default opacity-80">
                    <span className="font-bold text-sm text-slate-700">{m.name}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        </section>
        `;
  content = content.substring(0, startFooter) + newFooterAndTeam + "\\n      </body>";
}

fs.writeFileSync("src/app/layout.tsx", content, "utf-8");
console.log("Modified layout.tsx");

