import type { Metadata } from 'next'
import { Cinzel, Lato, Dancing_Script } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
})
const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
})
const dancing = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Menu Automate',
  description: 'Create beautiful restaurant menus from professional templates in minutes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${lato.variable} ${dancing.variable}`}>
      <body>{children}</body>
    </html>
  )
}
