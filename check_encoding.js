
const fs = require("fs");
let page = fs.readFileSync("src/app/page.tsx", "utf-8");
let layout = fs.readFileSync("src/app/layout.tsx", "utf-8");

const pMatches = page.match(/[^a-zA-Z0-9\s<>{}\[\\]\/()="'\`.,:;\-!%*+]/g);
console.log("Page non-ascii:", Array.from(new Set(pMatches)).join(" "));

const lMatches = layout.match(/[^a-zA-Z0-9\s<>{}\[\\]\/()="'\`.,:;\-!%*+]/g);
console.log("Layout non-ascii:", Array.from(new Set(lMatches)).join(" "));

