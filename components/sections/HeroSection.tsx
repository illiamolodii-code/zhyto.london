"use client"

import { useLanguage } from '@/components/language-context'

export default function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-dvh max-h-[720px] flex flex-col items-center justify-center overflow-hidden" style={{ background: 'var(--background)' }}>
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-10 text-center pt-20 sm:pt-24 md:pt-28 lg:pt-36">
        <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-serif font-light leading-[1.1] mb-10 relative tracking-[0.05em]">
          <span className="font-script text-foreground text-[0.7em] uppercase tracking-[0.05em]">
            zhyto
          </span>
        </h1>

        <p className="text-xl sm:text-2xl md:text-3xl text-foreground font-script leading-[1.8] mb-12 max-w-4xl mx-auto">
          {t.hero.description}<br />{t.hero.description2}
        </p>

        <div>
          <a
            href="#products"
            className="group inline-flex items-center gap-5 text-foreground text-2xl sm:text-3xl lg:text-4xl tracking-[0.35em] transition-all duration-300 px-10 py-5 sm:px-14 sm:py-6 bg-white/30 backdrop-blur-[1px] border border-foreground/10 rounded-lg"
          >
            <span className="font-script">{t.hero.orderNow}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
