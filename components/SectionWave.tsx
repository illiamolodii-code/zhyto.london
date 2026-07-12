'use client'

import { useRef, useEffect } from 'react'

interface SectionWaveProps {
  color?: string
  reverse?: boolean
  animate?: boolean
  overlap?: boolean
}

export default function SectionWave({ color = '#f5ead6', reverse, animate, overlap }: SectionWaveProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !animate) return
    const svg = svgRef.current
    let ticking = false

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = svg.getBoundingClientRect()
          const vh = window.innerHeight
          const center = rect.top + rect.height / 2
          const dist = (center - vh / 2) / vh
          const shift = Math.max(-1, Math.min(1, dist * 1.5)) * 60
          svg.style.transform = `translateX(${shift}px)`
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [animate])

  return (
    <div className={`relative z-30 w-full h-[40px] sm:h-[50px] md:h-[60px] overflow-hidden ${overlap ? '-mt-12 md:-mt-16' : '-mt-px'}`}>
      <svg
        ref={svgRef}
        className={`absolute w-[110%] h-full ${reverse ? 'rotate-180 scale-y-[-1]' : ''}`}
        style={{ left: '-5%' }}
        viewBox="0 0 2880 74.39"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1347,20.59c-80.5-1.51-227.4-18.93-387-15.94s-320.4,15.94-480,18.93S193.2,8.63,114,2.66s-114,0-114,0V74.39H1440s80.4,0,80.4,0h1359.6V2.66l-80.4,5.98c-79.2,5.98-240,14.45-399.6,11.46-159.6-2.99-294.11,12.58-480,.49-156.5-10.18-320.4-11.95-399.6-5.97,0,0-60.26,5.23-80.4,5.98-23.23,.86-93,0-93,0Z"
          fill={color}
          fillRule="evenodd"
        />
      </svg>
    </div>
  )
}
