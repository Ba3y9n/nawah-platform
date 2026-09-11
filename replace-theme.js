const fs = require('fs');
const path = require('path');

const directories = ['src/app', 'src/components'];

const replacements = {
  'bg-slate-950': 'bg-white',
  'bg-slate-900': 'bg-slate-50',
  'text-white': 'text-emerald-950',
  'text-emerald-300': 'text-emerald-700',
  'text-emerald-400': 'text-emerald-600',
  'bg-emerald-950': 'bg-emerald-50',
  'bg-emerald-900': 'bg-emerald-100',
  'border-emerald-800': 'border-emerald-200',
  'border-emerald-700': 'border-emerald-300',
  'text-slate-200': 'text-slate-700',
  'text-slate-300': 'text-slate-600',
  'text-slate-400': 'text-slate-500',
  'text-emerald-200': 'text-emerald-800',
  'bg-emerald-800': 'bg-emerald-200',
  'bg-emerald-700': 'bg-emerald-300',
  'bg-gray-900': 'bg-gray-50',
  'bg-gray-800': 'bg-gray-100',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const [oldClass, newClass] of Object.entries(replacements)) {
    // Regex to match the class exactly (word boundaries), or at least safely
    const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, newClass);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

directories.forEach(d => {
  const fullPath = path.join(__dirname, d);
  if (fs.existsSync(fullPath)) {
    traverse(fullPath);
  }
});
