
const fs = require("fs");
const page = fs.readFileSync("src/app/page.tsx", "utf-8");

// Check for broken Arabic
const brokenCount = (page.match(/\?\?\?/g) || []).length;
console.log("Broken Arabic chars: " + brokenCount);

// Check key Arabic texts are intact
const checks = ["äæÇÉ", "ããíÒÇÊ äæÇÉ", "ßíÝ ÊÚãá äæÇÉ", "ÇáãÔßáÉ", "ÇáÃËÑ", "áãÇÐÇ äæÇÉ", "ÅÏÇÑÉ ÇáÏÝÚÇÊ"];
checks.forEach(t => {
  console.log(t + ": " + (page.includes(t) ? "OK" : "MISSING"));
});

// Check for horizontal overflow risks: fixed widths without max-w
const fixedWidths = page.match(/w-\[\d+px\]/g) || [];
console.log("Fixed pixel widths remaining: " + fixedWidths.length);
fixedWidths.forEach(w => console.log("  " + w));

