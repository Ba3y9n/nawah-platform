
const fs = require("fs");
let page = fs.readFileSync("src/app/page.tsx", "utf-8");
page = page.replace(/from-\\[#fafafa\\]/g, "from-white");
fs.writeFileSync("src/app/page.tsx", page, "utf-8");
console.log("Done");

