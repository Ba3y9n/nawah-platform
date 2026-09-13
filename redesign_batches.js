const fs = require('fs');
let code = fs.readFileSync('src/app/pit-management/batches/page.tsx', 'utf-8');

// Replace standard banner with a sleek one if it exists
if (code.includes('bg-amber-50')) {
  const oldBannerRegex = /\{isGuest && \([\s\S]*?\)\}/;
  const newBanner = `{isGuest && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">وضع الزائر</h3>
              <p className="text-sm text-slate-400 mt-1">
                سجل الدفعات مخصص لعرض دفعاتك الخاصة. قم بتسجيل الدخول للبدء.
              </p>
            </div>
          </div>
          <Link href="/login" className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-6 py-3 rounded-xl text-sm transition-colors text-center shrink-0 shadow-sm whitespace-nowrap">
            تسجيل الدخول / إنشاء حساب
          </Link>
        </div>
      )}`;
  code = code.replace(oldBannerRegex, newBanner);
}

// Update the main container and empty state
code = code.replace(
  /className="bg-white border border-emerald-200 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"/g,
  'className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"'
);
code = code.replace(
  /text-emerald-950/g,
  'text-slate-900'
);
code = code.replace(
  /text-amber-500/g,
  'text-slate-500'
);
code = code.replace(
  /text-emerald-700\/80/g,
  'text-slate-500'
);
code = code.replace(
  /bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-emerald-500\/20/g,
  'bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md'
);
code = code.replace(
  /border-emerald-200\/60/g,
  'border-slate-200'
);
code = code.replace(
  /bg-emerald-50\/40/g,
  'bg-slate-50/50'
);

fs.writeFileSync('src/app/pit-management/batches/page.tsx', code, 'utf-8');
console.log("Batches redesigned successfully");
