const fs = require('fs');
let code = fs.readFileSync('src/app/pit-management/pathways/page.tsx', 'utf-8');

code = code.replace(/bg-emerald-50/g, 'bg-slate-50');
code = code.replace(/border-emerald-200/g, 'border-slate-200');
code = code.replace(/border-emerald-300/g, 'border-slate-300');
code = code.replace(/text-emerald-950/g, 'text-slate-900');
code = code.replace(/text-emerald-800/g, 'text-slate-800');
code = code.replace(/text-emerald-700/g, 'text-slate-500');
code = code.replace(/text-emerald-600/g, 'text-emerald-600');
code = code.replace(/text-amber-500/g, 'text-slate-500');
code = code.replace(/text-amber-400/g, 'text-slate-400');
code = code.replace(/border-amber-400/g, 'border-emerald-500');
code = code.replace(/bg-gradient-to-r from-amber-100 to-amber-50/g, 'bg-slate-900 text-white');
code = code.replace(/text-amber-700/g, 'text-emerald-400');
code = code.replace(/bg-amber-400/g, 'bg-slate-900');
code = code.replace(/text-emerald-900/g, 'text-white');
code = code.replace(/hover:bg-amber-500/g, 'hover:bg-slate-800');

fs.writeFileSync('src/app/pit-management/pathways/page.tsx', code, 'utf-8');
console.log("Pathways redesigned");
