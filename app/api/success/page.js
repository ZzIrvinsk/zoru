'use client'
import { useEffect } from 'react'
import { useCart } from '@/components/CartContext'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CheckoutSuccess() {
  const { clear } = useCart()
  const router = useRouter()

  useEffect(() => {
    // Vaciar carrito al confirmar pago
    clear()
  }, [clear])

  return (
    <div className="bg-black min-h-screen pt-24 pb-16 flex items-center justify-center px-6 relative overflow-hidden">
      
      {/* Decoración */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(#8B5CF6 1px, transparent 1px), linear-gradient(90deg, #8B5CF6 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-600/20 rounded-full blur-3xl" />

      <motion.div
        className="text-center max-w-2xl relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Checkmark animado */}
        <motion.div
          className="inline-block mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring',
            duration: 0.8,
            delay: 0.2
          }}
        >
          <div className="w-32 h-32 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center">
            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
            </svg>
          </div>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-7xl font-black text-white mb-4 leading-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          PAGO
          <span className="block text-green-400 -mt-2">EXITOSO</span>
        </motion.h1>

        <motion.p
          className="text-white/60 text-xl mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          ¡Gracias por tu compra! Tu pedido está siendo procesado. <br/>
          Te enviamos un email con los detalles.
        </motion.p>

        {/* Badges */}
        <motion.div
          className="flex justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {[
            { icon: '📧', text: 'Email enviado' },
            { icon: '📦', text: 'Preparando envío' },
            { icon: '🚚', text: 'Llegada 3-5 días' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 px-4 py-3 bg-white/5 border border-white/10">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-white/60 text-xs">{item.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Botones */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Link href="/">
            <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold tracking-wider transition-colors">
              VOLVER AL INICIO
            </button>
          </Link>

          <Link href="/tienda">
            <button className="px-8 py-4 border-2 border-white/20 hover:border-purple-500 text-white font-bold tracking-wider transition-colors">
              SEGUIR COMPRANDO
            </button>
          </Link>
        </motion.div>

        <motion.p
          className="text-white/30 text-sm mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          ¿Dudas? Escríbenos a <span className="text-purple-400">hola@zoru.pe</span>
        </motion.p>
      </motion.div>
    </div>
  )
}
