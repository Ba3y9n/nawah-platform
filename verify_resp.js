
const fs = require("fs");
const p = fs.readFileSync("src/app/page.tsx", "utf-8");

// Key fixes check
const checks = [
  ["radiusPercent = 42", "Timeline radius"],
  ["w-[200px] h-[200px] sm:w-[380px]", "Timeline track"],
  ["w-8 h-8 sm:w-14", "Timeline node size"],
  ["w-20 h-20 sm:w-28", "Timeline center"],
  ["w-[70px] sm:w-28", "Timeline label width"],
  ["text-[7px] sm:text-[11px]", "Timeline label text"],
  ["max-w-[260px] sm:max-w-md", "Hero circle container"],
  ["w-20 h-20 sm:w-28 sm:h-28 lg:w-44", "Hero center node"],
  ["w-10 h-10 sm:w-14 sm:h-14 lg:w-20", "Hero node circles"],
  ["w-[80px] sm:w-[120px]", "Hero label width"],
  ["pb-28 sm:pb-40", "Hero bottom padding"],
];

checks.forEach(([str, label]) => {
  console.log(label + ": " + (p.includes(str) ? "OK" : "MISSING"));
});

// Arabic check
["\u0646\u0648\u0627\u0629","\u0627\u0644\u062e\u0631\u064a\u0637\u0629 \u0627\u0644\u0630\u0643\u064a\u0629","\u0627\u0643\u062a\u0634\u0627\u0641 \u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645\u0627\u062a"].forEach(t => {
  console.log("Arabic: " + (p.includes(t) ? "OK" : "MISSING"));
});

