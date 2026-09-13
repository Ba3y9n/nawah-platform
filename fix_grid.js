
const fs = require("fs");
let page = fs.readFileSync("src/app/page.tsx", "utf-8");

const start = page.indexOf("{/* Horizontal Scrollable Track */}");
const end = page.indexOf("</div>\n    </div>\n  );\n}");

if (start !== -1 && end !== -1) {
  const replacement = `{/* 4x2 Grid Features Selection */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
         {features.map((feature, idx) => (
           <button
             key={idx}
             onClick={() => setActive(idx)}
             className={\`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border-2 text-right \${
               active === idx 
                 ? "bg-emerald-950 border-emerald-950 text-white shadow-xl scale-105 z-10 relative" 
                 : "bg-white border-slate-100 text-slate-500 hover:border-emerald-200 hover:bg-slate-50 hover:-translate-y-1 hover:shadow-md"
             }\`}
           >
             <div className={\`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors \${
               active === idx ? "bg-white/10 text-amber-400" : "bg-slate-50 text-slate-400"
             }\`}>
               <feature.icon className="w-5 h-5" />
             </div>
             <div>
               <div className={\`text-[10px] font-bold tracking-widest uppercase mb-1 \${active === idx ? "text-emerald-400/80" : "text-slate-400"}\`}>
                 {feature.num}
               </div>
               <div className={\`text-sm font-bold leading-tight \${active === idx ? "text-white" : "text-slate-700"}\`}>
                 {feature.title}
               </div>
             </div>
           </button>
         ))}
      </div>`;
      
  page = page.substring(0, start) + replacement + page.substring(end);
  fs.writeFileSync("src/app/page.tsx", page, "utf-8");
  console.log("Grid replaced!");
} else {
  console.log("Could not find boundaries.");
}

