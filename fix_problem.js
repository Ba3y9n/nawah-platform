
const fs = require("fs");
let page = fs.readFileSync("src/app/page.tsx", "utf-8");

page = page.replace(
    /<section className="py-24 bg-slate-50 border-t border-slate-100">/g,
    `<section className="py-8 bg-emerald-900 border-t border-emerald-950 text-white">`
);

page = page.replace(
    /<section className="py-16 bg-emerald-800 text-white shadow-inner">/g,
    `<section className="py-8 bg-emerald-900 border-t border-emerald-950 text-white">`
);

// We need to fix the text color of the subtitle if it is slate-500
page = page.replace(/text-slate-500 text-lg/g, "text-emerald-100 text-lg");

fs.writeFileSync("src/app/page.tsx", page);
console.log("Success problem");

