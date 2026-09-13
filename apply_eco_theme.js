const fs = require('fs');

// Helper to replace content
function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf-8');
  for (const { regex, replace } of replacements) {
    code = code.replace(regex, replace);
  }
  fs.writeFileSync(filePath, code, 'utf-8');
}

// 1. Fix Layout (pit-management/layout.tsx)
replaceInFile('src/app/pit-management/layout.tsx', [
  {
    // Change background of entire pit-management
    regex: /className="min-h-screen bg-slate-50 text-slate-900 font-sans"/,
    replace: 'className="min-h-screen bg-[#f8faf9] text-slate-900 font-sans"' // Very soft eco white
  },
  {
    // New Batch Button
    regex: /bg-emerald-700 hover:bg-emerald-800 text-white/g,
    replace: 'bg-emerald-600 hover:bg-emerald-700 text-white'
  },
  {
    // Sidebar Container
    regex: /bg-white border border-slate-200 rounded-3xl p-3 shadow-sm/g,
    replace: 'bg-white border border-emerald-100/60 rounded-3xl p-3 shadow-xl shadow-emerald-900/5'
  },
  {
    // Active Link State
    regex: /\? "bg-emerald-50 text-emerald-900"/g,
    replace: '? "bg-emerald-50/80 text-emerald-900 font-black border border-emerald-200/50"'
  },
  {
    // Inactive Link State
    regex: /: "text-slate-500 hover:bg-slate-50 hover:text-slate-900"/g,
    replace: ': "text-slate-500 hover:bg-emerald-50/50 hover:text-emerald-800 border border-transparent"'
  },
  {
    // Active Icon Container
    regex: /\? "bg-emerald-200\/50 text-emerald-700" : "bg-slate-100 text-slate-400/g,
    replace: '? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "bg-emerald-50 text-emerald-600/60'
  }
]);

// 2. Fix Dashboard (pit-management/dashboard/page.tsx)
replaceInFile('src/app/pit-management/dashboard/page.tsx', [
  {
    // Remove Emoji
    regex: /<span className="text-3xl">👋<\/span>/g,
    replace: ''
  },
  {
    // Guest Banner
    regex: /bg-slate-900 border border-slate-800/g,
    replace: 'bg-emerald-950 border border-emerald-900'
  },
  {
    // Guest text
    regex: /text-slate-400 mt-1/g,
    replace: 'text-emerald-200/80 mt-1'
  },
  {
    // Guest Button
    regex: /bg-white hover:bg-slate-100 text-slate-900/g,
    replace: 'bg-amber-400 hover:bg-amber-500 text-emerald-950'
  },
  {
    // Welcome Banner Container
    regex: /bg-white border border-slate-200 p-8 rounded-3xl shadow-sm/g,
    replace: 'bg-white border border-emerald-100/60 p-8 rounded-3xl shadow-xl shadow-emerald-900/5 relative overflow-hidden'
  },
  {
    // Welcome Banner - New Batch Button
    regex: /bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shrink-0/g,
    replace: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 shrink-0 relative z-10'
  },
  {
    // Stats Cards Container
    regex: /bg-white border border-slate-200 p-6 rounded-3xl shadow-sm/g,
    replace: 'bg-white border border-emerald-100/60 p-6 rounded-3xl shadow-xl shadow-emerald-900/5'
  },
  {
    // Recent Batches Container
    regex: /bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden/g,
    replace: 'bg-white border border-emerald-100/60 rounded-3xl shadow-xl shadow-emerald-900/5 overflow-hidden'
  }
]);

// 3. Fix Batches (pit-management/batches/page.tsx)
replaceInFile('src/app/pit-management/batches/page.tsx', [
  {
    regex: /bg-slate-900 border border-slate-800/g,
    replace: 'bg-emerald-950 border border-emerald-900'
  },
  {
    regex: /text-slate-400 mt-1/g,
    replace: 'text-emerald-200/80 mt-1'
  },
  {
    regex: /bg-white hover:bg-slate-100 text-slate-900/g,
    replace: 'bg-amber-400 hover:bg-amber-500 text-emerald-950'
  },
  {
    regex: /bg-slate-900 hover:bg-slate-800 text-white/g,
    replace: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
  },
  {
    regex: /bg-white border border-slate-200/g,
    replace: 'bg-white border border-emerald-100/60'
  },
  {
    regex: /shadow-sm/g,
    replace: 'shadow-xl shadow-emerald-900/5'
  }
]);

// 4. Fix Scanner (pit-management/scanner/page.tsx)
replaceInFile('src/app/pit-management/scanner/page.tsx', [
  {
    regex: /bg-white border border-slate-200/g,
    replace: 'bg-white border border-emerald-100/60'
  },
  {
    regex: /shadow-sm/g,
    replace: 'shadow-xl shadow-emerald-900/5'
  }
]);

// 5. Fix Pathways (pit-management/pathways/page.tsx)
replaceInFile('src/app/pit-management/pathways/page.tsx', [
  {
    regex: /bg-white border border-slate-200/g,
    replace: 'bg-white border border-emerald-100/60'
  },
  {
    regex: /shadow-sm/g,
    replace: 'shadow-xl shadow-emerald-900/5'
  },
  {
    regex: /bg-slate-900 text-white/g,
    replace: 'bg-emerald-950 text-white' // Fix the dark boxes in pathways
  }
]);

// 6. Fix Experiments (pit-management/experiments/page.tsx)
replaceInFile('src/app/pit-management/experiments/page.tsx', [
  {
    regex: /bg-slate-900 border border-slate-800/g,
    replace: 'bg-emerald-950 border border-emerald-900'
  },
  {
    regex: /text-slate-400 mt-1/g,
    replace: 'text-emerald-200/80 mt-1'
  },
  {
    regex: /bg-white hover:bg-slate-100 text-slate-900/g,
    replace: 'bg-amber-400 hover:bg-amber-500 text-emerald-950'
  },
  {
    regex: /bg-slate-900 hover:bg-slate-800 text-white/g,
    replace: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
  },
  {
    regex: /bg-white border border-slate-200/g,
    replace: 'bg-white border border-emerald-100/60'
  },
  {
    regex: /shadow-sm/g,
    replace: 'shadow-xl shadow-emerald-900/5'
  }
]);

// 7. Fix Impact (pit-management/impact/page.tsx)
replaceInFile('src/app/pit-management/impact/page.tsx', [
  {
    regex: /bg-white border border-slate-200/g,
    replace: 'bg-white border border-emerald-100/60'
  },
  {
    regex: /shadow-sm/g,
    replace: 'shadow-xl shadow-emerald-900/5'
  }
]);

console.log("Refined Eco-Tech Theme Applied");
