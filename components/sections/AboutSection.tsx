"use client"

import { useState, useRef, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { img as imgPath } from '@/lib/constants'
const img = imgPath
import { ImageCarousel } from '@/components/image-carousel'
import { useLanguage } from '@/components/language-context'

const DEFAULT_ABOUT_IMAGES = [
  { src: "/images/about-us.webp", name: "Illia" },
  { src: "/images/about-us-2.webp", name: "Victor" },
  { src: "/images/about-us-3.webp", name: "Nataliia" },
]

export default function AboutSection() {
  const { t } = useLanguage()
  const aboutRef = useRef<HTMLElement>(null)
  const [aboutImageIndex, setAboutImageIndex] = useState(0)
  const [aboutImages, setAboutImages] = useState<{ src: string; name: string }[] | null>(null)

  useEffect(() => {
    fetch('/api/public-settings')
      .then(r => r.json())
      .then(data => {
        if (data?.about_images?.images?.length > 0) {
          setAboutImages(data.about_images.images)
        }
      })
      .catch(() => {})
  }, [])

  const images = aboutImages || DEFAULT_ABOUT_IMAGES
  const names = images.map(i => i.name)

  return (
    <section id="about" ref={aboutRef} className="py-28 lg:py-36 relative bg-background">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="text-center mb-12">
          <p className="text-[46px] tracking-[0.35em]">
            <span className="font-script text-primary">{t.about.ourStory}</span>
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">
          <div className="order-1 lg:order-1">
            <div className="stagger-left">
              <p className="animate-on-view-left text-muted-foreground leading-[1.9] mb-6 text-xl md:text-lg lg:text-xl">
                {t.about.para1}
              </p>
              <p className="animate-on-view-left text-muted-foreground leading-[1.9] mb-10 text-xl md:text-lg lg:text-xl">
                {t.about.para2}
              </p>
              <a
                href="#faq"
                className="animate-on-view-left inline-flex items-center gap-4 text-primary text-[15px] tracking-[0.25em] hover:gap-6 transition-all duration-300"
              >
                <span>{t.about.getInTouch}</span>
                <ArrowRight className="w-4 h-4 opacity-80" />
              </a>
            </div>
          </div>

          <div className="relative order-2 lg:order-2">
            <div className="about-image-parallax relative min-h-[500px] lg:min-h-[800px] overflow-hidden">
              <div className="absolute inset-0">
                <div className="relative w-full h-full">
                  <ImageCarousel
                    images={images.map(i => ({ src: img(i.src), alt: i.name }))}
                    onChange={setAboutImageIndex}
                    showDots={false}
                  />
                </div>
              </div>
            </div>
            {names.length > 0 && (
              <div className="flex justify-center gap-2 mt-4 z-10">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setAboutImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      i === aboutImageIndex ? 'bg-primary w-5' : 'bg-primary/30 hover:bg-primary/50'
                    }`}
                  />
                ))}
              </div>
            )}
            </div>
        </div>
      </div>
    </section>
  )
}