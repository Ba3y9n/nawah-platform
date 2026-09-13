
const fs = require("fs");
const page = fs.readFileSync("src/app/page.tsx", "utf-8");
const start = page.indexOf("function InteractiveTimeline() {");
const end = page.indexOf("export default function LandingPage() {");
console.log(page.substring(start, end));

