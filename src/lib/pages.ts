import { promises as fs } from 'fs';
import path from 'path';

export async function getPageData(slug: string) {
  const filePath = path.join(process.cwd(), 'src', 'data', 'pages', `${slug}.json`);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading page file for ${slug}:`, err);
    return null;
  }
}
