import {
  useEffect, useRef, useState, useCallback, type ReactNode
} from 'react'
import { ArrowDownRight, Play, X, Mail, Instagram, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import {
  HERO, STATS, GROWTH, TECHNIQUES, FEATURES, FOLDERS,
  TESTIMONIALS, SITE, type Clip, type Testimonial
} from './src/config'
import GlassFolder from './src/ui/glass-folder-cards'
import { Marquee } from './src/ui/Marquee'

// ── shared hooks ─────────────────────────────────────────────────────────────

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); io.disconnect() }
    }, { threshold })
    io.observe(el); return () => io.disconnect()
  }, [threshold])
  return [ref, on] as const
}

function Reveal({ children, d = 0, className = '' }: { children: ReactNode; d?: number; className?: string }) {
  const [ref, on] = useInView<HTMLDivElement>()
  return (
    <div ref={ref} style={{ transitionDelay: `${d}ms` }} className={`rv ${on ? 'on' : ''} ${className}`}>
      {children}
    </div>
  )
}

function Count({ to, suffix }: { to: number; suffix: string }) {
  const [ref, on] = useInView<HTMLSpanElement>()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!on) return
    let raf = 0; const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1600)
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf)
  }, [on, to])
  return <span ref={ref}>{n}{suffix}</span>
}

// ── body scroll lock ──────────────────────────────────────────────────────────

function useLockBody(active: boolean) {
  useEffect(() => {
    if (!active) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [active])
}

// ── Nav ───────────────────────────────────────────────────────────────────────

function Nav() {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const f = () => setSolid(scrollY > 40); f()
    addEventListener('scroll', f); return () => removeEventListener('scroll', f)
  }, [])
  const links = [
    ['Home', 'home'], ['Results', 'results'], ['Why AI', 'story'],
    ['How it works', 'how'], ['Testimonials', 'testimonials'],
    ['Case Studies', 'cases'], ['Contact', 'contact'],
  ]
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${solid ? 'bg-white/90 backdrop-blur border-b border-black/10 text-black' : 'text-white'}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <a href="#home" className="font-display text-xl font-bold italic">Luca Razlaf</a>
        <nav className="hidden gap-7 text-sm font-medium md:flex">
          {links.map(([l, id]) => <a key={id} href={`#${id}`} className="opacity-80 transition hover:opacity-100">{l}</a>)}
        </nav>
        <a href="#contact" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white md:hidden">Contact</a>
      </div>
    </header>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero({ onCase }: { onCase: () => void }) {
  const [i, setI] = useState(0)
  const [err, setErr] = useState(false)
  const next = useCallback(() => { setErr(false); setI(v => (v + 1) % HERO.length) }, [])
  const cur = HERO[i]
  const nextClip = HERO[(i + 1) % HERO.length]

  useEffect(() => { const t = setTimeout(next, 12000); return () => clearTimeout(t) }, [i, next])

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden bg-black text-white">
      <div key={i} className="fade-bg absolute inset-0">
        {cur.poster
          ? <img src={cur.poster} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover blur-md" />
          : <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black" />}
        {!err && (
          <video key={cur.src} autoPlay muted playsInline loop={false} preload="auto"
            onEnded={next} onError={() => setErr(true)}
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-[6px]">
            <source src={cur.src} type={cur.type} />
          </video>
        )}
        {nextClip && !err && (
          <video key={`pre-${nextClip.src}`} src={nextClip.src} preload="auto" muted playsInline className="hidden" aria-hidden />
        )}
      </div>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative mx-auto w-full max-w-7xl px-5 pt-24">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Short-form editor · Luca Razlaf</p>
        <h1 className="font-display max-w-4xl text-5xl font-bold leading-[1.02] sm:text-7xl lg:text-8xl">
          Clips that<br /><span className="italic font-medium text-white/70">AI can't make.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/75">Find your unique look. Edits with timing, emotion and a human pulse.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <button onClick={onCase} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-white/85 cursor-pointer">
            <Play size={15} fill="currentColor" />View Case Study
          </button>
          <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold transition hover:bg-white/10">
            Get in Contact<ArrowDownRight size={16} />
          </a>
        </div>
        <div className="mt-14 flex gap-2">
          {HERO.map((_, k) => (
            <button key={k} aria-label={`Edit ${k + 1}`} onClick={() => { setErr(false); setI(k) }}
              className={`h-1 rounded-full transition-all cursor-pointer ${k === i ? 'w-12 bg-white' : 'w-6 bg-white/40'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Chart ─────────────────────────────────────────────────────────────────────

function Chart() {
  const [ref, on] = useInView<HTMLDivElement>()
  const [h, setH] = useState<number | null>(null)
  const W = 600, H = 180, max = 50
  const pts = GROWTH.map((v, i) => [i / (GROWTH.length - 1) * W, H - v / max * (H - 10) - 4])
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const idx = h ?? GROWTH.length - 1
  return (
    <div ref={ref} className={`rounded-3xl border border-black/10 bg-white p-6 shadow-[0_20px_60px_-30px_rgba(29,78,216,.35)] sm:p-8 ${on ? 'on' : ''}`}>
      <p className="text-sm text-black/55">Clips that produce real growth</p>
      <div className="font-display mt-1 text-5xl font-bold">
        {GROWTH[idx].toFixed(1).replace('.0', '')}M{' '}
        <span className="text-xl font-medium text-black/45">views · month {idx + 1}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 w-full overflow-visible"
        onPointerMove={e => { const r = e.currentTarget.getBoundingClientRect(); setH(Math.max(0, Math.min(GROWTH.length - 1, Math.round((e.clientX - r.left) / r.width * (GROWTH.length - 1))))) }}
        onPointerLeave={() => setH(null)}>
        <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1d4ed8" stopOpacity=".22" />
          <stop offset="1" stopColor="#1d4ed8" stopOpacity="0" />
        </linearGradient></defs>
        <path d={`${line} L${W},${H} L0,${H}Z`} fill="url(#g)" style={{ opacity: on ? 1 : 0, transition: 'opacity 1.6s .4s' }} />
        <path d={line} pathLength={1} className="draw" fill="none" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={pts[idx][0]} cy={pts[idx][1]} r="5" fill="#1d4ed8" stroke="#fff" strokeWidth="2" />
      </svg>
      <div className="mt-2 flex justify-between text-xs text-black/45"><span>Month 1</span><span>Month 24</span></div>
    </div>
  )
}

// ── Story Section ─────────────────────────────────────────────────────────────

function Story() {
  return (
    <section id="story" className="bg-[#F5F7FB] px-5 py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">The difference</p>
          <h2 className="font-display mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            AI can edit. It can't feel the moment.
          </h2>
        </Reveal>

        <div className="mt-12 space-y-7 text-xl leading-relaxed text-black/70 max-w-3xl">
          <Reveal d={80}>
            <p>
              <span className="text-black font-medium">AI is great at the process.</span> It cuts silences, adds captions and chops a podcast into thirty clips in minutes.
            </p>
          </Reveal>
          <Reveal d={160}>
            <p>
              What it can't do is feel <span className="text-black font-medium">why a cut works</span>: the beat before the punchline, the half second you hold on a face, the break that makes someone stop scrolling.
            </p>
          </Reveal>
          <Reveal d={240}>
            <p>
              <span className="text-black font-medium">That's the part I do.</span> Hard cuts on the beat, split frames, type that hits — made by someone who watches every clip the way your audience does.
            </p>
          </Reveal>
        </div>

        {/* Comparison card */}
        <Reveal d={320}>
          <div className="mt-16 grid gap-4 sm:grid-cols-2">
            {/* Left: AI */}
            <div className="rounded-2xl border border-black/8 bg-white/70 p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-black/40 mb-5">AI clip tool</p>
              <ul className="space-y-3">
                {['Fast', 'Generic templates', 'Safe', 'Cuts what is said'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-black/50">
                    <span className="size-1.5 rounded-full bg-black/25 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Right: Human */}
            <div className="rounded-2xl border border-accent/20 bg-white p-7 shadow-[0_8px_32px_rgba(29,78,216,.10)]">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-5">Human edit</p>
              <ul className="space-y-3">
                {['Timing and tension', 'A look nobody else has', 'Pattern breaks', 'Cuts what is felt'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-black font-medium">
                    <span className="size-1.5 rounded-full bg-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal d={400}>
          <div className="mt-10 text-center">
            <a href="#how" className="text-sm font-medium text-accent hover:underline underline-offset-4 transition">
              See how it works ↓
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ── Scroll-driven Technique Slide ─────────────────────────────────────────────

function TechniqueSlide({ t, idx, total }: { t: (typeof TECHNIQUES)[number]; idx: number; total: number }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)
  const prefersReduced = useRef(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    if (prefersReduced.current) return
    const wrap = wrapRef.current; if (!wrap) return
    let raf = 0
    const compute = () => {
      const rect = wrap.getBoundingClientRect()
      const viewH = window.innerHeight
      const raw = 1 - rect.bottom / (viewH + rect.height)
      setP(Math.max(0, Math.min(1, raw)))
    }
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(compute) }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  const phase = p < 0.35 ? 1 : p < 0.75 ? 2 : 3
  const phase2Progress = phase === 2 ? (p - 0.35) / 0.4 : phase === 3 ? 1 : 0
  const imgScale = phase === 1 ? 0.85 : 0.85 + 0.1 * phase2Progress
  const imgBlur = phase2Progress * 10
  const imgBrightness = 1 - 0.35 * phase2Progress
  const textOpacity = phase2Progress
  const textY = (1 - phase2Progress) * 32

  if (prefersReduced.current) {
    return (
      <div className="bg-neutral-800 py-16 px-5 text-white">
        <img src={t.img} alt={t.t} className="mx-auto mb-8 max-h-[60vh] w-full max-w-2xl rounded-2xl object-contain shadow-2xl" />
        <div className="mx-auto max-w-xl text-center">
          <p className="font-display text-5xl italic text-blue-400">{t.n}<span className="text-2xl text-white/40"> / 0{total}</span></p>
          <h3 className="font-display mt-3 text-3xl font-bold sm:text-4xl">{t.t}</h3>
          <p className="mt-3 text-lg text-white/80">{t.d}</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={wrapRef} className="technique-wrapper" style={{ height: '250vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-neutral-800 flex items-center justify-center">
        <img src={t.img} alt="" aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover scale-110"
          style={{ filter: 'blur(28px) grayscale(1) brightness(0.35)', userSelect: 'none' }} />
        <div className="relative z-10 flex h-full w-full items-center justify-center px-6">
          <img src={t.img} alt={t.t}
            className="rounded-2xl object-contain shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            style={{
              maxHeight: '80vh', maxWidth: '90vw',
              transform: `scale(${imgScale})`,
              filter: `blur(${imgBlur}px) brightness(${imgBrightness})`,
              transition: 'transform 0.05s linear, filter 0.05s linear',
            }} />
        </div>
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-5 text-center"
          style={{ opacity: textOpacity, transform: `translateY(${textY}px)`, transition: 'opacity 0.05s linear, transform 0.05s linear', pointerEvents: phase >= 2 ? 'auto' : 'none' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 pointer-events-none" />
          <div className="relative max-w-xl">
            <p className="font-display text-5xl italic text-blue-400" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}>
              {t.n}<span className="text-2xl text-white/40"> / 0{total}</span>
            </p>
            <h3 className="font-display mt-3 text-3xl font-bold text-white sm:text-5xl" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.85)' }}>{t.t}</h3>
            <p className="mt-4 text-[18px] leading-relaxed text-white/90" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>{t.d}</p>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-3">
          <div className="flex gap-2">
            {Array.from({ length: total }).map((_, k) => (
              <span key={k} className="rounded-full transition-all duration-300"
                style={{ width: k === idx ? 24 : 8, height: 8, background: k === idx ? '#93c5fd' : 'rgba(255,255,255,0.3)' }} />
            ))}
          </div>
          {idx === 0 && phase < 2 && <p className="text-xs tracking-[0.2em] text-white/50 uppercase animate-pulse">Scroll</p>}
        </div>
      </div>
    </div>
  )
}

// ── Testimonial Wall ──────────────────────────────────────────────────────────

function TCard({ t }: { t: Testimonial }) {
  return (
    <figure className="w-72 shrink-0 rounded-2xl border border-black/8 bg-white p-5 shadow-[0_8px_28px_rgba(11,12,14,.07)] transition-all hover:border-accent/40 hover:shadow-[0_12px_36px_rgba(29,78,216,.12)]">
      <div className="flex items-center gap-3">
        {/* Avatar with initials */}
        <span className={`relative grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br ${t.gradient} text-sm font-bold text-white select-none shadow-sm`}>
          {t.n.split(' ').map(w => w[0]).join('').slice(0, 2)}
        </span>
        <div className="min-w-0">
          <b className="text-sm truncate block text-black/90">{t.n}</b>
          <p className="text-xs text-black/50 truncate">{t.r}</p>
        </div>
      </div>
      {/* 5 Stars */}
      <div className="mt-3 flex gap-0.5" aria-label="5 stars">
        {Array.from({ length: 5 }).map((_, i) => <span key={i} className="text-amber-400 text-xs">★</span>)}
      </div>
      <blockquote className="mt-3 text-sm leading-relaxed text-black/75">"{t.q}"</blockquote>
    </figure>
  )
}

function TestimonialWall() {
  const NUM_COLS = 5
  const columns: Testimonial[][] = Array.from({ length: NUM_COLS }, () => [])
  TESTIMONIALS.forEach((t, i) => columns[i % NUM_COLS].push(t))

  const durations = ['[--duration:38s]', '[--duration:44s]', '[--duration:40s]', '[--duration:46s]', '[--duration:42s]']

  return (
    <div className="twall relative w-screen overflow-hidden" style={{ height: '85vh' }}>
      {/* Top + bottom fade via mask */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)', maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)' }}>
        {/* Columns */}
        <div className="flex h-full gap-4 px-4">
          {columns.map((col, ci) => (
            <div key={ci}
              className={`flex-1 min-w-0 ${ci >= 4 ? 'hidden xl:block' : ci >= 3 ? 'hidden lg:block' : ci >= 2 ? 'hidden md:block' : ''}`}>
              <Marquee vertical reverse={ci % 2 === 1} className={`h-full flex-col ${durations[ci]}`}>
                {[...col, ...col].map((t, k) => (
                  <div key={k} className="py-2">
                    <TCard t={t} />
                  </div>
                ))}
              </Marquee>
            </div>
          ))}
        </div>
      </div>

      {/* Left/right soft fade */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-white/60 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-white/60 to-transparent" />

      {/* Blur strips top/bottom */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-20 h-20 backdrop-blur-[4px]"
        style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)' }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 backdrop-blur-[4px]"
        style={{ WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)', maskImage: 'linear-gradient(to top, black 0%, transparent 100%)' }} />
    </div>
  )
}

// ── Aspect-ratio helpers ──────────────────────────────────────────────────────

function clipAspectStyle(clip: Clip, runtimeAspect: number | null): React.CSSProperties {
  const a = clip.aspect ?? runtimeAspect
  if (!a) return { aspectRatio: '9/16' }
  return { aspectRatio: `${a}` }
}

// ── Video player lightbox (playable fullscreen) ───────────────────────────────

interface PlayerModalProps {
  clips: Clip[]
  index: number | null
  onClose: () => void
  onNav: (idx: number) => void
}

function PlayerModal({ clips, index, onClose, onNav }: PlayerModalProps) {
  const [videoErr, setVideoErr] = useState(false)
  const [runtimeAspect, setRuntimeAspect] = useState<number | null>(null)
  const clip = index !== null ? clips[index] : null
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useLockBody(clip !== null)

  const unloadVideo = useCallback(() => {
    const v = videoRef.current
    if (v) {
      v.pause()
      v.removeAttribute('src')
      v.load()
    }
  }, [])

  const handleClose = useCallback(() => {
    unloadVideo()
    onClose()
  }, [unloadVideo, onClose])

  const handleNav = useCallback((newIdx: number) => {
    unloadVideo()
    setVideoErr(false)
    setRuntimeAspect(null)
    onNav(newIdx)
  }, [unloadVideo, onNav])

  // Play video on mount / clip switch
  useEffect(() => {
    const v = videoRef.current
    if (v) {
      v.currentTime = 0
      const playPromise = v.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {})
      }
    }
  }, [clip?.src])

  useEffect(() => {
    setVideoErr(false)
    setRuntimeAspect(null)
    const f = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        handleClose()
      } else if (e.key === 'ArrowLeft' && index !== null && index > 0) {
        handleNav(index - 1)
      } else if (e.key === 'ArrowRight' && index !== null && index < clips.length - 1) {
        handleNav(index + 1)
      }
    }
    window.addEventListener('keydown', f, true)
    return () => {
      window.removeEventListener('keydown', f, true)
      unloadVideo()
    }
  }, [index, clips.length, handleClose, handleNav, unloadVideo])

  if (!clip || index === null) return null

  const aspect = clip.aspect ?? runtimeAspect
  const aspectStyle = aspect ? { aspectRatio: `${aspect}` } : { aspectRatio: '9/16' }
  const isVertical = (aspect ?? 0.5625) < 1

  const handleFullscreen = () => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video && !container) return

    if (video?.requestFullscreen) {
      video.requestFullscreen().catch(() => {
        if (container?.requestFullscreen) container.requestFullscreen().catch(() => {})
      })
    } else if ((video as any)?.webkitEnterFullscreen) {
      (video as any).webkitEnterFullscreen()
    } else if (container?.requestFullscreen) {
      container.requestFullscreen().catch(() => {})
    } else if ((container as any)?.webkitRequestFullscreen) {
      (container as any).webkitRequestFullscreen()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-3 sm:p-6 backdrop-blur-lg"
      onClick={handleClose}
      style={{ animation: 'galleryIn 0.25s cubic-bezier(.2,.8,.2,1) both' }}
    >
      <div
        ref={containerRef}
        className="relative flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: '92vh',
          maxWidth: '96vw',
          width: isVertical ? 'auto' : '100%',
        }}
      >
        {/* Top actions bar: Fullscreen & Close */}
        <div className="absolute -top-12 right-0 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={handleFullscreen}
            aria-label="Vollbild"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/25 transition cursor-pointer"
            title="Vollbild"
          >
            <Maximize2 size={14} />
            <span>Vollbild</span>
          </button>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Schließen"
            className="grid size-8 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 transition cursor-pointer"
            title="Schließen"
          >
            <X size={18} />
          </button>
        </div>

        {/* Previous Button (Desktop) */}
        {index > 0 && (
          <button
            type="button"
            onClick={() => handleNav(index - 1)}
            aria-label="Vorheriges Video"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-20 hidden sm:grid size-12 place-items-center rounded-full bg-black/70 text-white hover:bg-accent transition cursor-pointer border border-white/20 shadow-xl"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Next Button (Desktop) */}
        {index < clips.length - 1 && (
          <button
            type="button"
            onClick={() => handleNav(index + 1)}
            aria-label="Nächstes Video"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-20 hidden sm:grid size-12 place-items-center rounded-full bg-black/70 text-white hover:bg-accent transition cursor-pointer border border-white/20 shadow-xl"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* Video / Error view */}
        {videoErr ? (
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-neutral-900 p-8 text-center border border-white/10"
            style={{ ...aspectStyle, maxHeight: '80vh', maxWidth: '85vw' }}
          >
            <p className="text-sm font-medium text-white/90">
              This file format is not supported in your browser.
            </p>
            <p className="text-xs text-white/50">{clip.title}</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            key={clip.src}
            src={clip.src}
            controls
            autoPlay
            playsInline
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            onError={() => setVideoErr(true)}
            onDoubleClick={handleFullscreen}
            onLoadedMetadata={(e) => {
              const v = e.currentTarget
              if (!clip.aspect && v.videoWidth && v.videoHeight) {
                setRuntimeAspect(parseFloat((v.videoWidth / v.videoHeight).toFixed(4)))
              }
            }}
            className="rounded-2xl bg-black object-contain shadow-2xl cursor-pointer"
            style={{
              ...aspectStyle,
              maxHeight: '84vh',
              maxWidth: '94vw',
              display: 'block',
            }}
          >
            <source src={clip.src} type={clip.type} />
            <source src={clip.src} type="video/mp4" />
          </video>
        )}

        {/* Title and clip counter */}
        <div className="mt-3 flex items-center justify-between gap-4 w-full px-2 text-white/80">
          <p className="text-sm font-medium truncate max-w-sm sm:max-w-md">{clip.title}</p>
          <span className="text-xs font-mono text-white/50 shrink-0">
            {index + 1} / {clips.length}
          </span>
        </div>

        {/* Mobile Prev / Next Controls */}
        <div className="mt-3 flex items-center gap-6 sm:hidden">
          <button
            type="button"
            onClick={() => handleNav(index - 1)}
            disabled={index === 0}
            aria-label="Vorheriges Video"
            className="grid size-10 place-items-center rounded-full bg-white/10 text-white disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft size={22} />
          </button>
          <span className="text-xs font-mono text-white/70">
            {index + 1} of {clips.length}
          </span>
          <button
            type="button"
            onClick={() => handleNav(index + 1)}
            disabled={index === clips.length - 1}
            aria-label="Nächstes Video"
            className="grid size-10 place-items-center rounded-full bg-white/10 text-white disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Gallery tile (clickable real button) ───────────────────────────────────────

function GalleryTile({ clip, onClick }: { clip: Clip; onClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [runtimeAspect, setRuntimeAspect] = useState<number | null>(null)
  const aspectStyle = clipAspectStyle(clip, runtimeAspect)

  const handleMouseEnter = () => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {})
  }

  const handleMouseLeave = () => {
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    onClick()
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Video abspielen: ${clip.title}`}
      className="gallery-tile group relative w-full cursor-pointer overflow-hidden rounded-xl bg-neutral-900 text-left border border-white/10 hover:border-accent hover:shadow-[0_0_24px_rgba(29,78,216,.35)] transition-all duration-200 select-none focus-visible:outline-2 focus-visible:outline-accent"
      style={aspectStyle}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick(e as any)
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Poster */}
      {clip.poster ? (
        <img
          src={clip.poster}
          alt={clip.title}
          loading="lazy"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950" />
      )}

      {/* Hover preview video (desktop only, pointer-events: none) */}
      <video
        ref={videoRef}
        src={clip.src}
        muted
        playsInline
        preload="none"
        onLoadedMetadata={(e) => {
          const v = e.currentTarget
          if (!clip.aspect && v.videoWidth && v.videoHeight) {
            setRuntimeAspect(parseFloat((v.videoWidth / v.videoHeight).toFixed(4)))
          }
        }}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden md:block"
      />

      {/* Dark gradient scrim */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      {/* Always visible Play Icon badge */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="grid size-14 place-items-center rounded-full bg-accent text-white shadow-xl shadow-accent/40 border border-white/30 transition-transform duration-200 group-hover:scale-115">
          <Play size={22} fill="currentColor" className="ml-1 text-white" />
        </div>
      </div>

      {/* Title */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
        <p className="text-white text-xs font-semibold truncate drop-shadow-md">{clip.title}</p>
      </div>
    </div>
  )
}

// ── Folder Gallery Overlay ────────────────────────────────────────────────────

interface FolderGalleryProps {
  folder: (typeof FOLDERS)[number] | null
  onClose: () => void
}

function FolderGallery({ folder, onClose }: FolderGalleryProps) {
  const [playerIndex, setPlayerIndex] = useState<number | null>(null)
  useLockBody(folder !== null)

  // Reset player when folder changes
  useEffect(() => {
    setPlayerIndex(null)
  }, [folder])

  // Escape key handler: only closes gallery when player is NOT open
  useEffect(() => {
    if (playerIndex !== null) return
    const f = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [onClose, playerIndex])

  if (!folder) return null

  return (
    <>
      {/* Gallery overlay */}
      <div
        className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md"
        style={{ animation: 'galleryIn 0.25s cubic-bezier(.2,.8,.2,1) both' }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">{folder.label}</h2>
            <p className="text-sm text-white/50 mt-0.5">
              {folder.clips.length} {folder.clips.length === 1 ? 'clip' : 'clips'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Grid Container */}
        <div
          className="flex-1 overflow-y-auto px-6 py-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {folder.clips.map((clip, i) => (
              <GalleryTile key={clip.id} clip={clip} onClick={() => setPlayerIndex(i)} />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Player */}
      {playerIndex !== null && (
        <PlayerModal
          clips={folder.clips}
          index={playerIndex}
          onClose={() => setPlayerIndex(null)}
          onNav={setPlayerIndex}
        />
      )}
    </>
  )
}


// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [openFolder, setOpenFolder] = useState<(typeof FOLDERS)[number] | null>(null)
  const openFirst = () => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div>
      <Nav />
      <Hero onCase={openFirst} />
      <main>
        {/* Results */}
        <section id="results" className="mx-auto max-w-7xl px-5 py-28">
          <Reveal><p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Real Results</p></Reveal>
          <div className="mt-6 grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
            <Reveal>
              <div className="font-display text-[7rem] font-bold leading-none tracking-tight sm:text-[10rem]"><Count to={50} suffix="M+" /></div>
              <h2 className="font-display mt-2 text-3xl font-bold sm:text-4xl">views of short-form content, edited for big creators.</h2>
              <p className="mt-4 max-w-md text-black/60">Not template clips. Real edits that held attention and grew real audiences, with more to show than fits on this page.</p>
              <div className="mt-8 flex gap-10">{STATS.map(s => <div key={s.l}><div className="font-display text-3xl font-bold text-accent"><Count to={s.v} suffix={s.s} /></div><div className="text-sm text-black/55">{s.l}</div></div>)}</div>
              <a href="#cases" className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-accent">See the work<ArrowDownRight size={16} /></a>
            </Reveal>
            <Reveal d={120}><Chart /></Reveal>
          </div>
        </section>

        {/* Story */}
        <Story />

        {/* How it works */}
        <section id="how" className="bg-black">
          <div className="mx-auto max-w-7xl px-5 py-24 text-white">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">How it works</p>
              <h2 className="font-display mt-3 max-w-2xl text-4xl font-bold sm:text-5xl">Three moves that make an edit feel alive.</h2>
            </Reveal>
          </div>
          {TECHNIQUES.map((t, i) => <TechniqueSlide key={t.n} t={t} idx={i} total={TECHNIQUES.length} />)}
          <div className="relative bg-white">
            <div className="mx-auto grid max-w-7xl gap-6 px-5 py-20 sm:grid-cols-3">
              {FEATURES.map(([title, desc], i) => (
                <Reveal key={title} d={i * 100}>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-black/60">{desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials – full-width wall */}
        <section id="testimonials" className="py-20 overflow-x-hidden">
          <div className="mx-auto max-w-7xl px-5 mb-12">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Testimonials</p>
              <h2 className="font-display mt-3 text-4xl font-bold sm:text-5xl">What clients say.</h2>
            </Reveal>
          </div>
          <TestimonialWall />
        </section>

        {/* Case Studies */}
        <section id="cases" className="bg-[#0B0C0E] px-5 py-28 text-white">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">Case Studies</p>
              <h2 className="font-display mt-3 text-4xl font-bold sm:text-5xl">Open a folder.</h2>
              <p className="mt-3 max-w-md text-white/60">Click a folder to browse all clips and pick one to watch.</p>
            </Reveal>
            <div className="mt-14 grid grid-cols-1 justify-items-center gap-x-10 gap-y-20 pt-10 md:grid-cols-2 xl:grid-cols-3">
              {FOLDERS.map((g, idx) => (
                <GlassFolder
                  key={g.slug}
                  label={g.label}
                  meta={`${g.clips.length} ${g.clips.length === 1 ? 'clip' : 'clips'}`}
                  tone="dark"
                  art={g.art}
                  seed={g.seed}
                  action="more"
                  labelPlacement="bottom-left"
                  appearDelay={idx * 90}
                  width={320}
                  open={false}
                  files={g.clips.map(c => ({
                    name: c.title,
                    meta: g.label,
                    image: c.poster ?? undefined,
                    projectId: c.id,
                  }))}
                  onFolderClick={() => setOpenFolder(g)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="relative overflow-hidden px-5 py-32 text-center">
          <Reveal className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Contact</p>
            <h2 className="font-display mt-4 text-4xl font-bold sm:text-6xl">Your content deserves<br /><span className="italic text-accent">a human cut.</span></h2>
            <p className="mx-auto mt-5 max-w-md text-black/60">Tell me about your channel and your goals. I'll show you how the edit can look.</p>
            <a href={`mailto:${SITE.email}?subject=${encodeURIComponent('Edit project')}&body=${encodeURIComponent('Hi Luca,\n\nMy channel/brand:\nWhat I need:\nLinks:\n')}`}
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-accent px-9 py-4 font-semibold text-white shadow-lg shadow-accent/30 transition hover:bg-blue-800">
              <Mail size={18} />Start a project
            </a>
            <div className="mt-6 flex justify-center gap-6 text-sm text-black/60">
              <a href={SITE.instagram} className="inline-flex items-center gap-1.5 hover:text-black"><Instagram size={16} />{SITE.handle}</a>
              <a href={SITE.whop} className="hover:text-black">Whop</a>
              <a href={`mailto:${SITE.email}`} className="hover:text-black">{SITE.email}</a>
            </div>
          </Reveal>
        </section>
      </main>
      <footer className="border-t border-black/10 py-8 text-center text-xs text-black/50">© {new Date().getFullYear()} Luca Razlaf</footer>

      {/* Folder gallery overlay */}
      <FolderGallery folder={openFolder} onClose={() => setOpenFolder(null)} />
    </div>
  )
}
