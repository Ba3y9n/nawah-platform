const fs = require('fs');

const path = 'src/app/login/page.tsx';
let code = fs.readFileSync(path, 'utf-8');

if (!code.includes('Suspense')) {
  code = code.replace(
    'import { useState } from "react";',
    'import { useState, Suspense } from "react";'
  );
  
  // Wrap the entire AuthLayout in Suspense
  code = code.replace(
    /return \(\s*<AuthLayout>/,
    'return (\n    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>}>\n      <AuthLayout>'
  );
  
  code = code.replace(
    /<\/AuthLayout>\s*\);/,
    '</AuthLayout>\n    </Suspense>\n  );'
  );

  fs.writeFileSync(path, code, 'utf-8');
  console.log("Wrapped login in Suspense");
} else {
  console.log("Already wrapped");
}
