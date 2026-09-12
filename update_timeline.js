
const fs = require("fs");
let page = fs.readFileSync("src/app/page.tsx", "utf-8");

// Add useEffect to InteractiveTimeline if not present
if (!page.includes("setInterval(() => {")) {
  // It might already have one inside CircularSystem, but we need one in InteractiveTimeline.
  page = page.replace(
    `const [activeStep, setActiveStep] = useState(0);`,
    `const [activeStep, setActiveStep] = useState(0);\n\n    useEffect(() => {\n      const interval = setInterval(() => {\n        setActiveStep((prev) => (prev + 1) % steps.length);\n      }, 3500);\n      return () => clearInterval(interval);\n    }, [steps.length]);\n`
  );
}

// Reduce space
page = page.replace(
  `min-h-[400px]`,
  `min-h-[250px] lg:min-h-[320px]`
);
page = page.replace(
  `p-10 md:p-16`,
  `p-8 md:p-12`
);
page = page.replace(
  `lg:w-1/3 space-y-4`,
  `lg:w-1/3 space-y-2`
);
page = page.replace(
  `gap-12`,
  `gap-8 lg:gap-12 items-center`
);

fs.writeFileSync("src/app/page.tsx", page);
console.log("Updated InteractiveTimeline");

