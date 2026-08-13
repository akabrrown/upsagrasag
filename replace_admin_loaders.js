const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file === 'page.tsx') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const regex = /\{isLoading \? \([\s\S]*?<tr[\s\S]*?colSpan=\{?(\d+)\}?[\s\S]*?<\/tr>\s*\) : /g;
      
      let modified = false;
      content = content.replace(regex, (match, p1) => {
        modified = true;
        return `{isLoading ? (\n                <AdminTableSkeleton columns={${p1}} />\n              ) : `;
      });
      
      if (modified) {
        if (!content.includes('AdminTableSkeleton')) {
          const importStr = `import { AdminTableSkeleton } from '@/components/admin/AdminTableSkeleton';\n`;
          const imports = content.match(/import .* from .*;?\n/g);
          if (imports && imports.length > 0) {
            const lastImport = imports[imports.length - 1];
            content = content.replace(lastImport, lastImport + importStr);
          } else {
             content = importStr + content;
          }
        }
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Modified:', fullPath);
      }
    }
  }
}

processDir('./src/app/admin');
