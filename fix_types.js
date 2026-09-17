const fs = require('fs');

function fixAnyInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace `: any` with `: Record<string, unknown>`
  // This is a naive replacement but works for most of our use cases here
  content = content.replace(/: any>/g, ': Record<string, unknown>>');
  content = content.replace(/: any\)/g, ': Record<string, unknown>)');
  content = content.replace(/: any;/g, ': Record<string, unknown>;');
  content = content.replace(/: any=/g, ': Record<string, unknown>=');
  content = content.replace(/: any\]/g, ': Record<string, unknown>[]');
  
  // For `any` inside type casts
  content = content.replace(/as any/g, 'as Record<string, unknown>');
  
  // Explicit function returns or arg types
  content = content.replace(/item: any/g, 'item: Record<string, unknown>');
  content = content.replace(/dbUser: any/g, 'dbUser: Record<string, unknown>');
  content = content.replace(/u: any/g, 'u: Record<string, unknown>');
  content = content.replace(/err: any/g, 'err: Error');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed any types in ${filePath}`);
}

fixAnyInFile('src/lib/supabase/admin/index.ts');
fixAnyInFile('src/lib/auth.ts');
fixAnyInFile('src/lib/api/helpers.ts');
