
const fs = require("fs");
console.log("Started");
let layout = fs.readFileSync("src/app/layout.tsx", "utf-8");
console.log("Layout length:", layout.length);

