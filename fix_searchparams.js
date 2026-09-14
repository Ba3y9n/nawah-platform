const fs = require('fs');
let code = fs.readFileSync('src/app/login/page.tsx', 'utf-8');

// Remove useSearchParams import
code = code.replace(/useRouter, useSearchParams/g, 'useRouter');
// Remove searchParams declaration
code = code.replace(/const searchParams = useSearchParams\(\);\n/g, '');
// Change the usage in handleSubmit
code = code.replace(
  /const nextUrl = searchParams.get\('next'\) \|\| '\/pit-management\/dashboard';/g,
  `const urlParams = new URLSearchParams(window.location.search);
        const nextUrl = urlParams.get('next') || '/pit-management/dashboard';`
);

fs.writeFileSync('src/app/login/page.tsx', code, 'utf-8');
console.log("Removed useSearchParams from login page");
