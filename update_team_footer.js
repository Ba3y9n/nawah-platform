
const fs = require("fs");

let page = fs.readFileSync("src/app/page.tsx", "utf-8");
let layout = fs.readFileSync("src/app/layout.tsx", "utf-8");

const teamStart = page.indexOf("{/* 9. DEVELOPMENT TEAM */}");
if (teamStart !== -1) {
    const endSec = page.lastIndexOf("</div>");
    const teamEnd = page.lastIndexOf("</div>", endSec - 1); // Second to last div
    
    let teamSection = page.substring(teamStart, teamEnd);
    
    // Remove from page
    page = page.substring(0, teamStart) + "    </div>\n  );\n}\n";
    fs.writeFileSync("src/app/page.tsx", page);

    // Make squares
    teamSection = teamSection.replace(/p-6 flex flex-col/g, "p-4 aspect-square flex flex-col");
    teamSection = teamSection.replace(/rounded-2xl/g, "rounded-xl");
    teamSection = teamSection.replace(/gap-3/g, "gap-2");
    teamSection = teamSection.replace(/text-sm text-slate-700/g, "text-xs text-slate-700");
    teamSection = teamSection.replace(/text-xs text-blue-600/g, "text-[10px] text-blue-600");
    teamSection = teamSection.replace(`className="py-16 bg-white border-t border-slate-100"`, `className="py-12 bg-white"`);

    // Modify footer
    layout = layout.replace(
        `className="bg-emerald-50 border-t border-emerald-200/60 text-slate-600 py-12"`,
        `className="bg-emerald-950 text-emerald-50 py-12"`
    );
    layout = layout.replace(`text-emerald-950`, `text-white`);
    layout = layout.replace(`text-emerald-700/80`, `text-emerald-200/80`);
    layout = layout.replace(`border-emerald-200/60`, `border-emerald-800`);
    layout = layout.replace(`border-emerald-200/60`, `border-emerald-800`); // 2nd occurrence
    layout = layout.replace(`text-emerald-600/80`, `text-emerald-400/80`);
    layout = layout.replace(`text-slate-600`, `text-emerald-50`);

    // Add to layout
    const footerEnd = layout.indexOf("</footer>") + 9;
    layout = layout.substring(0, footerEnd) + "\n\n" + teamSection + layout.substring(footerEnd);
    fs.writeFileSync("src/app/layout.tsx", layout);
    console.log("Success");
}

