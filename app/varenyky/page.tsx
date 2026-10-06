import HomePage, { buildPageMetadata } from '../HomePage'
import type { Metadata } from 'next'

export const generateMetadata = (): Promise<Metadata> => buildPageMetadata('en', 'varenyky')

export default function Page() {
  return <HomePage lang="en" category="varenyky" initialCategory="varenyky" />
}