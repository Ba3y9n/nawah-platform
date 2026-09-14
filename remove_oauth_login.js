const fs = require('fs');

let code = fs.readFileSync('src/app/login/page.tsx', 'utf-8');
const regex = /<div className="relative flex items-center py-2">[\s\S]*?<\/div>\s*<\/div>/;
code = code.replace(regex, '');
fs.writeFileSync('src/app/login/page.tsx', code, 'utf-8');
console.log('Removed OAuth from login');
