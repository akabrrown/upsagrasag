const fs = require('fs');
const path = require('path');

const adminDir = path.resolve("C:/Users/akaye/Desktop/PROjects/grasag-upsa/frontend/src/app/admin");
const componentsDir = path.resolve("C:/Users/akaye/Desktop/PROjects/grasag-upsa/frontend/src/components");

const hooks = ["useState", "useEffect", "useForm", "useRouter", "useSearchParams"];

function processFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  
  const hasHook = hooks.some(hook => content.includes(hook));
  const hasUseClient = content.trim().startsWith("'use client'") || content.trim().startsWith('"use client"');
  
  if (hasHook && !hasUseClient) {
    console.log(`Adding 'use client' to ${filepath}`);
    const newContent = "'use client';\n\n" + content;
    fs.writeFileSync(filepath, newContent, 'utf8');
  }
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullpath = path.join(dir, file);
    const stat = fs.statSync(fullpath);
    if (stat.isDirectory()) {
      walk(fullpath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      processFile(fullpath);
    }
  });
}

walk(adminDir);
walk(componentsDir);
console.log("Done checking files!");
