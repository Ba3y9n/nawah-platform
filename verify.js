
const fs = require("fs");
const page = fs.readFileSync("src/app/page.tsx", "utf-8");
const checks = [
  ["\u0646\u0648\u0627\u0629", "nawah"],
  ["\u0645\u0645\u064a\u0632\u0627\u062a", "features"],
  ["\u0643\u064a\u0641 \u062a\u0639\u0645\u0644", "how it works"],
  ["\u0627\u0644\u0645\u0634\u0643\u0644\u0629", "problem"],
  ["\u0627\u0644\u0623\u062b\u0631", "impact"],
  ["\u0644\u0645\u0627\u0630\u0627", "why nawah"],
  ["\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u062f\u0641\u0639\u0627\u062a", "batch mgmt"]
];
checks.forEach(([ar, en]) => {
  console.log(en + ": " + (page.includes(ar) ? "OK" : "MISSING"));
});
console.log("File size: " + page.length + " bytes");

