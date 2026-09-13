
const fs = require("fs");
let page = fs.readFileSync("src/app/page.tsx", "utf-8");
const start = page.indexOf("{/* 4x2 Grid Features Selection");
console.log(page.substring(start, start + 2000));

