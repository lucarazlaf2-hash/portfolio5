#!/usr/bin/env node
/**
 * convert-mov-to-mp4.mjs
 * For every .mov file in public/videos, converts it to .mp4 using ffmpeg.
 * Originals are moved to _originals/<relative-path> (outside public, not deployed).
 * Skips files that already have an .mp4 counterpart.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const VIDEOS_DIR = path.join(ROOT, 'public', 'videos');
const ORIGINALS_DIR = path.join(ROOT, '_originals');

// ── ffmpeg check ─────────────────────────────────────────────────────────────
try {
  execSync('ffmpeg -version', { stdio: 'pipe' });
} catch {
  console.error('❌  ffmpeg is not installed. Install it first (e.g. brew install ffmpeg).');
  process.exit(1);
}

// ── collect .mov files ───────────────────────────────────────────────────────
function findMovFiles(dir, results = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      findMovFiles(full, results);
    } else if (e.isFile() && /\.mov$/i.test(e.name)) {
      results.push(full);
    }
  }
  return results;
}

const movFiles = findMovFiles(VIDEOS_DIR);
let skipped = 0, converted = 0, failed = 0;

for (const movPath of movFiles) {
  const dir = path.dirname(movPath);
  const base = path.basename(movPath, path.extname(movPath));
  const mp4Path = path.join(dir, `${base}.mp4`);

  if (fs.existsSync(mp4Path)) {
    console.log(`  ⏭  Skip  ${path.relative(ROOT, movPath)} (mp4 exists)`);
    skipped++;
    continue;
  }

  console.log(`  🔄  Converting ${path.relative(ROOT, movPath)} …`);
  try {
    execSync(
      `ffmpeg -y -i "${movPath}" -c:v libx264 -crf 23 -preset medium -vf "scale='min(1080,iw)':-2" -c:a aac -b:a 128k -movflags +faststart "${mp4Path}"`,
      { stdio: 'pipe' }
    );

    // Move original to _originals/<relative path>
    const rel = path.relative(VIDEOS_DIR, movPath);
    const origDest = path.join(ORIGINALS_DIR, rel);
    fs.mkdirSync(path.dirname(origDest), { recursive: true });
    fs.renameSync(movPath, origDest);
    console.log(`  ✅  Done   ${path.relative(ROOT, mp4Path)}`);
    converted++;
  } catch (err) {
    console.error(`  ❌  Failed ${path.relative(ROOT, movPath)}: ${err.message}`);
    failed++;
  }
}

console.log(`\n📊  Summary: ${converted} converted, ${skipped} skipped, ${failed} failed`);
if (converted > 0) {
  console.log(`   Run "npm run manifest" to regenerate the video manifest.`);
}
