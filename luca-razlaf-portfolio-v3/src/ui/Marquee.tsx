import React from 'react'
export function Marquee({ children, reverse = false, vertical = true, repeat = 3, className = '' }: { children: React.ReactNode; reverse?: boolean; vertical?: boolean; repeat?: number; className?: string }) {
  return (
    <div className={`group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)] ${vertical ? 'flex-col' : 'flex-row'} ${className}`}>
      {Array.from({ length: repeat }, (_, i) => (
        <div key={i} className={`flex shrink-0 justify-around [gap:var(--gap)] group-hover:[animation-play-state:paused] ${vertical ? 'animate-marquee-vertical flex-col' : 'animate-marquee flex-row'} ${reverse ? '[animation-direction:reverse]' : ''}`}>{children}</div>
      ))}
    </div>
  )
}
