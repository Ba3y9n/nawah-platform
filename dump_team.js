
const fs = require("fs");
let layout = fs.readFileSync("src/app/layout.tsx", "utf-8");
const start = layout.indexOf("map((m, i) =>");
console.log(layout.substring(start, start + 800));

