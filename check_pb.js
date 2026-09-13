
const fs = require("fs");
const p = fs.readFileSync("src/app/page.tsx", "utf-8");
const heroSection = p.substring(p.indexOf("PRODUCT HERO"), p.indexOf("PRODUCT HERO") + 300);
console.log(heroSection);

