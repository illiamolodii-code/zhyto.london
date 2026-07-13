"use client"

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { img } from '@/lib/constants'

export default function SplashScreen({ onReady, onUserTap }: { onReady: () => void; onUserTap?: () => void }) {
  const [state, setState] = useState<'enter' | 'exit'>('enter')
  const tapped = useRef(false)

  useEffect(() => {
    const id = setTimeout(() => {
      setState('exit')
      setTimeout(() => onReady(), 300)
    }, 2500)
    return () => clearTimeout(id)
  }, [onReady])

  const handleInteraction = () => {
    if (tapped.current) return
    tapped.current = true
    onUserTap?.()
    setState('exit')
    setTimeout(() => onReady(), 300)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={`fixed inset-0 z-[9999] bg-background flex items-center justify-center transition-opacity duration-600 ${
        state === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ pointerEvents: state === 'exit' ? 'none' : 'auto' }}
      onClick={handleInteraction}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleInteraction() }}
    >
      <div className="relative w-72 h-72 md:w-96 md:h-96 animate-breath">
        <Image
          src={img("/images/dsfsjfos.png")}
          alt="zhyto"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  )
}
