import fs from 'fs';
import path from 'path';

function stripDarkClasses(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf-8');
  // Remove all dark: classes (e.g. dark:bg-slate-950, dark:text-white)
  content = content.replace(/\bdark:[^\s'"`]+\b/g, '');
  // Clean up any double spaces that might have been left
  content = content.replace(/  +/g, ' ');
  fs.writeFileSync(filePath, content);
  console.log(`Stripped dark classes from ${filePath}`);
}

const basePath = path.join(__dirname, 'app/(main)');

stripDarkClasses(path.join(basePath, 'page.tsx'));

const discoverPath = path.join(basePath, 'discover/page.tsx');
if (fs.existsSync(discoverPath)) {
  stripDarkClasses(discoverPath);
} else {
  console.log('Discover page not found at', discoverPath);
}
