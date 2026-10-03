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
    
    // Add import Image from 'next/image' if not present
    if (!content.includes("import Image from 'next/image'") && !content.includes('import Image from "next/image"')) {
      content = content.replace(/(import .*;\n)+/, match => match + "import Image from 'next/image';\n");
    }

    // Replace basic <img /> in admin pages with `<Image ... fill />`
    // We will look for <img src={something} alt={something} className={something} />
    
    // Some are <img src={record.image_url} ... />
    // Some are <img src={imageUrl} ... /> (in previews)
    
    content = content.replace(/<img\s+src=\{([^}]+)\}\s+alt=("[^"]*"|\{[^}]+\})\s+className="([^"]+)"\s*\/>/g, 
      (match, src, alt, className) => {
        // If it's a table preview icon, width/height is better. If it's a full cover, fill is better.
        // Because of the variety of admin previews, `fill` is safer if the container is relative.
        // Let's check if the className contains w-full h-full
        if (className.includes('w-full') && className.includes('h-full')) {
            return `<Image src={${src}} alt=${alt} fill className="${className}" />`;
        } else {
            return `<Image src={${src}} alt=${alt} width={400} height={400} className="${className}" />`;
        }
      });
      
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
