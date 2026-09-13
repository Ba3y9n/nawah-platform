const fs = require('fs');
let code = fs.readFileSync('src/app/pit-management/scanner/page.tsx', 'utf-8');

code = code.replace(
  /className="bg-white border border-emerald-200 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"/g,
  'className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"'
);
code = code.replace(/text-emerald-950/g, 'text-slate-900');
code = code.replace(/text-amber-500/g, 'text-slate-500');
code = code.replace(/text-emerald-700/g, 'text-slate-500');
code = code.replace(/border-emerald-200/g, 'border-slate-200');
code = code.replace(/bg-emerald-50\/50/g, 'bg-slate-50');
code = code.replace(/bg-emerald-50/g, 'bg-slate-50');
code = code.replace(/text-emerald-800/g, 'text-slate-800');
code = code.replace(/border-emerald-300/g, 'border-slate-300');
code = code.replace(/bg-emerald-600/g, 'bg-slate-900');
code = code.replace(/hover:bg-emerald-700/g, 'hover:bg-slate-800');
code = code.replace(/text-emerald-600/g, 'text-emerald-600');

fs.writeFileSync('src/app/pit-management/scanner/page.tsx', code, 'utf-8');
console.log("Scanner redesigned");
