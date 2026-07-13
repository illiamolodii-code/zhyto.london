"use client"

import { useState, useRef, useEffect } from 'react'
import { CartDrawer } from '@/components/cart-drawer'
import { CheckoutModal } from '@/components/checkout-modal'
import SectionWave from '@/components/SectionWave'
import Header from '@/components/sections/Header'
import HeroSection from '@/components/sections/HeroSection'
import ProductsSection from '@/components/sections/ProductsSection'
import AboutSection from '@/components/sections/AboutSection'
import DeliverySection from '@/components/sections/DeliverySection'
import ReviewsSection from '@/components/sections/ReviewsSection'
import FAQSection from '@/components/sections/FAQSection'
import Footer from '@/components/sections/Footer'
import ScrollButtons from '@/components/sections/ScrollButtons'
import SignInModal from '@/components/sections/SignInModal'
import SplashScreen from '@/components/SplashScreen'

interface Product {
  id: number
  name: string
  name_uk?: string | null
  name_en?: string | null
  name_pl?: string | null
  description: string
  description_uk?: string | null
  description_en?: string | null
  description_pl?: string | null
  price: number
  unit: string
  image: string
  background_image: string
  badge: string
  category: string
  stock: number
  available: boolean
  ingredients: string
  cooking: string
  ingredients_uk: string
  ingredients_en: string
  recipe_uk: string
  recipe_en: string
  recipe_pl: string
  ingredients_pl: string
}

export default function Home() {
  const [ready, setReady] = useState(false)
  const [preloadedProducts, setPreloadedProducts] = useState<Product[] | null>(null)
  const [preloadedCategoryOrder, setPreloadedCategoryOrder] = useState<string[] | null>(null)
  const [preloadedCategoryNames, setPreloadedCategoryNames] = useState<Record<string, string>>({})
  const [preloadedCategoryDescriptions, setPreloadedCategoryDescriptions] = useState<Record<string, string>>({})
  const [preloadedCategoryNamesPl, setPreloadedCategoryNamesPl] = useState<Record<string, string>>({})
  const [preloadedCategoryDescPl, setPreloadedCategoryDescPl] = useState<Record<string, string>>({})
  const [preloadedCategoryDescUk, setPreloadedCategoryDescUk] = useState<Record<string, string>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [signInModalOpen, setSignInModalOpen] = useState(false)
  const [activeProducts, setActiveProducts] = useState<any[]>([])

  const [headerMode, setHeaderMode] = useState<'visible' | 'hidden'>('visible')
  const [isOnProducts, setIsOnProducts] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showScrollBottom, setShowScrollBottom] = useState(true)

  const headerModeRef = useRef(headerMode)
  headerModeRef.current = headerMode
  const isOnProductsRef = useRef(false)
  const prevScrollY = useRef(0)
  const productsTopRef = useRef(0)
  const aboutTopRef = useRef(0)

  useEffect(() => {
    const el = document.getElementById('products')
    if (el) productsTopRef.current = el.offsetTop
    const aboutEl = document.getElementById('about')
    if (aboutEl) aboutTopRef.current = aboutEl.offsetTop
  }, [])

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY
          const maxY = document.documentElement.scrollHeight - window.innerHeight
          const atTop = y < 50
          const atBottom = y > maxY - 100
          const goingDown = y > prevScrollY.current

          if (window.innerWidth < 1024 && aboutTopRef.current > 0) {
            const v = y >= productsTopRef.current - 100 && y < aboutTopRef.current - 100
            if (v !== isOnProductsRef.current) { isOnProductsRef.current = v; setIsOnProducts(v) }
          } else if (isOnProductsRef.current) {
            isOnProductsRef.current = false; setIsOnProducts(false)
          }

          if (atTop || !goingDown || atBottom) {
            if (headerModeRef.current !== 'visible') setHeaderMode('visible')
          } else if (goingDown && y >= productsTopRef.current - 100) {
            if (headerModeRef.current !== 'hidden') setHeaderMode('hidden')
          }

          prevScrollY.current = y
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const update = () => {
      const maxY = document.documentElement.scrollHeight - window.innerHeight
      setShowScrollTop(window.scrollY > 300)
      setShowScrollBottom(window.scrollY < maxY - 100)
      timeout = setTimeout(update, 200)
    }
    timeout = setTimeout(update, 200)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <>
      {!ready && (
        <SplashScreen
          onReady={() => setReady(true)}
          onLoad={async () => {
            const [productsRes, settingsRes] = await Promise.all([
              fetch('/api/products').catch(() => null),
              fetch('/api/public-settings').catch(() => null),
            ])
            if (productsRes?.ok) {
              const data = await productsRes.json()
              setPreloadedProducts(data || [])
            }
            if (settingsRes?.ok) {
              const data = await settingsRes.json()
              if (data.categories) setPreloadedCategoryOrder(data.categories as string[])
              if (data.categories_names) setPreloadedCategoryNames(data.categories_names as Record<string, string>)
              if (data.categories_desc) setPreloadedCategoryDescriptions(data.categories_desc as Record<string, string>)
              if (data.categories_names_pl) setPreloadedCategoryNamesPl(data.categories_names_pl as Record<string, string>)
              if (data.categories_desc_pl) setPreloadedCategoryDescPl(data.categories_desc_pl as Record<string, string>)
              if (data.categories_desc_uk) setPreloadedCategoryDescUk(data.categories_desc_uk as Record<string, string>)
            }
          }}
        />
      )}
      <main className="min-h-screen bg-background">
        <Header setCartOpen={setCartOpen} setSignInModalOpen={setSignInModalOpen} headerMode={headerMode} />
        <HeroSection />
      <SectionWave color="#f5ead6" animate overlap />
      <ProductsSection
        onProductsChange={setActiveProducts}
        setCartOpen={setCartOpen}
        preloadedProducts={preloadedProducts}
        preloadedCategoryOrder={preloadedCategoryOrder}
        preloadedCategoryNames={preloadedCategoryNames}
        preloadedCategoryDescriptions={preloadedCategoryDescriptions}
        preloadedCategoryNamesPl={preloadedCategoryNamesPl}
        preloadedCategoryDescPl={preloadedCategoryDescPl}
        preloadedCategoryDescUk={preloadedCategoryDescUk}
      />
      <SectionWave color="#c2a57b" animate overlap />
      <AboutSection />
      <SectionWave color="#f5ead6" animate overlap />
      <DeliverySection />
      <FAQSection />
      <SectionWave color="#000" animate overlap />
      <ReviewsSection setSignInModalOpen={setSignInModalOpen} />
      <Footer />

      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        products={activeProducts}
        onCheckout={() => setCheckoutOpen(true)}
      />
      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        products={activeProducts}
      />
      <SignInModal open={signInModalOpen} onOpenChange={setSignInModalOpen} />

      <ScrollButtons
        showScrollTop={showScrollTop}
        showScrollBottom={showScrollBottom}
        isOnProducts={isOnProducts}
        cartOpen={cartOpen}
        checkoutOpen={checkoutOpen}
      />
    </main>
    </>
  )
}
