
const fs = require("fs");
const page = fs.readFileSync("src/app/page.tsx", "utf-8");
const start = page.indexOf("{/* 5. FEATURES SHOWCASE */}");
const end = page.indexOf("{/* 6. PLATFORM PROCESS");
console.log(page.substring(start, end));

