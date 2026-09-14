const fs = require('fs');

const updateInputs = (filePath) => {
  let code = fs.readFileSync(filePath, 'utf-8');
  // Enhance inputs
  code = code.replace(/bg-slate-50 border border-slate-200 rounded-xl py-2\.5/g, 'bg-slate-50/50 border border-slate-200 rounded-2xl py-3 focus:bg-white');
  // Enhance button
  code = code.replace(/w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl/g, 'w-full bg-[#022B1E] hover:bg-[#033D2B] text-white font-bold py-3.5 rounded-2xl');
  // Remove shadows on button if they exist and look cheap
  code = code.replace(/shadow-lg shadow-emerald-600\/20/g, 'shadow-md shadow-[#022B1E]/10');
  
  fs.writeFileSync(filePath, code, 'utf-8');
};

updateInputs('src/app/login/page.tsx');
updateInputs('src/app/register/page.tsx');
console.log('Updated inputs and buttons');
