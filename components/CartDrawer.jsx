'use client'
import { useCart } from './CartContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useState, useCallback, useMemo } from 'react'
import { formatPrice } from '@/lib/currency'

export default function CartDrawer() {
  const { items, open, setOpen, remove, total } = useCart()
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()
  const [removingId, setRemovingId] = useState(null)

  // ✅ Memoizar total formateado
  const totalFormatted = useMemo(() => {
    return formatPrice(total())
  }, [total])

  // ✅ Memoizar texto de items
  const itemsText = useMemo(() => {
    return `${items.length} ${items.length === 1 ? 'item' : 'items'}`
  }, [items.length])

  // ✅ useCallback para handlers
  const goToCheckout = useCallback(() => {
    setOpen(false)
    router.push('/cart')
  }, [setOpen, router])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const handleRemove = useCallback((id) => {
    setRemovingId(id)
    setTimeout(() => {
      remove(id)
      setRemovingId(null)
    }, 300)
  }, [remove])

  const goToShop = useCallback(() => {
    setOpen(false)
    router.push('/tienda')
  }, [setOpen, router])

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 1 }}
            exit={prefersReducedMotion ? {} : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60]"
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={prefersReducedMotion ? false : { x: '100%' }}
            animate={prefersReducedMotion ? {} : { x: 0 }}
            exit={prefersReducedMotion ? {} : { x: '100%' }}
            transition={prefersReducedMotion ? {} : { 
              type: 'spring', 
              damping: 30, 
              stiffness: 300
            }}
            className="fixed right-0 top-0 h-full w-full sm:max-w-[400px] md:max-w-[440px] bg-black border-l-2 border-purple-500/50 shadow-2xl z-[70] flex flex-col safe-top safe-bottom"
          >
            {/* Header - responsive */}
            <div className="p-4 md:p-6 border-b-2 border-purple-500/30 flex items-center justify-between bg-gradient-to-r from-purple-900/10 to-transparent">
              <div>
                <h3 className="font-black text-xl md:text-2xl text-white tracking-tighter">
                  YOUR CART
                </h3>
                <p className="text-purple-400 text-[10px] md:text-xs mt-1 font-bold">
                  {itemsText}
                </p>
              </div>
              
              <button 
                onClick={handleClose}
                className="w-9 md:w-10 h-9 md:h-10 flex items-center justify-center border-2 border-white/10 hover:border-purple-500 transition-colors"
                aria-label="Cerrar carrito"
              >
                <svg className="w-4 md:w-5 h-4 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items - responsive scroll */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 space-y-3 md:space-y-4">
              {items.length === 0 ? (
                // ✅ Estado vacío optimizado
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="text-6xl md:text-8xl mb-3 md:mb-4">🛒</div>
                  <p className="text-white text-lg md:text-xl font-black mb-2">
                    VACÍO
                  </p>
                  <p className="text-white/50 text-xs md:text-sm mb-4 md:mb-6">
                    Agrega productos para empezar
                  </p>
                  <button
                    onClick={goToShop}
                    className="px-5 md:px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm md:text-base transition-colors"
                  >
                    EXPLORAR TIENDA
                  </button>
                </div>
              ) : (
                items.map((it, index) => (
                  <motion.div
                    key={`${it.product.id}-${it.product.selectedSize || 'default'}`}
                    className={`group bg-zinc-950 border-2 ${
                      removingId === it.product.id 
                        ? 'border-red-500 opacity-50' 
                        : 'border-white/10 hover:border-purple-500/50'
                    } p-3 md:p-4 transition-all`}
                    initial={prefersReducedMotion ? false : { opacity: 0, x: 50 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                    exit={prefersReducedMotion ? {} : { opacity: 0, x: 50, height: 0 }}
                    transition={prefersReducedMotion ? {} : { 
                      delay: index * 0.05,
                      duration: 0.3
                    }}
                  >
                    <div className="flex gap-3 md:gap-4">
                      {/* Imagen responsive */}
                      <div className="relative w-16 md:w-20 h-16 md:h-20 bg-zinc-900 flex-shrink-0">
                        <Image 
                          src={it.product.image} 
                          alt={it.product.title} 
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                        {/* Badge cantidad */}
                        <div className="absolute top-1 right-1 w-5 md:w-6 h-5 md:h-6 bg-purple-600 text-white text-[10px] md:text-xs font-black flex items-center justify-center">
                          {it.qty}
                        </div>
                      </div>

                      {/* Info responsive */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold text-xs md:text-sm mb-1 truncate">
                          {it.product.title}
                        </h4>
                        
                        {it.product.selectedSize && (
                          <div className="text-[10px] md:text-xs text-white/40 mb-1">
                            Talla: {it.product.selectedSize}
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-[10px] md:text-xs text-white/50 mb-1 md:mb-2">
                          <span className="text-purple-400 font-bold">
                            {formatPrice(it.product.price)}
                          </span>
                          <span>×</span>
                          <span>{it.qty}</span>
                        </div>
                        
                        <div className="text-white font-black text-base md:text-lg">
                          {formatPrice(it.product.price * it.qty)}
                        </div>
                      </div>

                      {/* Remove button responsive */}
                      <button
                        onClick={() => handleRemove(it.product.id)}
                        disabled={removingId === it.product.id}
                        className="w-8 md:w-9 h-8 md:h-9 flex items-center justify-center border-2 border-white/10 hover:border-red-500 hover:bg-red-500 text-white/50 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Eliminar ${it.product.title}`}
                      >
                        <svg className="w-3 md:w-4 h-3 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer - responsive */}
            {items.length > 0 && (
              <div className="p-4 md:p-6 border-t-2 border-purple-500/30 bg-gradient-to-t from-purple-900/10 to-transparent space-y-3 md:space-y-4">
                
                {/* Total responsive */}
                <div className="flex items-center justify-between p-3 md:p-4 bg-zinc-950 border-2 border-purple-500/30">
                  <span className="text-white/50 text-xs md:text-sm uppercase font-bold">
                    Total
                  </span>
                  <span className="text-white font-black text-2xl md:text-4xl">
                    {totalFormatted}
                  </span>
                </div>

                {/* Checkout Button responsive */}
                <motion.button
                  onClick={goToCheckout}
                  className="w-full py-3 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xs md:text-sm tracking-wider transition-all border-2 border-purple-400 relative overflow-hidden group"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Scan effect - solo desktop */}
                  {!prefersReducedMotion && (
                    <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  )}
                  <span className="relative z-10">CHECKOUT →</span>
                </motion.button>

                {/* Continue Shopping responsive */}
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 md:py-3 border-2 border-white/20 hover:border-purple-500 text-white text-xs md:text-sm font-bold transition-all"
                >
                  SEGUIR COMPRANDO
                </button>

                {/* Info responsive */}
                <p className="text-white/30 text-[10px] md:text-xs text-center">
                  🔒 Pago seguro · Envío gratis +S/ 100
                </p>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
