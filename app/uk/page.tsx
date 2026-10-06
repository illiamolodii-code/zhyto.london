import HomePage, { buildPageMetadata } from '../HomePage'
import type { Metadata } from 'next'

export const generateMetadata = (): Promise<Metadata> => buildPageMetadata('uk')

export default function Page() {
  return <HomePage lang="uk" />
}