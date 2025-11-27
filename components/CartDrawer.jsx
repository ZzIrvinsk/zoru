'use client'
import { useCart } from './CartContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function CartDrawer(){
  const { items, open, setOpen, remove, total } = useCart()
  const router = useRouter()
  const [removingId, setRemovingId] = useState(null)

  const goToCheckout = () => {
    setOpen(false)
    router.push('/cart')
  }

  const handleRemove = (id) => {
    setRemovingId(id)
    setTimeout(() => {
      remove(id)
      setRemovingId(null)
    }, 300)
  }

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60]"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300
            }}
            className="fixed right-0 top-0 h-full w-full max-w-[440px] bg-black border-l-2 border-purple-500/50 shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b-2 border-purple-500/30 flex items-center justify-between bg-gradient-to-r from-purple-900/10 to-transparent">
              <div>
                <h3 className="font-black text-2xl text-white tracking-tighter">
                  YOUR CART
                </h3>
                <p className="text-purple-400 text-xs mt-1 font-bold">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              
              <button 
                onClick={() => setOpen(false)}
                className="w-10 h-10 flex items-center justify-center border-2 border-white/10 hover:border-purple-500 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-8xl mb-4">🛒</div>
                  <p className="text-white text-xl font-black mb-2">
                    VACÍO
                  </p>
                  <p className="text-white/50 text-sm mb-6">
                    Agrega productos para empezar
                  </p>
                  <button
                    onClick={() => {
                      setOpen(false)
                      router.push('/tienda')
                    }}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors"
                  >
                    EXPLORAR TIENDA
                  </button>
                </div>
              ) : (
                items.map((it, index) => (
                  <motion.div
                    key={it.product.id}
                    className="group bg-zinc-950 border-2 border-white/10 p-4 hover:border-purple-500/50 transition-all"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex gap-4">
                      {/* Imagen */}
                      <div className="relative w-20 h-20 bg-zinc-900 flex-shrink-0">
                        <Image 
                          src={it.product.image} 
                          alt={it.product.title} 
                          fill
                          className="object-cover"
                        />
                        {/* Badge cantidad */}
                        <div className="absolute top-1 right-1 w-6 h-6 bg-purple-600 text-white text-xs font-black flex items-center justify-center">
                          {it.qty}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold text-sm mb-1 truncate">
                          {it.product.title}
                        </h4>
                        
                        {it.product.selectedSize && (
                          <div className="text-xs text-white/40 mb-1">
                            Talla: {it.product.selectedSize}
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                          <span className="text-purple-400 font-bold">
                            ${it.product.price}
                          </span>
                          <span>×</span>
                          <span>{it.qty}</span>
                        </div>
                        
                        <div className="text-white font-black text-lg">
                          ${(it.product.price * it.qty).toFixed(2)}
                        </div>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemove(it.product.id)}
                        className="w-9 h-9 flex items-center justify-center border-2 border-white/10 hover:border-red-500 hover:bg-red-500 text-white/50 hover:text-white transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t-2 border-purple-500/30 bg-gradient-to-t from-purple-900/10 to-transparent space-y-4">
                
                {/* Total */}
                <div className="flex items-center justify-between p-4 bg-zinc-950 border-2 border-purple-500/30">
                  <span className="text-white/50 text-sm uppercase font-bold">
                    Total
                  </span>
                  <span className="text-white font-black text-4xl">
                    ${total().toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={goToCheckout}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-sm tracking-wider transition-all border-2 border-purple-400"
                >
                  CHECKOUT →
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={() => setOpen(false)}
                  className="w-full py-3 border-2 border-white/20 hover:border-purple-500 text-white text-sm font-bold transition-all"
                >
                  SEGUIR COMPRANDO
                </button>

                {/* Info */}
                <p className="text-white/30 text-xs text-center">
                  🔒 Pago seguro · Envío gratis +$100
                </p>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
