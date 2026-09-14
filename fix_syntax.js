const fs = require('fs');
const files = [
  'src/app/login/page.tsx',
  'src/app/register/page.tsx',
  'src/app/forgot-password/page.tsx',
  'src/app/reset-password/page.tsx',
  'src/components/auth/AuthLayout.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf-8');
    // Replace \` with `
    code = code.replace(/\\`/g, '`');
    // Replace \${ with ${
    code = code.replace(/\\\${/g, '${');
    fs.writeFileSync(file, code, 'utf-8');
  }
});
console.log("Fixed syntax errors");
