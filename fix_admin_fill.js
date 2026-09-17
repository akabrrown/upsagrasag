const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all page.tsx files in src/app/admin/
const output = execSync('dir /s /b src\\app\\admin\\page.tsx', { encoding: 'utf-8' });
const files = output.split('\n').map(f => f.trim()).filter(f => f);

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace fill with width/height where Image is used
    content = content.replace(/<Image([^>]+)fill/g, (match, prefix) => {
        return `<Image${prefix}width={800} height={800}`;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed fill in ${filePath}`);
    }
  }
});
