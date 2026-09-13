
const fs = require("fs");
let page = fs.readFileSync("src/app/page.tsx", "utf-8");
let start = page.indexOf("function InteractiveTimeline");
console.log(page.substring(start, start + 300));

