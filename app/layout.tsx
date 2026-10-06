import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import localFont from 'next/font/local'
import { Playfair_Display, Geist, Caveat } from 'next/font/google'
import { LanguageProvider, type Lang } from '@/components/language-context'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/components/cart-context'
import { AuthProvider } from '@/components/auth-context'
import { CookieConsent } from '@/components/cookie-consent'
import { Toaster } from '@/components/ui/sonner'
import { NoiseOverlay } from '@/components/noise-overlay'
import { BASE_PATH, SITE_URL } from '@/lib/constants'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
})

const zhyto = localFont({
  src: './fonts/Zhyto-Regular.otf',
  variable: '--font-zhyto',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-caveat',
  display: 'swap',
})

const konstrukt = localFont({
  src: './fonts/KONSTRUKT-Regular.otf',
  variable: '--font-konstrukt',
  display: 'swap',
})

const geist = Geist({ 
  subsets: ['latin'],
  variable: '--font-geist',
})

const epoch = localFont({
  src: './fonts/Epoch_YP_Demo.otf',
  variable: '--font-epoch',
  display: 'swap',
})

const ogImage = `${SITE_URL}/images/Gemini_Generated_Image_hmwm3ehmwm3ehmwm.png`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'zhyto.london | Authentic Ukrainian Varenyky & Syrnyky',
  },
  description: 'Handcrafted Ukrainian varenyky and syrnyky delivered to your door in London. Order authentic homemade dumplings online \u2014 same-day delivery across Zones 1\u20133, next-day for all London.',
  keywords: [
    'varenyky', 'vareniki', 'ukrainian dumplings', 'syrnyky',
    'ukrainian food london', 'ukrainian restaurant london', 'home made dumplings',
    'pelmeni', 'varenyky delivery london', 'ukrainian cuisine', 'czech dumplings',
    'varenyky online', 'syrnyky london', 'deliver ukrainian food',
  ],
  applicationName: 'zhyto.london',
  category: 'food',
  authors: [{ name: 'zhyto.london' }],
  creator: 'zhyto.london',
  publisher: 'zhyto.london',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'zhyto.london',
    title: 'zhyto.london | Authentic Ukrainian Varenyky & Syrnyky',
    description: 'Handcrafted Ukrainian varenyky and syrnyky delivered to your door in London. Order authentic homemade dumplings online \u2014 same-day delivery across Zones 1\u20133.',
    locale: 'en_GB',
    images: [{ url: ogImage, width: 1024, height: 1024, alt: 'zhyto.london \u2014 Authentic Ukrainian Varenyky & Syrnyky' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'zhyto.london | Authentic Ukrainian Varenyky & Syrnyky',
    description: 'Handcrafted Ukrainian varenyky and syrnyky delivered in London. Order authentic homemade dumplings online.',
    images: [ogImage],
  },
  icons: {
    icon: `${BASE_PATH}/favicon.svg`,
    shortcut: `${BASE_PATH}/favicon.svg`,
    apple: `${SITE_URL}/apple-icon.png`,
  },
  appleWebApp: {
    capable: true,
    title: 'zhyto.london',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: '#c2a57b',
  colorScheme: 'only light',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const h = await headers()
  const locale = (h.get('x-locale') as Lang) || 'en'
  return (
    <html lang={locale} className={`${playfair.variable} ${zhyto.variable} ${geist.variable} ${caveat.variable} ${konstrukt.variable} ${epoch.variable} bg-background`} style={{ colorScheme: 'only light' }}>
      <body className="font-serif antialiased">
        <AuthProvider>
          <LanguageProvider initialLang={locale}>
          <CartProvider>
{children}
            <NoiseOverlay />
            <CookieConsent />
            <Toaster />
          </CartProvider>
        </LanguageProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
