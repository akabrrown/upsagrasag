const fs = require('fs');
const path = require('path');

const importLine = "import { AdminTableSkeleton } from '@/components/admin/AdminTableSkeleton';";

// Pages that still have old-style loaders with the spinner+text pattern
const pagesToFix = [
  'tutorials',
  'quick-links', 
  'programs',
  'president',
  'page_contents',
  'academic-programmes',
  'academic-calendar',
];

for (const dirName of pagesToFix) {
  const filePath = path.join('./src/app/admin', dirName, 'page.tsx');
  if (!fs.existsSync(filePath)) {
    console.log('SKIP (not found)', filePath);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('isLoading')) {
    console.log('SKIP (no isLoading)', filePath);
    continue;
  }

  // Find colSpan value from the loading block
  const colSpanMatch = content.match(/colSpan=\{?(\d+)\}?/);
  const cols = colSpanMatch ? colSpanMatch[1] : '4';
  
  // Pattern 1: <tr><td colSpan={N}...>Loading...</td></tr> (table-based)
  const tablePattern = /\{isLoading \? \(\s*<tr[^>]*>\s*<td[^>]*colSpan=\{?\d+\}?[^>]*>[\s\S]*?Loading[\s\S]*?<\/td>\s*<\/tr>\s*\) : /g;
  
  // Pattern 2: <div>...spinner...Loading...</div> (div-based, like academic-programmes)
  const divPattern = /\{isLoading \? \(\s*<div[^>]*>[\s\S]*?Loading[\s\S]*?<\/div>\s*\) : /g;
  
  let modified = false;
  
  content = content.replace(tablePattern, (match) => {
    modified = true;
    return `{isLoading ? (\n                <AdminTableSkeleton columns={${cols}} />\n              ) : `;
  });
  
  if (!modified) {
    content = content.replace(divPattern, (match) => {
      modified = true;
      return `{isLoading ? (\n            <AdminTableSkeleton columns={${cols}} />\n          ) : `;
    });
  }
  
  if (modified && !content.includes("import { AdminTableSkeleton }")) {
    // Add import after the last import
    const lines = content.split('\n');
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trimStart().startsWith('import ')) {
        lastImportIdx = i;
      }
    }
    if (lastImportIdx >= 0) {
      lines.splice(lastImportIdx + 1, 0, importLine);
      content = lines.join('\n');
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('FIXED', filePath, `(columns=${cols})`);
  } else if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('FIXED (import already present)', filePath);
  } else {
    console.log('SKIP (no match)', filePath);
  }
}
