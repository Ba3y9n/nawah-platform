const fs = require('fs');
let code = fs.readFileSync('src/app/pit-management/impact/page.tsx', 'utf-8');

code = code.replace(/className="bg-white border border-emerald-200 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"/g, 'className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"');
code = code.replace(/text-emerald-950/g, 'text-slate-900');
code = code.replace(/text-amber-500/g, 'text-slate-500');
code = code.replace(/text-emerald-700\/80/g, 'text-slate-500');
code = code.replace(/border-emerald-200/g, 'border-slate-200');
code = code.replace(/bg-emerald-50\/40/g, 'bg-slate-50/50');
code = code.replace(/bg-emerald-50/g, 'bg-slate-50');
code = code.replace(/text-emerald-800/g, 'text-slate-800');
code = code.replace(/border-emerald-300/g, 'border-slate-300');
code = code.replace(/bg-emerald-600/g, 'bg-slate-900');
code = code.replace(/text-emerald-600/g, 'text-emerald-600');
code = code.replace(/bg-gradient-to-br from-emerald-50 to-white/g, 'bg-white');

// Add a photo upload area
const imgUploadStr = `{/* MAIN STATS */}`;
const newImgUploadStr = `
      {/* IMPACT IMAGE UPLOAD (Mock) */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm text-center">
        <h3 className="text-lg font-bold text-slate-900 mb-2">صورة الأثر البصري</h3>
        <p className="text-sm text-slate-500 mb-4">وثّق أثر أعمالك بصورة حية للمنتج النهائي أو للمجتمع.</p>
        <div className="border-2 border-dashed border-slate-300 rounded-2xl h-48 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600 transition-colors mb-2">
            <PlusCircle className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-600">انقر لرفع صورة الأثر</p>
          <p className="text-xs text-slate-400">JPG, PNG, GIF</p>
        </div>
      </div>

      {/* MAIN STATS */}`;

if (code.includes(imgUploadStr)) {
  code = code.replace(imgUploadStr, newImgUploadStr);
}

fs.writeFileSync('src/app/pit-management/impact/page.tsx', code, 'utf-8');
console.log("Impact redesigned");
