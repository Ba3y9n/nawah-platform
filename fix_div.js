
const fs = require("fs");
let page = fs.readFileSync("src/app/page.tsx", "utf-8");

page = page.replace(
  "</div></div>\n    </div>\n  );\n}",
  "</div>\n    </div>\n  );\n}"
);

fs.writeFileSync("src/app/page.tsx", page, "utf-8");
console.log("Fixed divs");

