import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CartProvider from '@/components/CartContext'
import CartDrawer from '../components/CartDrawer'
import PointsProvider from '../components/PointsContext'
import WishlistProvider from '../components/WishlistContext'

export const metadata = {
  title: 'Zoru',
  description: 'Streetwear exclusivo · Drops limitados · Diseño premium'
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <PointsProvider>
            <WishlistProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <CartDrawer />
            </WishlistProvider>
          </PointsProvider>
        </CartProvider>
      </body>
    </html>
  )
}
