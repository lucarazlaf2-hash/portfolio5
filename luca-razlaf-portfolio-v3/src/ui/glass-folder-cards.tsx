"use client"

import * as React from "react"

export type ArtPreset = "graphite" | "silver" | "obsidian" | "glacier"

export type ArtRecipe = {
  style: "marble" | "streak"
  colors: string[]
  scale?: number
  warp?: number
  angle?: number
  gloss?: number
  veins?: number
}

export type FolderArt = ArtPreset | ArtRecipe | "none"

export type FolderFile = {
  name: string
  meta?: string
  art?: ArtPreset | ArtRecipe
  image?: string
  href?: string
  projectId?: string
}

export type FolderMenuItem = {
  label: string
  onSelect?: () => void
  danger?: boolean
}

export type GlassFolderProps = {
  label?: string
  meta?: string
  tone?: "light" | "dark"
  art?: FolderArt
  seed?: number
  image?: string
  files?: FolderFile[]
  action?: "add" | "more" | "none"
  onAdd?: (files: FolderFile[]) => FolderFile | void
  onFilesChange?: (files: FolderFile[]) => void
  menu?: FolderMenuItem[]
  labelPlacement?: "bottom-left" | "top-left" | "top-right"
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onFileSelect?: (file: FolderFile, index: number) => void
  width?: number
  appear?: boolean
  appearDelay?: number
  className?: string
  style?: React.CSSProperties
  onFolderClick?: () => void
}

export const ART_PRESETS: Record<ArtPreset, ArtRecipe> = {
  graphite: {
    style: "streak",
    colors: ["#0b0c0e", "#1e2026", "#52525b", "#27272a", "#f4f5f7", "#14161a"],
    scale: 0.72,
    warp: 1.45,
    angle: -0.58,
    gloss: 0.34,
    veins: 0.2,
  },
  silver: {
    style: "streak",
    colors: ["#14161a", "#2a2d35", "#d4d4d8", "#f4f5f7", "#52525b", "#0b0c0e"],
    scale: 0.68,
    warp: 1.5,
    angle: 0.35,
    gloss: 0.3,
    veins: 0,
  },
  obsidian: {
    style: "marble",
    colors: ["#0b0c0e", "#1c1f26", "#454b59", "#14161a", "#e4e4e7", "#71717a"],
    scale: 0.66,
    warp: 3.1,
    angle: -0.4,
    gloss: 0.45,
    veins: 0.4,
  },
  glacier: {
    style: "streak",
    colors: ["#f4f5f7", "#d4d4d8", "#a1a1aa", "#ffffff", "#e4e4e7", "#f4f5f7"],
    scale: 0.7,
    warp: 1.6,
    angle: 0.35,
    gloss: 0.25,
    veins: 0,
  },
}

export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, "")
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  const n = /^[0-9a-f]{6}$/i.test(h) ? parseInt(h, 16) : 0x808080
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

function makeFbm(seed: number): (x: number, y: number, octaves: number) => number {
  const r = rng(seed)
  const perm = new Uint8Array(512)
  const grad = new Float32Array(512)
  const p: number[] = []
  for (let i = 0; i < 256; i++) p.push(i)
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    const t = p[i]
    p[i] = p[j]
    p[j] = t
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
  for (let i = 0; i < 256; i++) {
    const a = r() * Math.PI * 2
    grad[i * 2] = Math.cos(a)
    grad[i * 2 + 1] = Math.sin(a)
  }
  const noise = (x: number, y: number): number => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const xf = x - xi
    const yf = y - yi
    const X = xi & 255
    const Y = yi & 255
    const h00 = perm[X + perm[Y]] * 2
    const h10 = perm[X + 1 + perm[Y]] * 2
    const h01 = perm[X + perm[Y + 1]] * 2
    const h11 = perm[X + 1 + perm[Y + 1]] * 2
    const d00 = grad[h00] * xf + grad[h00 + 1] * yf
    const d10 = grad[h10] * (xf - 1) + grad[h10 + 1] * yf
    const d01 = grad[h01] * xf + grad[h01 + 1] * (yf - 1)
    const d11 = grad[h11] * (xf - 1) + grad[h11 + 1] * (yf - 1)
    const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10)
    const v = yf * yf * yf * (yf * (yf * 6 - 15) + 10)
    return d00 + u * (d10 - d00) + v * (d01 - d00 + u * (d11 - d01 - d10 + d00))
  }
  return (x, y, octaves) => {
    let sum = 0
    let amp = 0.5
    for (let i = 0; i < octaves; i++) {
      sum += amp * noise(x, y)
      const nx = 1.6 * x + 1.2 * y + 7.1
      y = -1.2 * x + 1.6 * y + 3.3
      x = nx
      amp *= 0.5
    }
    return sum
  }
}

export type ArtJob = {
  width: number
  height: number
  pixels: Uint8ClampedArray
  step: (rows: number) => boolean
}

export function createArtJob(width: number, height: number, recipe: ArtRecipe, seed: number): ArtJob {
  const w = Math.max(1, Math.round(width))
  const h = Math.max(1, Math.round(height))
  const colors = recipe.colors.length >= 2 ? recipe.colors : ["#0b0c0e", "#f4f5f7"]
  const stops = colors.map((c, i) => ({ t: i / (colors.length - 1), c: hexToRgb(c) }))
  const scale = recipe.scale ?? 0.7
  const warp = recipe.warp ?? 3
  const gloss = recipe.gloss ?? 0.4
  const veins = recipe.veins ?? 0
  const streak = recipe.style === "streak"
  const fbm = makeFbm(seed * 977 + 13)
  const r = rng(seed + 1)
  const ox = r() * 50
  const oy = r() * 50
  const angle = (recipe.angle ?? 0) + (r() - 0.5) * 0.5
  const ca = Math.cos(angle)
  const sa = Math.sin(angle)
  const m = Math.min(w, h)
  const gw = Math.ceil(w / 2) + 3
  const gh = Math.ceil(h / 2) + 3
  const G = new Float32Array(gw * gh)
  const GQ = new Float32Array(gw * gh)
  const F = new Float32Array(w * h)
  const Q = new Float32Array(w * h)
  const pixels = new Uint8ClampedArray(w * h * 4)
  let row = 0

  const field = (gy: number) => {
    for (let gx = 0; gx < gw; gx++) {
      const u = ((gx - 1) * 2 - w / 2) / m
      const v = ((gy - 1) * 2 - h / 2) / m
      let px = (u * ca - v * sa) * scale
      let py = (u * sa + v * ca) * scale
      if (streak) {
        px *= 0.14
        py *= 2.2
      }
      px += ox
      py += oy
      const qx = fbm(px, py, 3)
      const qy = fbm(px + 5.2, py + 1.3, 3)
      const rx = fbm(px + warp * qx + 1.7, py + warp * qy + 9.2, 3)
      const ry = fbm(px + warp * qx + 8.3, py + warp * qy + 2.8, 3)
      G[gy * gw + gx] = fbm(px + warp * rx, py + warp * ry, 4)
      GQ[gy * gw + gx] = Math.sqrt(qx * qx + qy * qy)
    }
  }

  const upsample = () => {
    const cr = (a: number, b: number, c: number, d: number) => (-a + 9 * b + 9 * c - d) / 16
    const T = new Float32Array(w * gh)
    for (let gy = 0; gy < gh; gy++) {
      const rIdx = gy * gw
      for (let x = 0; x < w; x++) {
        const c = (x >> 1) + 1
        T[gy * w + x] = x & 1 ? cr(G[rIdx + c - 1], G[rIdx + c], G[rIdx + c + 1], G[rIdx + c + 2]) : G[rIdx + c]
      }
    }
    for (let y = 0; y < h; y++) {
      const c = (y >> 1) + 1
      for (let x = 0; x < w; x++) {
        F[y * w + x] =
          y & 1 ? cr(T[(c - 1) * w + x], T[c * w + x], T[(c + 1) * w + x], T[(c + 2) * w + x]) : T[c * w + x]
        const gx = (x >> 1) + 1
        const q0 = GQ[c * gw + gx]
        const qx = x & 1 ? (q0 + GQ[c * gw + gx + 1]) / 2 : q0
        const q1 = y & 1 ? (x & 1 ? (GQ[(c + 1) * gw + gx] + GQ[(c + 1) * gw + gx + 1]) / 2 : GQ[(c + 1) * gw + gx]) : qx
        Q[y * w + x] = (qx + q1) / 2
      }
    }
  }

  const colorize = () => {
    const sample: number[] = []
    const stride = Math.max(1, Math.floor(F.length / 4096))
    for (let i = 0; i < F.length; i += stride) sample.push(F[i])
    sample.sort((a, b) => a - b)
    const lo = sample[Math.floor(sample.length * 0.02)]
    const hi = sample[Math.floor(sample.length * 0.98)]
    const k = 1 / (hi - lo || 1)
    const lx = -0.55
    const ly = -0.65
    const lz = 0.52
    const slope = k * m * 0.012
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x
        let t = (F[i] - lo) * k
        t = t < 0 ? 0 : t > 1 ? 1 : t
        let j = 1
        while (j < stops.length - 1 && stops[j].t < t) j++
        const a = stops[j - 1]
        const b = stops[j]
        let f = (t - a.t) / (b.t - a.t || 1)
        f = f < 0 ? 0 : f > 1 ? 1 : f
        f = f * f * (3 - 2 * f)
        const gx = (F[x < w - 1 ? i + 1 : i] - F[x > 0 ? i - 1 : i]) * slope
        const gy = (F[y < h - 1 ? i + w : i] - F[y > 0 ? i - w : i]) * slope
        const nd = (-gx * lx - gy * ly + lz) / Math.sqrt(gx * gx + gy * gy + 1)
        const spec = Math.pow(nd > 0 ? nd : 0, 24) * gloss * 255
        const silk = 1 + 0.035 * Math.sin(t * 150 + Q[i] * 24)
        const vein = veins * Math.max(0, 1 - Math.abs(Q[i] - 0.42) * 14) * 0.6
        const lit = (0.82 + 0.28 * nd) * silk * (1 - vein)
        pixels[i * 4] = (a.c[0] + (b.c[0] - a.c[0]) * f) * lit + spec
        pixels[i * 4 + 1] = (a.c[1] + (b.c[1] - a.c[1]) * f) * lit + spec
        pixels[i * 4 + 2] = (a.c[2] + (b.c[2] - a.c[2]) * f) * lit + spec
        pixels[i * 4 + 3] = 255
      }
    }
  }

  const step = (rows: number): boolean => {
    if (row >= gh) return true
    const end = Math.min(gh, row + Math.max(1, rows))
    while (row < end) field(row++)
    if (row < gh) return false
    upsample()
    colorize()
    return true
  }

  return { width: w, height: h, pixels, step }
}

export function fanSlot(index: number, count: number): number {
  return count <= 1 ? 0 : (index / (count - 1)) * 2 - 1
}

const recipeOf = (art: ArtPreset | ArtRecipe): ArtRecipe => (typeof art === "string" ? ART_PRESETS[art] : art)

type Painted = HTMLCanvasElement
const artCache = new Map<string, Promise<Painted>>()
const queue: { job: ArtJob; priority: number; done: (c: Painted) => void }[] = []
let pumping = false

function pump() {
  if (pumping) return
  pumping = true
  const tick = () => {
    const until = performance.now() + 7
    while (queue.length && performance.now() < until) {
      const head = queue[0]
      if (head.job.step(4)) {
        queue.shift()
        const c = document.createElement("canvas")
        c.width = head.job.width
        c.height = head.job.height
        c.getContext("2d")?.putImageData(
          new ImageData(head.job.pixels as Uint8ClampedArray<ArrayBuffer>, c.width, c.height),
          0,
          0,
        )
        head.done(c)
      }
    }
    if (queue.length) requestAnimationFrame(tick)
    else pumping = false
  }
  requestAnimationFrame(tick)
}

function paint(recipe: ArtRecipe, seed: number, w: number, h: number, priority: number): Promise<Painted> {
  const key = JSON.stringify([recipe, seed, w, h])
  let p = artCache.get(key)
  if (!p) {
    p = new Promise<Painted>((done) => {
      let at = queue.length
      while (at > 1 && queue[at - 1].priority > priority) at--
      queue.splice(at, 0, { job: createArtJob(w, h, recipe, seed), priority, done })
      pump()
    })
    artCache.set(key, p)
  }
  return p
}

function ArtCanvas({
  art,
  seed,
  w,
  h,
  density,
  priority,
  className,
}: {
  art: ArtPreset | ArtRecipe
  seed: number
  w: number
  h: number
  density: number
  priority: number
  className?: string
}) {
  const ref = React.useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = React.useState(false)
  const recipe = recipeOf(art)
  const key = JSON.stringify(recipe)
  const pw = Math.round(w * density)
  const ph = Math.round(h * density)

  React.useEffect(() => {
    let live = true
    setReady(false)
    paint(JSON.parse(key) as ArtRecipe, seed, pw, ph, priority).then((src) => {
      const c = ref.current
      if (!live || !c) return
      c.width = src.width
      c.height = src.height
      c.getContext("2d")?.drawImage(src, 0, 0)
      setReady(true)
    })
    return () => {
      live = false
    }
  }, [key, seed, pw, ph, priority])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      data-ready={ready || undefined}
      style={{ width: w, height: h, maxWidth: "none" }}
    />
  )
}

const W = 340
const H = 272
const HEADROOM = 54
const FRONT_TOP = 74
const FRONT_H = H - FRONT_TOP
const SHEET_W = 272
const SHEET_H = 184

const BACK_PATH =
  "M0 56A22 22 0 0 1 22 34L146 34C170 34 172 0 198 0L318 0A22 22 0 0 1 340 22L340 250A22 22 0 0 1 318 272L22 272A22 22 0 0 1 0 250Z"
const FRONT_PATH =
  "M0 22A22 22 0 0 1 22 0L118 0C144 0 146 32 172 32L318 32A22 22 0 0 1 340 54L340 " +
  (FRONT_H - 22) +
  "A22 22 0 0 1 318 " +
  FRONT_H +
  "L22 " +
  FRONT_H +
  "A22 22 0 0 1 0 " +
  (FRONT_H - 22) +
  "Z"

const MAX_VISIBLE = 4

const SAMPLE_FILES: FolderFile[] = [
  { name: "Cut 01 — Hook", meta: "00:38 · 1.8M", art: "graphite" },
  { name: "Cut 02 — Pacing", meta: "00:42 · 940K", art: "silver" },
]

export default function GlassFolder({
  label = "Project folder",
  meta,
  tone = "dark",
  art = "silver",
  seed = 3,
  image,
  files: initialFiles = SAMPLE_FILES,
  action = "more",
  onAdd,
  onFilesChange,
  menu = [],
  labelPlacement = "bottom-left",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onFileSelect,
  width = 340,
  appear = true,
  appearDelay = 0,
  className,
  style,
  onFolderClick,
}: GlassFolderProps) {
  const uid = React.useId().replace(/:/g, "")
  const rootRef = React.useRef<HTMLDivElement>(null)
  const filesRef = React.useRef<HTMLDivElement>(null)
  const hitRef = React.useRef<HTMLButtonElement>(null)
  const keyRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)

  const [files, setFiles] = React.useState<FolderFile[]>(initialFiles)
  const ids = React.useRef<number[]>(initialFiles.map((_, i) => i))
  const nextId = React.useRef(initialFiles.length)
  const [dropped, setDropped] = React.useState<number | null>(null)
  const [bump, setBump] = React.useState(0)

  const [openState, setOpenState] = React.useState(defaultOpen)
  const open = openProp ?? openState
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenState(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange],
  )
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [entered, setEntered] = React.useState(!appear)

  const k = width / W
  const density = Math.min(1.5, Math.max(1, typeof window === "undefined" ? 1 : window.devicePixelRatio || 1)) * k

  React.useEffect(() => {
    if (!appear) return
    const el = rootRef.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setEntered(true)
      return
    }
    let t = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        t = window.setTimeout(() => setEntered(true), appearDelay)
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [appear, appearDelay])

  React.useEffect(() => {
    const el = rootRef.current
    if (!el) return
    let raf = 0
    let px = 0
    let py = 0
    const write = () => {
      raf = 0
      el.style.setProperty("--gf-px", px.toFixed(3))
      el.style.setProperty("--gf-py", py.toFixed(3))
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      const r = el.getBoundingClientRect()
      px = ((e.clientX - r.left) / r.width) * 2 - 1
      py = ((e.clientY - r.top) / r.height) * 2 - 1
      if (!raf) raf = requestAnimationFrame(write)
    }
    const leave = () => {
      px = 0
      py = 0
      if (!raf) raf = requestAnimationFrame(write)
    }
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerleave", leave)
    return () => {
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerleave", leave)
      cancelAnimationFrame(raf)
    }
  }, [])

  React.useEffect(() => {
    filesRef.current?.toggleAttribute("inert", !open)
  }, [open])

  React.useEffect(() => {
    if (!open && !menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (menuOpen) {
        setMenuOpen(false)
        keyRef.current?.focus()
      } else {
        setOpen(false)
        hitRef.current?.focus()
      }
    }
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (menuOpen && !menuRef.current?.contains(t) && !keyRef.current?.contains(t)) setMenuOpen(false)
      if (open && !menuOpen && !rootRef.current?.contains(t)) setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onDown)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onDown)
    }
  }, [open, menuOpen, setOpen])

  React.useEffect(() => {
    if (menuOpen) menuRef.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus()
  }, [menuOpen])

  const addFile = () => {
    const made = onAdd?.(files)
    const file: FolderFile = made || { name: "Cut " + (files.length + 1), meta: "Entwurf" }
    const next = [...files, file]
    const id = nextId.current++
    ids.current = [...ids.current, id]
    setFiles(next)
    setDropped(id)
    setBump((b) => b + 1)
    onFilesChange?.(next)
  }

  const menuItems: FolderMenuItem[] = [
    { label: open ? "Close folder" : "Open folder", onSelect: () => setOpen(!open) },
    ...menu,
  ]

  const onMenuKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(menuRef.current?.querySelectorAll("[role=menuitem]") ?? []) as HTMLElement[]
    const at = items.indexOf(document.activeElement as HTMLElement)
    const go = (i: number) => {
      e.preventDefault()
      items[(i + items.length) % items.length]?.focus()
    }
    if (e.key === "ArrowDown") go(at + 1)
    else if (e.key === "ArrowUp") go(at - 1)
    else if (e.key === "Home") go(0)
    else if (e.key === "End") go(items.length - 1)
    else if (e.key === "Tab") setMenuOpen(false)
  }

  const start = Math.max(0, files.length - MAX_VISIBLE)
  const visible = files.slice(start)
  const count = files.length
  const metaLine = meta ?? `${count} ${count === 1 ? "Clip" : "Clips"}`

  return (
    <div
      ref={rootRef}
      className={"gf-root" + (className ? " " + className : "")}
      data-tone={tone}
      data-open={open || undefined}
      data-entered={entered || undefined}
      data-place={labelPlacement}
      style={{ width, height: (H + HEADROOM) * k, ...style }}
    >
      <style>{GF_CSS}</style>
      <div className="gf-stage" style={{ transform: "translateY(" + HEADROOM * k + "px) scale(" + k + ")" }}>
        <div
          className="gf-tilt"
          onClick={(e) => {
            if (onFolderClick) {
              e.stopPropagation()
              onFolderClick()
            }
          }}
          style={{ cursor: onFolderClick ? "pointer" : undefined }}
        >
          <div className="gf-shadow" aria-hidden="true" />

          {/* Back panel */}
          <div className="gf-back" style={{ clipPath: "path('" + BACK_PATH + "')" }} aria-hidden="true">
            {image ? (
              <img className="gf-art" src={image} alt="" width={W + 24} height={H + 24} draggable={false} />
            ) : art !== "none" ? (
              <ArtCanvas className="gf-art" art={art} seed={seed} w={W + 24} h={H + 24} density={density} priority={0} />
            ) : null}
            <div className="gf-back-sheen" />
          </div>
          <svg className="gf-rim gf-back-rim" viewBox={"0 0 " + W + " " + H} aria-hidden="true">
            <path d={BACK_PATH} />
          </svg>

          {/* Liquid frosted front panel */}
          <div
            key={bump}
            className={"gf-front" + (bump ? " gf-front--bump" : "")}
            style={{ clipPath: "path('" + FRONT_PATH + "')" }}
          >
            <div className="gf-tint" aria-hidden="true" />
            <div className="gf-spec" aria-hidden="true" />
            <svg className="gf-rim gf-front-rim" viewBox={"0 0 " + W + " " + FRONT_H} aria-hidden="true">
              <defs>
                <linearGradient id={"gf-rim-" + uid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffffff" stopOpacity="0.52" />
                  <stop offset="0.35" stopColor="#d4d4d8" stopOpacity="0.22" />
                  <stop offset="1" stopColor="#ffffff" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path d={FRONT_PATH} stroke={"url(#gf-rim-" + uid + ")"} />
            </svg>
            <button
              ref={hitRef}
              type="button"
              className="gf-hit"
              aria-expanded={open}
              aria-label={(open ? "Close: " : "Open: ") + label + ", " + count + (count === 1 ? " clip" : " clips")}
              onClick={(e) => {
                if (onFolderClick) {
                  e.stopPropagation()
                  onFolderClick()
                } else {
                  setMenuOpen(false)
                  setOpen(!open)
                }
              }}
            />
            <div className="gf-label">
              <span className="gf-title">{label}</span>
              <span className="gf-meta" key={metaLine}>
                {metaLine}
              </span>
            </div>
          </div>

          {/* Fanned Clip Cards inside liquid folder */}
          <div ref={filesRef} className="gf-files" role="list" aria-label={label + " Inhalt"}>
            {visible.map((file, v) => {
              const id = ids.current[start + v]
              const slot = fanSlot(v, visible.length)
              const jitter = rng(hashString(file.name) + id)
              const picture = !!(file.art || file.image)
              const inner = (
                <>
                  {picture ? (
                    file.image ? (
                      <img className="gf-sheet-art" src={file.image} alt="" width={SHEET_W} height={SHEET_H} draggable={false} />
                    ) : (
                      <ArtCanvas
                        className="gf-sheet-art"
                        art={file.art as ArtPreset | ArtRecipe}
                        seed={hashString(file.name) % 997}
                        w={SHEET_W}
                        h={SHEET_H}
                        density={Math.min(density, 1.25)}
                        priority={1}
                      />
                    )
                  ) : (
                    <span className="gf-lines" aria-hidden="true">
                      <i style={{ width: "86%" }} />
                      <i style={{ width: "92%" }} />
                      <i style={{ width: "64%" }} />
                    </span>
                  )}
                  <span className="gf-sheet-head">
                    <span className="gf-sheet-name">{file.name}</span>
                    {file.meta ? <span className="gf-sheet-meta">{file.meta}</span> : null}
                  </span>
                </>
              )
              const common = {
                className: "gf-sheet" + (picture ? " gf-sheet--art" : "") + (id === dropped ? " gf-sheet--drop" : ""),
                style: {
                  "--gf-slot": slot,
                  "--gf-depth": visible.length - 1 - v,
                  "--gf-jx": ((jitter() - 0.5) * 10).toFixed(2) + "px",
                  "--gf-jr": ((jitter() - 0.5) * 3.2).toFixed(2) + "deg",
                  zIndex: v + 1,
                } as React.CSSProperties,
                onAnimationEnd: id === dropped ? () => setDropped(null) : undefined,
              }
              return (
                <div key={id} role="listitem" className="gf-sheet-slot">
                  {file.href ? (
                    <a {...common} href={file.href} onClick={() => onFileSelect?.(file, start + v)}>
                      {inner}
                    </a>
                  ) : (
                    <button {...common} type="button" onClick={() => onFileSelect?.(file, start + v)}>
                      {inner}
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {action !== "none" ? (
            <button
              ref={keyRef}
              type="button"
              className={"gf-key gf-key--" + action}
              aria-label={action === "add" ? "Add clip to " + label : "Options for " + label}
              aria-haspopup={action === "more" && !onFolderClick ? "menu" : undefined}
              aria-expanded={action === "more" ? menuOpen : undefined}
              aria-controls={action === "more" ? "gf-menu-" + uid : undefined}
              onClick={(e) => {
                if (onFolderClick) {
                  e.stopPropagation()
                  onFolderClick()
                } else if (action === "add") {
                  addFile()
                } else {
                  setMenuOpen((m) => !m)
                }
              }}
            >
              {action === "add" ? (
                <svg key={bump} className="gf-glyph gf-glyph--plus" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 4.5v15M4.5 12h15" />
                </svg>
              ) : (
                <svg className="gf-glyph gf-glyph--more" viewBox="0 0 30 12" aria-hidden="true">
                  <rect x="1" y="1.5" width="8" height="9" rx="3.4" />
                  <rect x="11" y="1.5" width="8" height="9" rx="3.4" />
                  <rect x="21" y="1.5" width="8" height="9" rx="3.4" />
                </svg>
              )}
            </button>
          ) : null}

          {action === "more" ? (
            <div
              ref={menuRef}
              id={"gf-menu-" + uid}
              role="menu"
              aria-label={label + " Optionen"}
              className="gf-menu"
              data-open={menuOpen || undefined}
              onKeyDown={onMenuKey}
            >
              {menuItems.map((item, i) => (
                <button
                  key={item.label + i}
                  type="button"
                  role="menuitem"
                  tabIndex={menuOpen ? -1 : undefined}
                  disabled={!menuOpen}
                  className={"gf-menu-item" + (item.danger ? " gf-menu-item--danger" : "")}
                  onClick={() => {
                    setMenuOpen(false)
                    keyRef.current?.focus()
                    item.onSelect?.()
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

const GF_CSS = `
.gf-root {
  --gf-px: 0;
  --gf-py: 0;
  --gf-ease: cubic-bezier(.16, 1, .3, 1);
  --gf-spring: cubic-bezier(.22, 1.25, .4, 1);
  --gf-hinge: 0deg;
  --gf-lift: 42px;
  --gf-spread: 0px;
  --gf-fan: 0deg;
  --gf-stack: 15px;
  --gf-ink: #0B0C0E;
  --gf-ink-soft: rgba(11, 12, 14, .58);
  --gf-accent: #FFFFFF;
  position: relative;
  display: inline-block;
  flex: none;
  vertical-align: top;
  font-family: var(--font-sans, "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif);
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  isolation: isolate;
}
.gf-root[data-tone="dark"] { --gf-ink: #F4F5F7; --gf-ink-soft: rgba(244, 245, 247, .64); }
.gf-root:hover, .gf-root:focus-within { --gf-hinge: -11deg; --gf-lift: -34px; --gf-spread: 8px; --gf-fan: 1.4deg; --gf-stack: 10px; }
.gf-root[data-open] { --gf-hinge: -24deg; --gf-lift: -96px; --gf-spread: 40px; --gf-fan: 5deg; --gf-stack: 30px; }

.gf-stage {
  position: absolute;
  left: 0;
  top: 0;
  width: 340px;
  height: 272px;
  transform-origin: 0 0;
}
.gf-tilt {
  position: absolute;
  inset: 0;
  transform: perspective(1400px) rotateX(calc(var(--gf-py) * -3.5deg)) rotateY(calc(var(--gf-px) * 4.5deg));
  transition: transform .6s var(--gf-ease);
}

.gf-shadow {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: -6px;
  height: 52px;
  border-radius: 36px;
  background: rgba(11, 12, 14, .2);
  filter: blur(20px);
  transform: translateX(calc(var(--gf-px) * -8px));
  transition: transform .6s var(--gf-ease), opacity .6s var(--gf-ease);
}
.gf-root[data-tone="dark"] .gf-shadow { background: rgba(0, 0, 0, .65); }

.gf-back {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, #e4e4e7 100%);
}
.gf-root[data-tone="dark"] .gf-back { background: linear-gradient(180deg, #1e2026 0%, #0b0c0e 100%); }
.gf-art {
  position: absolute;
  left: -12px;
  top: -12px;
  max-width: none;
  object-fit: cover;
  transform: translate(calc(var(--gf-px) * -7px), calc(var(--gf-py) * -6px)) scale(1.02);
  transition: transform .8s var(--gf-ease), opacity .9s var(--gf-ease), filter .9s var(--gf-ease);
}
canvas.gf-art { opacity: 0; filter: blur(12px) saturate(.7); }
canvas.gf-art[data-ready] { opacity: 1; filter: none; }
.gf-back-sheen {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, .24) 0%, rgba(255, 255, 255, 0) 26%),
    radial-gradient(120% 80% at 80% 0%, rgba(255, 255, 255, .14), rgba(255, 255, 255, 0) 60%);
  pointer-events: none;
}

.gf-rim {
  position: absolute;
  left: 0;
  top: 0;
  max-width: none;
  overflow: visible;
  pointer-events: none;
  fill: none;
}
.gf-back-rim { width: 340px; height: 272px; }
.gf-back-rim path { stroke: rgba(11, 12, 14, .14); stroke-width: 1.2; }
.gf-root[data-tone="dark"] .gf-back-rim path { stroke: rgba(255, 255, 255, .22); }

/* ---- files ---------------------------------------------------------------- */
.gf-files {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  clip-path: inset(-400px -400px 10px -400px);
}
.gf-sheet-slot { display: contents; }
.gf-sheet {
  all: unset;
  box-sizing: border-box;
  position: absolute;
  left: 34px;
  top: 96px;
  width: 272px;
  height: 184px;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  pointer-events: auto;
  background: linear-gradient(180deg, #ffffff 0%, #f4f5f7 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .95),
    0 0 0 1px rgba(11, 12, 14, .12),
    0 10px 24px -8px rgba(11, 12, 14, .22);
  transform-origin: 50% 100%;
  transform:
    translate(calc(var(--gf-jx) + var(--gf-slot) * var(--gf-spread)), calc(var(--gf-lift) + var(--gf-depth) * var(--gf-stack) * -1))
    rotate(calc(var(--gf-jr) + var(--gf-slot) * var(--gf-fan)));
  transition:
    transform .5s var(--gf-spring) calc(var(--gf-depth) * 32ms),
    box-shadow .28s var(--gf-ease),
    translate .55s var(--gf-ease),
    opacity .55s var(--gf-ease);
}
.gf-root[data-tone="dark"] .gf-sheet { background: linear-gradient(180deg, #22252b 0%, #14161a 100%); box-shadow: inset 0 1px 0 rgba(255, 255, 255, .16), 0 0 0 1px rgba(255, 255, 255, .12), 0 12px 28px -8px rgba(0, 0, 0, .75); }
.gf-sheet--art { background: #14161a; }
.gf-root[data-open] .gf-sheet:hover,
.gf-root[data-open] .gf-sheet:focus-visible {
  transform:
    translate(calc(var(--gf-jx) + var(--gf-slot) * var(--gf-spread)), calc(var(--gf-lift) + var(--gf-depth) * var(--gf-stack) * -1 - 18px))
    rotate(calc(var(--gf-slot) * var(--gf-fan) * .6));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .95), 0 0 0 1.5px var(--gf-accent), 0 22px 40px -12px rgba(255, 255, 255, .2);
  transition-delay: 0s;
}
.gf-sheet:focus-visible { outline: 2px solid var(--gf-accent); outline-offset: 2px; }
.gf-sheet-art {
  position: absolute;
  left: 0;
  top: 0;
  width: 272px;
  height: 184px;
  max-width: none;
  object-fit: cover;
  object-position: center 20%;
  transition: opacity .5s var(--gf-ease), filter .5s var(--gf-ease);
}
canvas.gf-sheet-art { opacity: 0; filter: blur(8px); }
canvas.gf-sheet-art[data-ready] { opacity: 1; filter: none; }
.gf-sheet--art::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(11, 12, 14, .78) 0%, rgba(11, 12, 14, .22) 45%, rgba(11, 12, 14, .08) 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .2);
  pointer-events: none;
}
.gf-sheet-head {
  position: absolute;
  left: 14px;
  right: 14px;
  top: 11px;
  z-index: 1;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  white-space: nowrap;
}
.gf-sheet-name {
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--font-display, "Archivo", sans-serif);
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: -.015em;
  color: #0B0C0E;
}
.gf-sheet-meta {
  flex: none;
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  letter-spacing: .02em;
  color: rgba(11, 12, 14, .58);
}
.gf-root[data-tone="dark"] .gf-sheet-name, .gf-sheet--art .gf-sheet-name { color: #ffffff; }
.gf-root[data-tone="dark"] .gf-sheet-meta, .gf-sheet--art .gf-sheet-meta { color: rgba(255, 255, 255, .82); }
.gf-lines {
  position: absolute;
  left: 14px;
  right: 14px;
  top: 40px;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.gf-lines i {
  display: block;
  height: 5px;
  border-radius: 3px;
  background: rgba(11, 12, 14, .08);
}
.gf-lines i:first-child { height: 9px; margin-bottom: 4px; background: rgba(11, 12, 14, .22); }
.gf-root[data-tone="dark"] .gf-lines i { background: rgba(255, 255, 255, .08); }
.gf-root[data-tone="dark"] .gf-lines i:first-child { background: rgba(255, 255, 255, .28); }

.gf-sheet--drop { animation: gf-drop .6s var(--gf-ease) both; }
@keyframes gf-drop {
  0% { translate: 0 -190px; rotate: -9deg; opacity: 0; }
  35% { opacity: 1; }
  72% { translate: 0 10px; rotate: 1deg; }
  100% { translate: 0 0; rotate: 0deg; opacity: 1; }
}

/* ---- liquid glass front -------------------------------------------------- */
.gf-front {
  position: absolute;
  left: 0;
  top: 74px;
  width: 340px;
  height: 198px;
  z-index: 10;
  -webkit-backdrop-filter: blur(26px) saturate(1.55);
  backdrop-filter: blur(26px) saturate(1.55);
  transform-origin: 50% 100%;
  transform: perspective(760px) rotateX(var(--gf-hinge));
  transition: transform .5s var(--gf-spring), translate .65s var(--gf-ease), opacity .65s var(--gf-ease);
}
.gf-front--bump { animation: gf-bump .55s var(--gf-ease) .3s both; }
@keyframes gf-bump {
  0% { scale: 1; }
  35% { scale: 1.018 .975; }
  70% { scale: .996 1.006; }
  100% { scale: 1; }
}
.gf-tint {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, .36) 0%, rgba(244, 245, 247, .76) 44%, rgba(255, 255, 255, .95) 100%);
}
.gf-root[data-tone="dark"] .gf-tint {
  background: linear-gradient(180deg, rgba(255, 255, 255, .14) 0%, rgba(20, 22, 26, .66) 44%, rgba(11, 12, 14, .9) 100%);
}
.gf-spec {
  position: absolute;
  inset: 0;
  background: radial-gradient(280px 210px at calc(50% + var(--gf-px) * 46%) calc(30% + var(--gf-py) * 40%), rgba(255, 255, 255, .26), rgba(255, 255, 255, 0) 70%);
  mix-blend-mode: normal;
  opacity: .9;
  transition: background-position .5s var(--gf-ease);
  pointer-events: none;
}
.gf-root[data-tone="dark"] .gf-spec { mix-blend-mode: screen; opacity: .38; }
.gf-front-rim { width: 340px; height: 198px; }
.gf-front-rim path { stroke-width: 2; transition: stroke-width .25s var(--gf-ease); }
.gf-root[data-tone="dark"] .gf-front-rim { opacity: .85; }

.gf-hit {
  all: unset;
  position: absolute;
  inset: 0;
  z-index: 1;
  cursor: pointer;
}
.gf-hit:focus-visible ~ .gf-label .gf-title { text-decoration: underline; text-decoration-color: var(--gf-accent); text-decoration-thickness: 2px; text-underline-offset: 4px; }
.gf-front:has(.gf-hit:focus-visible) .gf-front-rim path { stroke-width: 4; }

.gf-label {
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 210px;
  pointer-events: none;
  color: var(--gf-ink);
}
.gf-root[data-place="bottom-left"] .gf-label { left: 28px; bottom: 30px; }
.gf-root[data-place="top-left"] .gf-label { left: 28px; top: 34px; }
.gf-root[data-place="top-right"] .gf-label { right: 32px; top: 52px; align-items: flex-start; }
.gf-title {
  font-family: var(--font-display, "Archivo", sans-serif);
  font-size: 19px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -.025em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.gf-meta {
  font-family: var(--font-mono, "JetBrains Mono", monospace);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  letter-spacing: .04em;
  color: var(--gf-ink-soft);
  white-space: nowrap;
  animation: gf-roll .35s var(--gf-ease) both;
}
@keyframes gf-roll {
  from { opacity: 0; translate: 0 6px; }
  to { opacity: 1; translate: 0 0; }
}

/* ---- key button ----------------------------------------------------------- */
.gf-key {
  all: unset;
  box-sizing: border-box;
  position: absolute;
  right: 22px;
  bottom: 22px;
  z-index: 12;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform .28s var(--gf-spring), box-shadow .28s var(--gf-ease), background .28s var(--gf-ease), color .28s var(--gf-ease);
}
.gf-key:hover { transform: translateY(-2px); }
.gf-key:active { transform: translateY(0) scale(.94); transition-duration: .1s; }
.gf-key:focus-visible { outline: 2px solid var(--gf-accent); outline-offset: 3px; }
.gf-key--add {
  color: #fff;
  background: #0B0C0E;
  box-shadow: 0 10px 20px -6px rgba(11, 12, 14, .45);
}
.gf-key--add:hover { background: var(--gf-accent); }
.gf-key--more {
  color: #0B0C0E;
  background: rgba(255, 255, 255, .94);
  box-shadow: 0 0 0 1px rgba(11, 12, 14, .12), 0 8px 18px -6px rgba(11, 12, 14, .2);
}
.gf-key--more:hover {
  color: #0B0C0E;
  background: #FFFFFF;
  box-shadow: 0 0 0 1px #FFFFFF, 0 8px 18px -6px rgba(255, 255, 255, .28);
}
.gf-root[data-tone="dark"] .gf-key--more {
  color: #F4F5F7;
  background: rgba(255, 255, 255, .14);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .24), 0 0 0 1px rgba(255, 255, 255, .16);
}
.gf-key--more[aria-expanded="true"] { transform: scale(.96); }
.gf-glyph { display: block; max-width: none; fill: none; stroke: currentColor; stroke-linecap: round; }
.gf-glyph--plus { width: 22px; height: 22px; stroke-width: 1.8; animation: gf-turn .5s var(--gf-spring); }
.gf-glyph--more { width: 26px; height: 10px; stroke-width: 1.8; }
@keyframes gf-turn { from { rotate: -90deg; } to { rotate: 0deg; } }

/* ---- menu ------------------------------------------------------------------- */
.gf-menu {
  position: absolute;
  right: 22px;
  bottom: 84px;
  z-index: 20;
  min-width: 184px;
  padding: 6px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, .92);
  -webkit-backdrop-filter: blur(20px) saturate(1.5);
  backdrop-filter: blur(20px) saturate(1.5);
  box-shadow: 0 0 0 1px rgba(11, 12, 14, .1), 0 20px 44px -12px rgba(11, 12, 14, .24);
  transform-origin: 100% 100%;
  opacity: 0;
  visibility: hidden;
  transform: translateY(6px) scale(.95);
  transition: opacity .18s var(--gf-ease), transform .24s var(--gf-spring), visibility 0s .24s;
}
.gf-menu[data-open] { opacity: 1; visibility: visible; transform: none; transition-delay: 0s; }
.gf-root[data-tone="dark"] .gf-menu { background: rgba(20, 22, 26, .94); box-shadow: 0 0 0 1px rgba(255, 255, 255, .16), 0 20px 44px -12px rgba(0, 0, 0, .85); }
.gf-menu-item {
  all: unset;
  box-sizing: border-box;
  padding: 9px 12px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 500;
  color: #0B0C0E;
  cursor: pointer;
  transition: background .15s ease, color .15s ease;
}
.gf-root[data-tone="dark"] .gf-menu-item { color: #F4F5F7; }
.gf-menu-item:hover, .gf-menu-item:focus-visible { background: rgba(255, 255, 255, .12); color: #ffffff; }
.gf-menu-item--danger { color: #d4d4d8; }
.gf-menu-item--danger:hover, .gf-menu-item--danger:focus-visible { background: rgba(255, 255, 255, .16); color: #ffffff; }

/* ---- entrance -------------------------------------------------------------- */
.gf-root:not([data-entered]) .gf-back,
.gf-root:not([data-entered]) .gf-back-rim { translate: 0 18px; opacity: 0; }
.gf-root:not([data-entered]) .gf-sheet { translate: 0 -90px; opacity: 0; }
.gf-root:not([data-entered]) .gf-front { translate: 0 32px; opacity: 0; }
.gf-root:not([data-entered]) .gf-key { opacity: 0; scale: .75; }
.gf-root:not([data-entered]) .gf-shadow { opacity: 0; }
.gf-back, .gf-back-rim { transition: translate .55s var(--gf-ease), opacity .5s var(--gf-ease); }
.gf-root[data-entered] .gf-sheet { transition-delay: calc(var(--gf-depth) * 35ms), 0s, calc(.12s + var(--gf-depth) * 65ms), calc(.12s + var(--gf-depth) * 65ms); }
.gf-root[data-entered] .gf-front { transition-delay: 0s, .26s, .26s; }
.gf-key { transition: transform .28s var(--gf-spring), box-shadow .28s var(--gf-ease), background .28s var(--gf-ease), opacity .4s var(--gf-ease) .42s, scale .45s var(--gf-spring) .42s; }

@media (prefers-reduced-motion: reduce) {
  .gf-root *, .gf-root *::before, .gf-root *::after {
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    animation: none !important;
  }
  .gf-tilt { transform: none; }
}
`
