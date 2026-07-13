"use client"

import { useRef, useEffect } from 'react'
import { useLanguage } from '@/components/language-context'
import { img } from '@/lib/constants'

export default function HeroSection() {
  const { t } = useLanguage()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const isMobile = window.innerWidth <= 640
    video.src = img(isMobile ? '/hero-bg-mobile.mp4' : '/hero-bg.mp4')

    const play = () => {
      video.play().catch(() => {})
    }

    video.load()
    const onCanPlay = () => play()
    video.addEventListener('canplay', onCanPlay)
    play()

    return () => video.removeEventListener('canplay', onCanPlay)
  }, [])

  return (
    <section className="relative min-h-dvh max-h-[720px] flex flex-col items-center justify-center overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disableRemotePlayback
        poster={img('/images/hero-bg.webp')}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-10 text-center pt-20 sm:pt-24 md:pt-28 lg:pt-36">
        <h1 className="hero-delay-1 text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-serif font-light leading-[1.1] mb-10 relative tracking-[0.05em]">
          <span className="font-script text-cream text-[0.7em] uppercase tracking-[0.05em]">
            zhyto
          </span>
        </h1>

        <p className="hero-delay-3 text-xl sm:text-2xl md:text-3xl text-cream font-script leading-[1.8] mb-12 max-w-4xl mx-auto">
          {t.hero.description}<br />{t.hero.description2}
        </p>

        <div className="hero-delay-4">
          <a
            href="#products"
            className="group inline-flex items-center gap-5 text-cream text-2xl sm:text-3xl lg:text-4xl tracking-[0.35em] transition-all duration-300 px-10 py-5 sm:px-14 sm:py-6 bg-black/20 backdrop-blur-[1px] rounded-lg"
          >
            <span className="font-script">{t.hero.orderNow}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
