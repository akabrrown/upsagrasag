const fs = require('fs');
const path = require('path');

function walk(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results.push(...walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Simple string replacements for common `<img src={...} ... />` patterns
  // Pattern 1: <img src={something} alt={something} className={something} />
  const imgRegex = /<img\s+src=\{?([^>]+?)\}?\s+alt=\{?([^>]+?)\}?\s+className=\{?([^>]+?)\}?\s*\/>/g;
  const imgRegex2 = /<img\s+src=\{?([^>]+?)\}?\s+alt="([^"]*?)"\s+className=\{?([^>]+?)\}?\s*\/>/g;
  
  // We should just use a general approach to replace `<img ... />` with `<Image fill ... />`
  // But since attributes can be in any order, a regex is tricky.
  // Wait, let's use a simpler, more robust script or just use multi_replace_file_content for precision.
});
