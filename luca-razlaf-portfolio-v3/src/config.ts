/**
 * src/config.ts
 * Single source of truth. Video data is derived from the auto-generated manifest.
 */

import manifest from './data/videoManifest.json'

// ── types ─────────────────────────────────────────────────────────────────────

export interface Clip {
  id: string
  title: string
  src: string
  type: string
  poster: string | null
  width: number | null
  height: number | null
  aspect: number | null
}

export interface Folder {
  label: string
  slug: string
  clips: Clip[]
}

// ── base URL resolver (Vite environment variable) ─────────────────────────────

const VIDEO_BASE = (import.meta.env.VITE_VIDEO_BASE_URL || '').replace(/\/+$/, '')

export function resolveVideoUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (!VIDEO_BASE) return url
  return `${VIDEO_BASE}${url.startsWith('/') ? '' : '/'}${url}`
}

// ── derived from manifest ─────────────────────────────────────────────────────

const ART_PRESETS = ['graphite', 'silver', 'obsidian', 'glacier'] as const
type Art = (typeof ART_PRESETS)[number]

export const HERO: { src: string; type: string; poster: string | null }[] =
  (manifest.hero as unknown as Clip[]).slice(0, 3).map(c => ({
    src: resolveVideoUrl(c.src),
    type: c.type,
    poster: c.poster,
  }))

export const FOLDERS: (Folder & { art: Art; seed: number })[] = (
  manifest.folders as unknown as Folder[]
).map((f, i) => ({
  ...f,
  clips: f.clips.map(c => ({
    ...c,
    src: resolveVideoUrl(c.src),
  })),
  art: ART_PRESETS[i % ART_PRESETS.length],
  seed: 7 + i * 5,
}))

// ── static site config ────────────────────────────────────────────────────────

export const SITE = {
  name: 'Luca Razlaf',
  email: 'lucarazlaf@gmail.com',
  instagram: 'https://instagram.com/lu.ca_999',
  handle: '@lu.ca_999',
  whop: 'https://www.whop.com/lucarlz',
}

export const STATS = [{ v: 2, s: ' yrs', l: 'Editing for big creators' }]

export const GROWTH = [
  0.3, 0.7, 1.2, 1.9, 2.6, 3.5, 4.6, 5.8, 7.1, 8.6, 10.2, 12, 14, 16.2,
  18.6, 21.3, 24.3, 27.6, 31.2, 35.2, 39.5, 44, 47, 50,
]

export const TECHNIQUES = [
  {
    img: '/assets/split-strip.jpg',
    n: '01',
    t: 'Vertical Split-Strip',
    d: 'Multiple worlds at once. Hard vertical splits create instant tempo and hold the eye.',
  },
  {
    img: '/assets/cutout.jpg',
    n: '02',
    t: 'Cutout / Picture-in-Picture',
    d: 'A visual break on the beat. Cut-out scenes give key words extra weight and surprise.',
  },
  {
    img: '/assets/diagonal.jpg',
    n: '03',
    t: 'Diagonal Split-Cut',
    d: 'Slanted edges, more pull. Diagonal cuts push forward momentum straight into the transition.',
  },
]

export const FEATURES: [string, string][] = [
  ['Feeling over templates', 'Every cut is placed by timing and emotion, not by a preset.'],
  ['Built for retention', 'Hooks, pacing and pattern breaks designed to keep people watching.'],
  ['Made for creators and brands', 'Podcasts, personal brands, gaming, automotive and more.'],
]

// ── avatar gradients (10 tasteful pairs) ──────────────────────────────────────
const GRADIENTS = [
  'from-violet-500 to-purple-700',
  'from-sky-400 to-blue-600',
  'from-emerald-400 to-teal-600',
  'from-rose-400 to-pink-600',
  'from-amber-400 to-orange-500',
  'from-indigo-400 to-blue-700',
  'from-cyan-400 to-sky-600',
  'from-fuchsia-400 to-purple-600',
  'from-lime-400 to-green-600',
  'from-red-400 to-rose-700',
]
export const AVATAR_GRADIENTS = GRADIENTS

// ── testimonials (placeholder – replace with real testimonials) ───────────────
export interface Testimonial {
  q: string       // quote
  n: string       // first name + last initial e.g. "Jonas B."
  r: string       // generic role e.g. "Podcast host"
  gradient: string // tailwind gradient classes
}

// prettier-ignore
export const TESTIMONIALS: Testimonial[] = [
  // placeholder, replace with real testimonials
  { q: 'Can you make more of these? I honestly love them. Wow, top.', n: 'Jonas B.', r: 'Podcast host', gradient: GRADIENTS[0] },
  { q: 'The edits feel alive. You can feel the energy and rhythm in every cut.', n: 'Marcus H.', r: 'Content creator', gradient: GRADIENTS[1] },
  { q: 'Fast, clear communication and cuts that actually hit the beat. Never going back.', n: 'Elena V.', r: 'Brand founder', gradient: GRADIENTS[2] },
  { q: 'Exactly the look I wanted, and he got it without long briefings. Just sends it.', n: 'Daniel O.', r: 'Automotive creator', gradient: GRADIENTS[3] },
  { q: 'Way better than any AI clip tool we tried. These have real energy, real soul.', n: 'Sophie K.', r: 'Podcast producer', gradient: GRADIENTS[4] },
  { q: 'Top quality, super quick turnaround. Send me the next batch already!', n: 'Tom R.', r: 'Streamer', gradient: GRADIENTS[5] },
  { q: 'My audience noticed the difference right away. The comments were so hyped.', n: 'Lena F.', r: 'Personal brand', gradient: GRADIENTS[6] },
  { q: 'He just understands what makes people stop scrolling. Couldn\'t be happier.', n: 'Chris W.', r: 'Founder', gradient: GRADIENTS[7] },
  { q: 'Sent over raw footage and got pure fire back. Absolutely seamless process.', n: 'Nadia R.', r: 'Agency owner', gradient: GRADIENTS[8] },
  { q: 'The pacing is insane. Feels like a cinematic trailer every single time.', n: 'James O.', r: 'Podcast host', gradient: GRADIENTS[9] },
  { q: 'Zero back and forth needed. Delivered something even better than I imagined.', n: 'Mia H.', r: 'Lifestyle creator', gradient: GRADIENTS[0] },
  { q: 'The pattern breaks on the hooks are incredible. You can feel the human pulse.', n: 'Kai B.', r: 'Gaming creator', gradient: GRADIENTS[1] },
  { q: 'Clean, fast, no revision rounds needed. Best editing experience I\'ve ever had.', n: 'Priya S.', r: 'Business founder', gradient: GRADIENTS[2] },
  { q: 'He edits with genuine passion. You can tell immediately that a human made this.', n: 'Matteo R.', r: 'Automotive creator', gradient: GRADIENTS[3] },
]
