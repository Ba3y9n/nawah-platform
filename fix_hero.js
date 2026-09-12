
const fs = require("fs");
let content = fs.readFileSync("src/app/page.tsx", "utf-8");

const start = content.indexOf(`            <div className="lg:w-1/2 w-full h-[400px] lg:h-[600px] relative">`);
const end = content.indexOf(`      </section>`, start);

if (start !== -1 && end !== -1) {
  const replacement = `            <div className="lg:w-1/2 w-full relative flex flex-col xl:flex-row items-center justify-center gap-8 lg:gap-12 min-h-[450px] lg:min-h-[620px] pt-12 lg:pt-0 max-w-[480px] xl:max-w-none mx-auto">
              
              <div className="relative z-20 shrink-0 scale-90 lg:scale-100 xl:scale-95">
                <CircularSystem />
              </div>

              <div className="relative w-full aspect-square bg-slate-50/50 rounded-[2rem] overflow-hidden shadow-2xl z-10 border-[8px] border-white flex-grow">
                <Image 
                  src="/hero-visual.png" 
                  alt="äæÇÉ | NAWAH"
                  fill 
                  className="object-contain"
                  priority
                />
              </div>

            </div>

          </div>
        </div>
`;
  content = content.substring(0, start) + replacement + content.substring(end);
  fs.writeFileSync("src/app/page.tsx", content, "utf-8");
  console.log("Success");
} else {
  console.log("Failed", start, end);
}

