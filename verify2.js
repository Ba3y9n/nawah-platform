
const fs = require("fs");
const page = fs.readFileSync("src/app/page.tsx", "utf-8");
const widget = fs.readFileSync("src/components/AIChatWidget.tsx", "utf-8");

// Check FAB fix
console.log("FAB bottom-20: " + (widget.includes("bottom-20") ? "OK" : "MISSING"));
console.log("FAB w-12: " + (widget.includes("w-12 h-12") ? "OK" : "MISSING"));
console.log("Chat full-width mobile: " + (widget.includes("w-full sm:w-[350px]") ? "OK" : "MISSING"));

// Check radius fix
console.log("Radius 85: " + (page.includes("radius = 85") ? "OK" : "MISSING"));

// Check overflow-visible
console.log("overflow-visible: " + (page.includes("overflow-visible") ? "OK" : "MISSING"));

// Check label font size 8px
console.log("text-[8px]: " + (page.includes("text-[8px]") ? "OK" : "MISSING"));

// Check panel padding fix
console.log("Panel p-5: " + (page.includes("p-5 sm:p-10") ? "OK" : "MISSING"));

// Check nav controls justify-between
console.log("Nav justify-between: " + (page.includes("justify-between sm:justify-start") ? "OK" : "MISSING"));

// Check Arabic
const checks = ["\u0646\u0648\u0627\u0629", "\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u062f\u0641\u0639\u0627\u062a", "\u0627\u0644\u062e\u0631\u064a\u0637\u0629 \u0627\u0644\u0630\u0643\u064a\u0629"];
checks.forEach(t => console.log("Arabic OK: " + page.includes(t)));

