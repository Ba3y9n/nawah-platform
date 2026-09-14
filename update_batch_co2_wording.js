const fs = require('fs');

let code = fs.readFileSync('src/app/pit-management/batches/[id]/page.tsx', 'utf-8');

// Replace CO2 reduction label in batch details
code = code.replace(
  /<span className="text-emerald-300 font-bold text-\[10px\] block uppercase">تقدير حسابي \(Calculated Estimate\):<\/span>/g,
  '<span className="text-emerald-300 font-bold text-[10px] block uppercase">تقدير حسابي محتمل للانبعاثات المتجنبة:</span>'
);

code = code.replace(
  /<p className="text-\[11px\] text-emerald-200\/70">خفض CO2 مكافئ \(معادلة 0\.65 طن\/طن نفايات\)<\/p>/g,
  '<p className="text-[11px] text-emerald-200/70">انبعاثات متجنبة محتملة (معامل تقديري نموذجياً: 0.65 طن CO2e / طن)</p>'
);

fs.writeFileSync('src/app/pit-management/batches/[id]/page.tsx', code, 'utf-8');
console.log('Updated batch details CO2 methodology wording');
