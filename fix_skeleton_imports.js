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

const importLine = "import { AdminTableSkeleton } from '@/components/admin/AdminTableSkeleton';";

const pages = walk('./src/app/admin');
for (const p of pages) {
  let content = fs.readFileSync(p, 'utf8');
  
  // Only process files that use AdminTableSkeleton but don't have the named import
  if (!content.includes('<AdminTableSkeleton')) continue;
  if (content.includes("import { AdminTableSkeleton }")) continue;
  
  // Check if there's a wrong-style import and replace it
  if (content.includes("import AdminTableSkeleton from")) {
    content = content.replace(
      /import AdminTableSkeleton from '@\/components\/admin\/AdminTableSkeleton';/,
      importLine
    );
  } else {
    // No import at all - add it after the last import statement
    const lines = content.split('\n');
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ') || lines[i].startsWith("} from '")) {
        lastImportIdx = i;
      }
    }
    if (lastImportIdx >= 0) {
      lines.splice(lastImportIdx + 1, 0, importLine);
      content = lines.join('\n');
    }
  }
  
  fs.writeFileSync(p, content, 'utf8');
  console.log('FIXED', p);
}
