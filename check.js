
const fs = require("fs");
let layout = fs.readFileSync("src/app/layout.tsx", "utf-8");
let page = fs.readFileSync("src/app/page.tsx", "utf-8");

console.log("LAYOUT TEAM SECTION:");
const start = layout.indexOf("DEVELOPMENT TEAM");
console.log(layout.substring(start - 50, start + 500));

console.log("PAGE PROBLEM SECTION:");
const pStart = page.indexOf("2. THE PROBLEM");
console.log(page.substring(pStart - 50, pStart + 300));

