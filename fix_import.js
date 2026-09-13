
const fs = require("fs");
let page = fs.readFileSync("src/app/page.tsx", "utf-8");
page = page.replace(
  /} from "lucide-react";/,
  ", ChevronRight } from \"lucide-react\";"
);
fs.writeFileSync("src/app/page.tsx", page, "utf-8");

