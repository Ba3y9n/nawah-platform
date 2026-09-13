
const fs = require("fs");
const page = fs.readFileSync("src/app/page.tsx", "utf-8");
const start = page.indexOf("{/* 5. FEATURES SHOWCASE");
console.log(page.substring(start, start + 3000));

