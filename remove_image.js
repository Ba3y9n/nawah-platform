
const fs = require("fs");
let content = fs.readFileSync("src/app/page.tsx", "utf-8");

const start = content.indexOf("{/* Hero Visual Image Block */}");
if (start !== -1) {
    const sectionEnd = content.indexOf("</section>", start);
    if (sectionEnd !== -1) {
        // Find the closing div of the container which is right before </section>
        const end = content.lastIndexOf("</div>", sectionEnd);
        content = content.substring(0, start) + content.substring(end);
        fs.writeFileSync("src/app/page.tsx", content, "utf-8");
        console.log("Success");
    } else { console.log("No section end"); }
} else { console.log("No block"); }

