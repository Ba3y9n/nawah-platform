
const fs = require("fs");
const b64 = process.argv[2];
const code = Buffer.from(b64, "base64").toString("utf-8");
eval(code);

