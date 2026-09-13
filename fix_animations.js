
const fs = require("fs");
let page = fs.readFileSync("src/app/page.tsx", "utf-8");

page = page.replace(/animate-\\[spin_10s_linear_infinite\\]/g, "animate-spin");
page = page.replace(/animate-\\[spin_15s_linear_infinite_reverse\\]/g, "animate-spin"); // Cant easily do reverse without custom class, just spin is fine
page = page.replace(/animate-\\[ping_2s_infinite_0.5s\\]/g, "animate-ping delay-500");
page = page.replace(/animate-\\[shimmer_3s_infinite\\]/g, "animate-pulse");

fs.writeFileSync("src/app/page.tsx", page, "utf-8");
console.log("Fixed animations");

