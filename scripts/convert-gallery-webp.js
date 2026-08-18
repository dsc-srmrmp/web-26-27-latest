/**
 * scripts/convert-gallery-webp.js
 * Developer Students Club • SRM IST Ramapuram
 *
 * Converts all PNG/JPG gallery assets to compressed WebP format.
 * Run once: node scripts/convert-gallery-webp.js
 *
 * Uses the `sharp` library (already a production dependency).
 * Output WebP files are written alongside originals at ≤800px width.
 */

import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const GALLERY_DIR = join(__dirname, '../src/public/gallery');
const MAX_WIDTH = 800;
const WEBP_QUALITY = 82;

async function convertDir(dir) {
  const entries = await readdir(dir);
  let converted = 0;

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const s = await stat(fullPath);
    if (s.isDirectory()) continue;

    const ext = extname(entry).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

    const nameWithoutExt = basename(entry, ext);
    const outPath = join(dir, `${nameWithoutExt}.webp`);

    try {
      const meta = await sharp(fullPath).metadata();
      const width = Math.min(meta.width || MAX_WIDTH, MAX_WIDTH);

      await sharp(fullPath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(outPath);

      const origKb = Math.round(s.size / 1024);
      const newStat = await stat(outPath);
      const newKb = Math.round(newStat.size / 1024);

      console.log(`✅  ${entry} → ${nameWithoutExt}.webp  [${origKb}KB → ${newKb}KB]`);
      converted++;
    } catch (err) {
      console.error(`❌  Failed to convert ${entry}:`, err.message);
    }
  }

  return converted;
}

console.log('🖼️  Converting gallery images to WebP...\n');
const count = await convertDir(GALLERY_DIR);
console.log(`\n🎉  Done — ${count} file(s) converted.`);
console.log('📝  Update GalleryShowcase.tsx image paths from .png → .webp');
