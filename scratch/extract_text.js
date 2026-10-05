const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');

async function extractText(imagePath) {
  console.log(`Extracting text from ${imagePath}...`);
  try {
    const result = await Tesseract.recognize(imagePath, 'eng', {
      logger: m => {} // suppress logs
    });
    console.log(`\n--- Text from ${path.basename(imagePath)} ---`);
    console.log(result.data.text);
    console.log('-------------------------------------------\n');
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error);
  }
}

async function main() {
  const images = [
    path.join(__dirname, '..', 'public', 'images', 'resources', 'resource-1.jpg'),
    path.join(__dirname, '..', 'public', 'images', 'resources', 'resource-2.jpg')
  ];
  
  for (const img of images) {
    if (fs.existsSync(img)) {
      await extractText(img);
    } else {
      console.error(`File not found: ${img}`);
    }
  }
}

main().catch(console.error);
