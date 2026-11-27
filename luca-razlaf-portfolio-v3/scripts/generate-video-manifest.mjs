#!/usr/bin/env node
/**
 * generate-video-manifest.mjs
 * Scans public/videos recursively and writes src/data/videoManifest.json.
 * Run manually via: npm run generate:videos
 * No external dependencies.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const VIDEOS_DIR = path.join(ROOT, 'public', 'videos');
const POSTERS_DIR = path.join(ROOT, 'public', 'posters');
const MANIFEST_OUT = path.join(ROOT, 'src', 'data', 'videoManifest.json');
const LEGACY_MANIFEST_OUT = path.join(ROOT, 'src', 'videoManifest.json');

const VIDEO_EXTS = new Set(['.mp4', '.mov', '.webm']);

// ── Base URL support (e.g. Vercel Blob / Cloudflare R2) ────────────────────
const RAW_BASE_URL = process.env.VITE_VIDEO_BASE_URL || '';
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

function buildVideoUrl(relativePath) {
  const encoded = encodeVideoPath(relativePath);
  if (!BASE_URL) return encoded;
  return `${BASE_URL}${encoded.startsWith('/') ? '' : '/'}${encoded}`;
}

// ── helpers ────────────────────────────────────────────────────────────────

function prettify(name) {
  name = name.replace(/^\d+[\s_\-\.]+/, '');
  name = name.replace(/[_\-]+/g, ' ').trim();
  return name.replace(/\b\w/g, c => c.toUpperCase());
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function mimeForExt(ext) {
  const e = ext.toLowerCase();
  if (e === '.mp4') return 'video/mp4';
  if (e === '.mov') return 'video/quicktime';
  if (e === '.webm') return 'video/webm';
  return 'video/mp4';
}

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function encodeVideoPath(urlPath) {
  return urlPath.split('/').map((seg, i) => i === 0 ? seg : encodeURIComponent(seg)).join('/');
}

// ── ffmpeg / ffprobe detection ───────────────────────────────────────────────

let ffmpegOk = false;
let ffprobeOk = false;

try {
  execSync('ffmpeg -version', { stdio: 'pipe' });
  ffmpegOk = true;
} catch {
  console.warn('\n⚠  ffmpeg not found — will use existing posters in public/posters/ if present.');
}

try {
  execSync('ffprobe -version', { stdio: 'pipe' });
  ffprobeOk = true;
} catch {
  console.warn('⚠  ffprobe not found — video dimensions will be null (computed at runtime by browser).\n');
}

// ── poster generator ────────────────────────────────────────────────────────

function makePoster(videoPath, slug) {
  const existingRelative = `/posters/${slug}.jpg`;
  const existingPath = path.join(POSTERS_DIR, `${slug}.jpg`);

  if (!ffmpegOk) {
    return fs.existsSync(existingPath) ? existingRelative : null;
  }

  try {
    fs.mkdirSync(POSTERS_DIR, { recursive: true });
    execSync(
      `ffmpeg -y -ss 0.5 -i "${videoPath}" -vframes 1 -vf "scale='min(480,iw)':-2" -q:v 4 "${existingPath}"`,
      { stdio: 'pipe' }
    );
    return existingRelative;
  } catch (err) {
    if (fs.existsSync(existingPath)) return existingRelative;
    console.warn(`  ⚠  Could not generate thumbnail for ${path.basename(videoPath)}: ${err.message}`);
    return null;
  }
}

// ── video dimensions via ffprobe ─────────────────────────────────────────────

function getVideoDimensions(videoPath) {
  if (!ffprobeOk) return { width: null, height: null, aspect: null };
  try {
    const raw = execSync(
      `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,codec_tag_string,side_data_list -show_entries stream_tags=rotate -of json "${videoPath}"`,
      { stdio: ['pipe', 'pipe', 'pipe'] }
    ).toString();
    const json = JSON.parse(raw);
    const stream = json.streams?.[0];
    if (!stream) return { width: null, height: null, aspect: null };

    let w = stream.width;
    let h = stream.height;

    const rotateTag = stream.tags?.rotate ?? stream.side_data_list?.[0]?.rotation;
    const rotate = rotateTag ? Math.abs(parseInt(rotateTag, 10)) : 0;
    if (rotate === 90 || rotate === 270) {
      [w, h] = [h, w];
    }

    const aspect = w && h ? parseFloat((w / h).toFixed(4)) : null;
    return { width: w ?? null, height: h ?? null, aspect };
  } catch {
    return { width: null, height: null, aspect: null };
  }
}

// ── scan one folder for video files ─────────────────────────────────────────

function scanFolder(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const fileMap = new Map();
  for (const e of entries) {
    if (!e.isFile()) continue;
    const ext = path.extname(e.name).toLowerCase();
    if (!VIDEO_EXTS.has(ext)) continue;
    const base = e.name.slice(0, e.name.length - path.extname(e.name).length);
    const existing = fileMap.get(base);
    if (!existing) {
      fileMap.set(base, { name: e.name, ext });
    } else {
      if (ext === '.mp4') fileMap.set(base, { name: e.name, ext });
    }
  }

  return [...fileMap.values()].sort((a, b) => naturalSort(a.name, b.name));
}

// ── main ─────────────────────────────────────────────────────────────────────

function buildManifest() {
  // Fail gracefully if public/videos is missing (e.g. on Vercel / CI builds)
  if (!fs.existsSync(VIDEOS_DIR)) {
    console.log(`\nℹ️  "public/videos" not found at ${VIDEOS_DIR}.`);
    console.log(`   Skipping manifest generation. The existing committed manifest will be used.\n`);
    process.exit(0);
  }

  fs.mkdirSync(POSTERS_DIR, { recursive: true });

  const topEntries = fs.readdirSync(VIDEOS_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .sort((a, b) => naturalSort(a.name, b.name));

  const folders = [];
  let heroClips = null;

  for (const topDir of topEntries) {
    const folderName = topDir.name;
    const folderPath = path.join(VIDEOS_DIR, folderName);
    const isHeroFolder = /^hero$/i.test(folderName.trim());
    const folderSlug = slugify(folderName);

    const topFiles = scanFolder(folderPath);
    const heroFiles = topFiles.filter(f => /^hero-\d/i.test(f.name));

    const subEntries = fs.readdirSync(folderPath, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .sort((a, b) => naturalSort(a.name, b.name));

    if (isHeroFolder) {
      const clips = topFiles.map(f => {
        const full = path.join(folderPath, f.name);
        const id = slugify(path.basename(f.name, path.extname(f.name)));
        const poster = makePoster(full, `${folderSlug}--${id}`);
        const dims = getVideoDimensions(full);
        return {
          id,
          title: prettify(path.basename(f.name, path.extname(f.name))),
          src: buildVideoUrl(`/videos/${folderName}/${f.name}`),
          type: mimeForExt(f.ext),
          poster,
          ...dims,
        };
      });
      heroClips = clips.slice(0, 3);
      continue;
    }

    if (subEntries.length > 0) {
      for (const sub of subEntries) {
        const subName = sub.name;
        const subPath = path.join(folderPath, subName);
        const subSlug = slugify(`${folderSlug}-${subName}`);
        const files = scanFolder(subPath);

        const clips = files.map(f => {
          const full = path.join(subPath, f.name);
          const base = path.basename(f.name, path.extname(f.name));
          const id = slugify(`${subSlug}-${base}`);
          const poster = makePoster(full, id);
          const dims = getVideoDimensions(full);
          return {
            id,
            title: prettify(base),
            src: buildVideoUrl(`/videos/${folderName}/${subName}/${f.name}`),
            type: mimeForExt(f.ext),
            poster,
            ...dims,
          };
        });

        if (clips.length > 0) {
          folders.push({ label: prettify(subName), slug: subSlug, clips });
        }
      }
    }

    if (heroFiles.length > 0 && !heroClips) {
      heroClips = heroFiles.slice(0, 3).map(f => {
        const full = path.join(folderPath, f.name);
        const base = path.basename(f.name, path.extname(f.name));
        const id = slugify(base);
        const poster = makePoster(full, `hero-${id}`);
        const dims = getVideoDimensions(full);
        return {
          id,
          title: prettify(base),
          src: buildVideoUrl(`/videos/${folderName}/${f.name}`),
          type: mimeForExt(f.ext),
          poster,
          ...dims,
        };
      });
    }
  }

  if (!heroClips) {
    const rootFiles = scanFolder(VIDEOS_DIR);
    const heroRoot = rootFiles.filter(f => /^hero-\d/i.test(f.name));
    if (heroRoot.length > 0) {
      heroClips = heroRoot.slice(0, 3).map(f => {
        const full = path.join(VIDEOS_DIR, f.name);
        const base = path.basename(f.name, path.extname(f.name));
        const id = slugify(base);
        const poster = makePoster(full, `hero-${id}`);
        const dims = getVideoDimensions(full);
        return {
          id,
          title: prettify(base),
          src: buildVideoUrl(`/videos/${f.name}`),
          type: mimeForExt(f.ext),
          poster,
          ...dims,
        };
      });
    }
  }

  if (!heroClips && folders.length > 0) {
    heroClips = folders[0].clips.slice(0, 3);
  }

  const manifest = { hero: heroClips ?? [], folders };

  fs.mkdirSync(path.dirname(MANIFEST_OUT), { recursive: true });
  fs.writeFileSync(MANIFEST_OUT, JSON.stringify(manifest, null, 2), 'utf8');
  fs.writeFileSync(LEGACY_MANIFEST_OUT, JSON.stringify(manifest, null, 2), 'utf8');

  const totalClips = folders.reduce((s, f) => s + f.clips.length, 0);
  const movClips = folders.flatMap(f => f.clips).filter(c => c.type === 'video/quicktime');
  console.log(`\n✅  Manifest written to src/data/videoManifest.json`);
  console.log(`   ${folders.length} folder(s), ${totalClips} clip(s) total`);
  if (BASE_URL) console.log(`   Base URL: ${BASE_URL}`);
  if (movClips.length) console.log(`   MOV files (${movClips.length})`);
  console.log(`   ffmpeg: ${ffmpegOk ? 'available ✓' : 'not found'}`);
  console.log(`   ffprobe: ${ffprobeOk ? 'available ✓' : 'not found'}\n`);
}

buildManifest();
