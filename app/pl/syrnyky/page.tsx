import HomePage, { buildPageMetadata } from '../../HomePage'
import type { Metadata } from 'next'

export const generateMetadata = (): Promise<Metadata> => buildPageMetadata('pl', 'syrnyky')

export default function Page() {
  return <HomePage lang="pl" category="syrnyky" initialCategory="syrnyky" />
}