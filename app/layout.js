// app/layout.js
import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CartProvider from '../components/CartContext'
import CartDrawer from '../components/CartDrawer'
import { SessionProvider } from 'next-auth/react'

export const metadata = {
  title: 'ZORU | Streetwear Exclusivo',
  description:
    'Drops limitados de streetwear premium. Solo 999 unidades por colección. Diseños únicos que nunca se vuelven a producir.',
  keywords:
    'streetwear, ropa exclusiva, drops limitados, moda urbana, hoodies, tees, accesorios',
  authors: [{ name: 'ZORU' }],
  creator: 'ZORU',
  publisher: 'ZORU',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: 'https://zoruperu.vercel.app',
    title: 'ZORU | Streetwear Exclusivo',
    description:
      'Drops limitados de streetwear premium. Solo 999 unidades por colección.',
    siteName: 'ZORU',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ZORU Streetwear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZORU | Streetwear Exclusivo',
    description:
      'Drops limitados de streetwear premium. Solo 999 unidades por colección.',
    images: ['/og-image.jpg'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
    { media: '(prefers-color-scheme: light)', color: '#000000' },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {/* Preconnect para optimizar carga de fuentes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-black text-white antialiased" suppressHydrationWarning>
        <SessionProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
            </div>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
