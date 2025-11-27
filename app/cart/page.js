'use client'
import { useCart } from '@/components/CartContext'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'


export default function CartPage() {
  const { items, remove, total, clear } = useCart()
  const router = useRouter()
  const [removingId, setRemovingId] = useState(null)
  const [loading, setLoading] = useState(false)


  const handleRemove = (id) => {
    setRemovingId(id)
    setTimeout(() => {
      remove(id)
      setRemovingId(null)
    }, 300)
  }


  const handleCheckout = async () => {
    setLoading(true)


    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items,
          customerEmail: 'customer@zoru.pe'
        }),
      })


      if (!response.ok) {
        throw new Error('Error al crear preferencia de pago')
      }


      const data = await response.json()
      window.location.href = data.init_point || data.sandbox_init_point  // ✅ ÚNICO CAMBIO: invertido el orden


    } catch (error) {
      console.error('Error en checkout:', error)
      alert('Hubo un error al procesar el pago. Intenta de nuevo.')
      setLoading(false)
    }
  }


  return (
    <div className="bg-black min-h-screen pt-24 pb-16 relative overflow-hidden">
      
      {/* Decoración de fondo */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(#8B5CF6 1px, transparent 1px), linear-gradient(90deg, #8B5CF6 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />


      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />


      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
              YOUR
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 -mt-2">
                CART
              </span>
            </h1>


            {items.length > 0 && (
              <motion.div
                className="px-6 py-3 bg-purple-600/20 border-2 border-purple-500/50 backdrop-blur-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <div className="text-purple-400 text-xs font-bold tracking-widest mb-1">
                  ITEMS
                </div>
                <div className="text-white text-3xl font-black">
                  {items.length}
                </div>
              </motion.div>
            )}
          </div>


          <div className="flex items-center gap-3">
            <div className="w-16 h-[2px] bg-purple-500" />
            <p className="text-white/50 text-sm">
              {items.length === 0 ? 'Tu carrito está vacío' : 'Listo para checkout'}
            </p>
          </div>
        </motion.div>


        {items.length === 0 ? (
          // Empty State
          <motion.div
            className="text-center py-20 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] font-black text-purple-500/5 pointer-events-none select-none">
              0
            </div>


            <motion.div
              className="relative z-10"
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="text-9xl mb-6">🛒</div>
            </motion.div>


            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
              NADA POR AQUÍ
            </h2>
            <p className="text-white/50 text-lg mb-8 max-w-md mx-auto">
              Agrega algunos productos brutales y comienza tu drop
            </p>


            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/tienda">
                <motion.button 
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-black tracking-wider transition-colors relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10">EXPLORAR TIENDA</span>
                </motion.button>
              </Link>


              <Link href="/colecciones">
                <motion.button 
                  className="px-8 py-4 border-2 border-white/20 hover:border-purple-500 text-white font-bold tracking-wider transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  VER DROPS
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ) : (
          // Cart con items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((it, index) => (
                <motion.div
                  key={it.product.id}
                  className={`group relative bg-zinc-950/50 backdrop-blur-sm border-2 border-white/10 hover:border-purple-500/50 p-6 transition-all ${
                    removingId === it.product.id ? 'opacity-50' : ''
                  }`}
                  initial={{ opacity: 0, x: -50, rotate: -2 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  transition={{ 
                    delay: index * 0.1
                  }}
                  layout
                >
                  <div className="absolute top-4 right-4 text-8xl font-black text-purple-500/5 pointer-events-none select-none">
                    {index + 1}
                  </div>


                  <div className="flex gap-6 relative z-10">
                    <div className="relative w-32 h-32 bg-zinc-900 overflow-hidden flex-shrink-0 border-2 border-white/10 group-hover:border-purple-500/30 transition-all">
                      <Image
                        src={it.product.image}
                        alt={it.product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      <div className="absolute top-2 right-2 w-8 h-8 bg-purple-600 text-white text-sm font-black flex items-center justify-center">
                        {it.qty}
                      </div>
                    </div>


                    <div className="flex-1">
                      <h3 className="text-white font-black text-2xl mb-2 leading-tight">
                        {it.product.title}
                      </h3>
                      <p className="text-white/50 text-sm mb-4 line-clamp-1">
                        {it.product.description}
                      </p>


                      {it.product.selectedSize && (
                        <div className="inline-block px-3 py-1 border border-white/20 text-white/60 text-xs mb-3">
                          TALLA: {it.product.selectedSize}
                        </div>
                      )}


                      <div className="flex items-center gap-4">
                        <div className="text-purple-400 font-bold text-lg">
                          ${it.product.price}
                        </div>
                        <div className="text-white/30 text-sm">
                          × {it.qty}
                        </div>
                        <div className="text-white/30">→</div>
                        <div className="text-white font-black text-2xl">
                          ${(it.product.price * it.qty).toFixed(2)}
                        </div>
                      </div>
                    </div>


                    <motion.button
                      onClick={() => handleRemove(it.product.id)}
                      className="w-12 h-12 flex items-center justify-center border-2 border-white/10 hover:border-red-500 hover:bg-red-500 transition-all text-white/50 hover:text-white"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                  </div>


                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                </motion.div>
              ))}


              <motion.button
                onClick={clear}
                className="text-red-400 text-sm font-bold hover:text-red-500 transition-colors flex items-center gap-2 group"
                whileHover={{ x: 5 }}
              >
                <span className="group-hover:underline">VACIAR CARRITO</span>
                <span className="text-xs">→</span>
              </motion.button>
            </div>


            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                className="sticky top-24 bg-zinc-950/80 backdrop-blur-xl border-2 border-purple-500/30 p-8 relative overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl" />


                <div className="relative z-10">
                  <h3 className="text-white font-black text-2xl mb-6 tracking-wider flex items-center gap-3">
                    <span>RESUMEN</span>
                    <div className="flex-1 h-[2px] bg-gradient-to-r from-purple-500 to-transparent" />
                  </h3>


                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-white/50 text-sm">
                      <span>Subtotal</span>
                      <span className="font-bold">S/ {total().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white/50 text-sm">
                      <span>Envío</span>
                      <span className="text-xs">En checkout</span>
                    </div>
                    
                    <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />


                    <motion.div 
                      className="flex justify-between items-center p-4 bg-purple-600/10 border-2 border-purple-500/30"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="text-white font-bold text-sm tracking-wider">TOTAL</span>
                      <span className="text-white font-black text-4xl">
                        S/ {total().toFixed(2)}
                      </span>
                    </motion.div>
                  </div>


                  <motion.button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-black text-sm tracking-wider transition-all mb-4 relative overflow-hidden group border-2 border-purple-400"
                    whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative z-10">
                      {loading ? 'PROCESANDO...' : 'PROCEDER AL PAGO →'}
                    </span>
                  </motion.button>


                  <Link href="/tienda">
                    <button className="w-full py-4 border-2 border-white/20 hover:border-purple-500 hover:bg-purple-500/10 text-white text-sm font-bold tracking-wider transition-all">
                      SEGUIR COMPRANDO
                    </button>
                  </Link>


                  <div className="mt-8 pt-8 border-t-2 border-white/10 space-y-3">
                    {[
                      { icon: '🚚', text: 'Envío seguro garantizado' },
                      { icon: '↩️', text: 'Devoluciones en 30 días' },
                      { icon: '🔒', text: 'Pago 100% seguro' }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3 text-white/60 text-xs group hover:text-purple-400 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span>{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
