
const fs = require("fs");
let page = fs.readFileSync("src/app/page.tsx", "utf-8");

const regex = /<div className="h-10 w-px md:h-px md:w-full bg-emerald-800 relative">[\s\S]*?<\/div>/;
const newLineCode = `<div className="h-10 w-px md:h-px md:w-full bg-emerald-800 relative overflow-hidden flex items-center justify-center">
                       {/* Animated Arrow Desktop (Right to Left) */}
                       <motion.div
                         initial={{ right: "-20%" }}
                         animate={{ right: "120%" }}
                         transition={{ repeat: Infinity, duration: 1.5, delay: idx * 0.2, ease: "linear" }}
                         className="absolute hidden md:block"
                       >
                         <ChevronLeft className="w-5 h-5 text-amber-400" />
                       </motion.div>

                       {/* Animated Arrow Mobile (Top to Bottom) */}
                       <motion.div
                         initial={{ top: "-20%" }}
                         animate={{ top: "120%" }}
                         transition={{ repeat: Infinity, duration: 1.5, delay: idx * 0.2, ease: "linear" }}
                         className="absolute md:hidden"
                       >
                         <ArrowDown className="w-5 h-5 text-amber-400" />
                       </motion.div>
                    </div>`;

if (regex.test(page)) {
    page = page.replace(regex, newLineCode);
    fs.writeFileSync("src/app/page.tsx", page);
    console.log("Success");
} else {
    console.log("Failed");
}

