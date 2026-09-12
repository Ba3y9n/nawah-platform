
const fs = require("fs");
let page = fs.readFileSync("src/app/page.tsx", "utf-8");

page = page.replace(
  "{/* 2. THE PROBLEM (Visual Storytelling) */}\n      <section className=\"py-24 bg-slate-50 border-t border-slate-100\">",
  "{/* 2. THE PROBLEM (Visual Storytelling) */}\n      <section className=\"py-16 bg-emerald-800 text-white shadow-inner\">"
);

page = page.replace(
  `<h2 className="text-3xl font-black text-emerald-950">`,
  `<h2 className="text-3xl font-black text-white">`
);
page = page.replace(
  `<p className="text-slate-500 text-lg">ÞØÇÚ ÖÎã`,
  `<p className="text-emerald-100 text-lg">ÞØÇÚ ÖÎã`
);

fs.writeFileSync("src/app/page.tsx", page);
console.log("Updated problem section");

