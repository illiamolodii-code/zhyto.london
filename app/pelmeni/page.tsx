import HomePage, { buildPageMetadata } from '../HomePage'
import type { Metadata } from 'next'

export const generateMetadata = (): Promise<Metadata> => buildPageMetadata('en', 'pelmeni')

export default function Page() {
  return <HomePage lang="en" category="pelmeni" initialCategory="pelmeni" />
}