const fs = require('fs');

let code = fs.readFileSync('src/app/pit-management/batches/new/page.tsx', 'utf-8');
code = code.replace(
  'import { useState, useRef } from "react";',
  'import { useState, useEffect, useRef } from "react";'
);
fs.writeFileSync('src/app/pit-management/batches/new/page.tsx', code, 'utf-8');
console.log('Fixed useEffect import in batches/new');
