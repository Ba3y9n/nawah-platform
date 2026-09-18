
const fs = require("fs");

let layout = fs.readFileSync("src/app/layout.tsx", "utf-8");
layout = layout.replace("\\n      </body>", "\n      </body>\n    </html>\n  );\n}");
fs.writeFileSync("src/app/layout.tsx", layout);

let page = fs.readFileSync("src/app/page.tsx", "utf-8");
page = page.replace("          </div>\\n  );\\n}\\n", "    </div>\n  );\n}\n");
fs.writeFileSync("src/app/page.tsx", page);

console.log("Fixed!");

