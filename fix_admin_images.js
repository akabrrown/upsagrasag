const fs = require('fs');
const path = require('path');

const adminFiles = [
  'src/app/admin/events_programmes/page.tsx',
  'src/app/admin/focus-areas/page.tsx',
  'src/app/admin/leadership/page.tsx',
  'src/app/admin/news_updates/page.tsx',
  'src/app/admin/page_contents/page.tsx',
  'src/app/admin/opportunities/page.tsx',
  'src/app/admin/president/page.tsx',
  'src/app/admin/partners/page.tsx',
  'src/app/admin/hero-slides/page.tsx',
  'src/app/admin/executives/page.tsx',
];

adminFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Find any className that doesn't have 'relative' but is followed by some whitespace/ternary/etc and then an <Image ... fill
    // A safe way is to replace `<div className="something"` with `<div className="something relative"` if it's the direct parent.
    // Instead of parsing, we can just replace the specific class strings from the grep output.
    
    content = content.replace(/className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200"/g, 'className="relative w-16 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200"');
    
    content = content.replace(/className="w-full sm:w-1\/3 aspect-\[3\/4\] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0"/g, 'className="relative w-full sm:w-1/3 aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0"');
    
    content = content.replace(/className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200"/g, 'className="relative w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200"');
    
    content = content.replace(/className="w-full sm:w-1\/3 aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0"/g, 'className="relative w-full sm:w-1/3 aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0"');
    
    // Catch-all regex for the table thumbnail div
    content = content.replace(/<div className="([^"]*w-16[^"]*)"(>\s*\{[^?]+\?\s*\(\s*<Image[^>]+fill)/g, (match, classes, rest) => {
        if (!classes.includes('relative')) {
            return `<div className="${classes} relative"${rest}`;
        }
        return match;
    });

    // Catch-all regex for the modal detail div
    content = content.replace(/<div className="([^"]*w-full sm:w-1\/3[^"]*)"(>\s*\{[^?]+\?\s*\(\s*<Image[^>]+fill)/g, (match, classes, rest) => {
        if (!classes.includes('relative')) {
            return `<div className="${classes} relative"${rest}`;
        }
        return match;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed ${file}`);
    }
  }
});
