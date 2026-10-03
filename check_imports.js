const fs = require('fs');
const path = require('path');

function walk(dir) {
  const results = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) results.push(...walk(full));
    else if (f === 'page.tsx') results.push(full);
  }
  return results;
}

const pages = walk('./src/app/admin');
for (const p of pages) {
  const content = fs.readFileSync(p, 'utf8');
  if (content.includes('<AdminTableSkeleton')) {
    const hasNamedImport = content.includes("import { AdminTableSkeleton }");
    console.log(hasNamedImport ? 'OK   ' : 'MISS ', p);
  }
}
