"use client"

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { img } from '@/lib/constants'

export default function SplashScreen({ onReady, onLoad }: { onReady: () => void; onLoad?: () => Promise<any> }) {
  const [state, setState] = useState<'enter' | 'visible' | 'exit'>('enter')
  const dataLoaded = useRef(false)
  const animDone = useRef(false)

  useEffect(() => {
    let cancelled = false
    const frames = 8
    let count = 0

    const tryReady = () => {
      if (!cancelled && dataLoaded.current && animDone.current) {
        setState('exit')
        setTimeout(() => {
          if (!cancelled) onReady()
        }, 200)
      }
    }

    const tick = () => {
      if (cancelled) return
      count++
      if (count >= frames) {
        animDone.current = true
        tryReady()
      } else {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)

    if (onLoad) {
      onLoad().then(() => {
        dataLoaded.current = true
        tryReady()
      }).catch(() => {
        dataLoaded.current = true
        tryReady()
      })
    } else {
      dataLoaded.current = true
    }

    return () => { cancelled = true }
  }, [onReady, onLoad])

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-background flex items-center justify-center transition-opacity duration-600 ${
        state === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ pointerEvents: state === 'exit' ? 'none' : 'auto' }}
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
