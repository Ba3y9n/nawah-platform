const fs = require('fs');

let code = fs.readFileSync('src/app/pit-management/batches/new/page.tsx', 'utf-8');
code = code.replace(
  'import { useState } from "react";',
  'import { useState, useEffect } from "react";'
);
fs.writeFileSync('src/app/pit-management/batches/new/page.tsx', code, 'utf-8');
console.log('Added useEffect import to batches/new');
