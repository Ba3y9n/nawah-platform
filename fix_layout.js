
const fs = require("fs");
let layout = fs.readFileSync("src/app/layout.tsx", "utf-8");

layout = layout.substring(0, layout.lastIndexOf("          </div>")) + `          </div>
        </div>
      </section>
      </body>
    </html>
  );
}`;
fs.writeFileSync("src/app/layout.tsx", layout);
console.log("Fixed layout");

