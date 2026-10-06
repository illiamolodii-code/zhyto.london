import HomePage, { buildPageMetadata } from '../../HomePage'
import type { Metadata } from 'next'

export const generateMetadata = (): Promise<Metadata> => buildPageMetadata('uk', 'syrnyky')

export default function Page() {
  return <HomePage lang="uk" category="syrnyky" initialCategory="syrnyky" />
}