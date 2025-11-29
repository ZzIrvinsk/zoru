'use client'
import { useCart } from '@/components/CartContext'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo } from 'react'

export default function CartPage() {
  const { items, remove, total, clear } = useCart()
  const router = useRouter()
  const [removingId, setRemovingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  // Modal de checkout
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState(1) // 1: datos, 2: método

  // Datos del cliente
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerDistrict, setCustomerDistrict] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [customerReference, setCustomerReference] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('mercadopago')

  const totalAmount = useMemo(() => total(), [items, total])

  const handleRemove = (id) => {
    setRemovingId(id)
    setTimeout(() => {
      remove(id)
      setRemovingId(null)
    }, 300)
  }

  const validateForm = () => {
    if (!customerName || !customerPhone || !customerDistrict || !customerAddress) {
      alert('Por favor completa tus datos de envío antes de continuar.')
      return false
    }
    return true
  }

  const handleOpenCheckout = () => {
    if (items.length === 0) return
    setCheckoutStep(1)
    setShowCheckoutModal(true)
  }

  const handleNextFromForm = () => {
    if (!validateForm()) return
    setCheckoutStep(2)
  }

  const handleConfirmPayment = async () => {
    // Yape / Contraentrega → por ahora solo registrar y avisar
    if (paymentMethod === 'yape' || paymentMethod === 'contraentrega') {
      console.log('Pedido por:', paymentMethod, {
        customerName,
        customerEmail,
        customerPhone,
        customerDistrict,
        customerAddress,
        customerReference,
        items,
        total: totalAmount,
      })
      alert(
        paymentMethod === 'yape'
          ? 'Tu pedido por Yape fue registrado. En breve te contactaremos por WhatsApp para coordinar el pago.'
          : 'Tu pedido contraentrega fue registrado. En breve te contactaremos para coordinar la entrega.'
      )
      setShowCheckoutModal(false)
      return
    }

    // Mercado Pago
    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerEmail: customerEmail || 'customer@zoru.pe',
          customerName,
          customerPhone,
          customerDistrict,
          customerAddress,
          customerReference,
          paymentMethod: 'mercadopago',
        }),
      })

      if (!response.ok) {
        throw new Error('Error al crear preferencia de pago')
      }

      const data = await response.json()
      window.location.href = data.init_point || data.sandbox_init_point
    } catch (error) {
      console.error('Error en checkout:', error)
      alert('Hubo un error al procesar el pago. Intenta de nuevo.')
      setLoading(false)
    }
  }

  const fadeIn = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
      }

  return (
    <div className="bg-black min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Fondo */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#8B5CF6 1px, transparent 1px), linear-gradient(90deg, #8B5CF6 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          willChange: 'auto',
        }}
      />
      <div className="absolute top-1/4 -left-32 w-64 md:w-96 h-64 md:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-64 md:w-96 h-64 md:h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        {/* Header */}
        <motion.div className="mb-12" {...fadeIn}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <span className="text-[10px] md:text-xs tracking-[0.25em] text-purple-400 font-bold uppercase">
                ZORU / CHECKOUT
              </span>
              <h1 className="mt-2 text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">
                TU
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 -mt-1 md:-mt-2">
                  CARRITO
                </span>
              </h1>
              <div className="mt-2 h-[2px] w-24 md:w-40 bg-gradient-to-r from-purple-500 via-pink-500 to-transparent" />
            </div>

            {items.length > 0 && (
              <motion.div
                className="px-4 md:px-6 py-2 md:py-3 bg-purple-600/20 border-2 border-purple-500/50 backdrop-blur-sm"
                initial={prefersReducedMotion ? false : { scale: 0 }}
                animate={prefersReducedMotion ? {} : { scale: 1 }}
                transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
              >
                <div className="text-purple-400 text-[10px] md:text-xs font-bold tracking-widest mb-1">
                  ITEMS
                </div>
                <div className="text-white text-2xl md:text-3xl font-black">{items.length}</div>
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 md:w-16 h-[2px] bg-purple-500" />
            <p className="text-white/50 text-xs md:text-sm">
              {items.length === 0
                ? 'Tu carrito está vacío'
                : 'Revisa tu carrito y procede al pago.'}
            </p>
          </div>
        </motion.div>

        {items.length === 0 ? (
          // Empty State
          <motion.div
            className="text-center py-20 relative"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] md:text-[300px] font-black text-purple-500/5 pointer-events-none select-none"
              aria-hidden="true"
            >
              0
            </div>

            <motion.div
              className="relative z-10"
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      y: [0, -10, 0],
                    }
              }
              transition={
                prefersReducedMotion
                  ? {}
                  : {
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      repeatType: 'loop',
                    }
              }
            >
              <div className="text-7xl md:text-9xl mb-6">🛒</div>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
              NADA POR AQUÍ
            </h2>
            <p className="text-white/50 text-base md:text-lg mb-8 max-w-md mx-auto px-4">
              Agrega algunos productos brutales y comienza tu drop
            </p>

            <div className="flex gap-4 justify-center flex-wrap px-4">
              <Link href="/tienda">
                <motion.button
                  className="px-6 md:px-8 py-3 md:py-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm md:text-base tracking-wider transition-colors relative overflow-hidden group"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10">EXPLORAR TIENDA</span>
                </motion.button>
              </Link>

              <Link href="/colecciones">
                <motion.button
                  className="px-6 md:px-8 py-3 md:py-4 border-2 border-white/20 hover:border-purple-500 text-white font-bold text-sm md:text-base tracking-wider transition-colors"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  VER DROPS
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ) : (
          // Cart con items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((it, index) => (
                <motion.div
                  key={it.product.id}
                  className={`group relative bg-zinc-950/50 backdrop-blur-sm border-2 border-white/10 hover:border-purple-500/50 p-4 md:p-6 transition-colors duration-300 S/{
                    removingId === it.product.id ? 'opacity-50' : ''
                  }`}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -30 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                  transition={{
                    delay: Math.min(index * 0.08, 0.4),
                    duration: 0.4,
                  }}
                  layout
                >
                  <div
                    className="absolute top-4 right-4 text-6xl md:text-8xl font-black text-purple-500/5 pointer-events-none select-none"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </div>

                  <div className="flex gap-4 md:gap-6 relative z-10">
                    <div className="relative w-24 md:w-32 h-24 md:h-32 bg-zinc-900 overflow-hidden flex-shrink-0 border-2 border-white/10 group-hover:border-purple-500/30 transition-colors">
                      <Image
                        src={it.product.image}
                        alt={it.product.title}
                        fill
                        sizes="(max-width: 768px) 96px, 128px"
                        loading="lazy"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      <div className="absolute top-2 right-2 w-7 md:w-8 h-7 md:h-8 bg-purple-600 text-white text-xs md:text-sm font-black flex items-center justify-center">
                        {it.qty}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-black text-lg md:text-2xl mb-1 md:mb-2 leading-tight line-clamp-2">
                        {it.product.title}
                      </h3>
                      <p className="text-white/50 text-xs md:text-sm mb-3 md:mb-4 line-clamp-1">
                        {it.product.description}
                      </p>

                      {it.product.selectedSize && (
                        <div className="inline-block px-2 md:px-3 py-1 border border-white/20 text-white/60 text-[10px] md:text-xs mb-3">
                          TALLA: {it.product.selectedSize}
                        </div>
                      )}

                      <div className="flex items-center gap-2 md:gap-4 flex-wrap text-sm md:text-base">
                        <div className="text-purple-400 font-bold text-base md:text-lg">
                          S/{it.product.price}
                        </div>
                        <div className="text-white/30 text-xs md:text-sm">× {it.qty}</div>
                        <div className="text-white/30 hidden md:block">→</div>
                        <div className="text-white font-black text-xl md:text-2xl">
                          {(it.product.price * it.qty).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => handleRemove(it.product.id)}
                      className="w-10 md:w-12 h-10 md:h-12 flex items-center justify-center border-2 border-white/10 hover:border-red-500 hover:bg-red-500 transition-all text-white/50 hover:text-white flex-shrink-0"
                      whileHover={prefersReducedMotion ? {} : { scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Eliminar producto"
                    >
                      <svg
                        className="w-4 md:w-5 h-4 md:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </motion.button>
                  </div>

                  <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                </motion.div>
              ))}

              <motion.button
                onClick={clear}
                className="text-red-400 text-xs md:text-sm font-bold hover:text-red-500 transition-colors flex items-center gap-2 group mt-4"
                whileHover={prefersReducedMotion ? {} : { x: 5 }}
              >
                <span className="group-hover:underline">VACIAR CARRITO</span>
                <span className="text-xs">→</span>
              </motion.button>
            </div>

            {/* Sidebar solo resumen + botón */}
            <div className="lg:col-span-1">
              <motion.div
                className="lg:sticky lg:top-24 bg-zinc-950/80 backdrop-blur-xl border-2 border-purple-500/30 p-6 md:p-8 relative overflow-hidden"
                initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <div className="absolute -top-20 -right-20 w-32 md:w-40 h-32 md:h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <h3 className="text-white font-black text-xl md:text-2xl mb-4 tracking-wider flex items-center gap-3">
                    <span>RESUMEN</span>
                    <div className="flex-1 h-[2px] bg-gradient-to-r from-purple-500 to-transparent" />
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-white/50 text-xs md:text-sm">
                      <span>Subtotal</span>
                      <span className="font-bold">S/ {totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white/50 text-xs md:text-sm">
                      <span>Envío</span>
                      <span className="text-[10px] md:text-xs">Se coordina según distrito</span>
                    </div>
                    <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                    <motion.div
                      className="flex justify-between items-center p-3 md:p-4 bg-purple-600/10 border-2 border-purple-500/30"
                      initial={prefersReducedMotion ? false : { scale: 0.95 }}
                      animate={prefersReducedMotion ? {} : { scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                    >
                      <span className="text-white font-bold text-xs md:text-sm tracking-wider">TOTAL</span>
                      <span className="text-white font-black text-3xl md:text-4xl">
                        S/ {totalAmount.toFixed(2)}
                      </span>
                    </motion.div>
                  </div>

                  {/* Botón que abre el modal */}
                  <motion.button
                    onClick={handleOpenCheckout}
                    disabled={loading}
                    className="w-full py-4 md:py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-black text-xs md:text-sm tracking-wider transition-all mb-4 relative overflow-hidden group border-2 border-purple-400"
                    whileHover={prefersReducedMotion || loading ? {} : { scale: 1.02, y: -2 }}
                    whileTap={loading ? {} : { scale: 0.98 }}
                  >
                    <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative z-10">PROCEDER AL PAGO →</span>
                  </motion.button>

                  <Link href="/tienda">
                    <button className="w-full py-3 md:py-4 border-2 border-white/20 hover:border-purple-500 hover:bg-purple-500/10 text-white text-xs md:text-sm font-bold tracking-wider transition-all">
                      SEGUIR COMPRANDO
                    </button>
                  </Link>

                  <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t-2 border-white/10 space-y-3">
                    {[
                      { icon: '🚚', text: 'Envío seguro a todo Perú' },
                      { icon: '↩️', text: 'Cambios dentro de 7 días' },
                      { icon: '🔒', text: 'Tus datos están protegidos' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3 text-white/60 text-[10px] md:text-xs group hover:text-purple-400 transition-colors"
                        initial={prefersReducedMotion ? false : { opacity: 0, x: -15 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.08, duration: 0.3 }}
                      >
                        <span className="text-sm md:text-base">{item.icon}</span>
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

      {/* MODAL DE CHECKOUT */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !loading && setShowCheckoutModal(false)}
          />
          {/* contenido */}
          <motion.div
            className="relative z-50 w-[95%] max-w-lg bg-zinc-950 border-2 border-purple-500/40 p-6 md:p-8 shadow-2xl"
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-black text-xl md:text-2xl tracking-tight">
                {checkoutStep === 1 ? 'Datos de envío' : 'Elige tu método de pago'}
              </h2>
              <button
                onClick={() => !loading && setShowCheckoutModal(false)}
                className="text-white/50 hover:text-white text-xl"
              >
                ×
              </button>
            </div>

            {checkoutStep === 1 && (
              <div className="space-y-3 text-xs md:text-sm">
                <div className="flex flex-col gap-1">
                  <label className="text-white/60">Nombre completo *</label>
                  <input
                    className="bg-black border border-white/20 px-3 py-2 text-white text-xs md:text-sm outline-none focus:border-purple-500"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-white/60">Correo electrónico</label>
                  <input
                    className="bg-black border border-white/20 px-3 py-2 text-white text-xs md:text-sm outline-none focus:border-purple-500"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-white/60">Celular / WhatsApp *</label>
                  <input
                    className="bg-black border border-white/20 px-3 py-2 text-white text-xs md:text-sm outline-none focus:border-purple-500"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-white/60">Distrito *</label>
                  <input
                    className="bg-black border border-white/20 px-3 py-2 text-white text-xs md:text-sm outline-none focus:border-purple-500"
                    value={customerDistrict}
                    onChange={(e) => setCustomerDistrict(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-white/60">Dirección exacta *</label>
                  <input
                    className="bg-black border border-white/20 px-3 py-2 text-white text-xs md:text-sm outline-none focus:border-purple-500"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-white/60">Referencia (opcional)</label>
                  <input
                    className="bg-black border border-white/20 px-3 py-2 text-white text-xs md:text-sm outline-none focus:border-purple-500"
                    value={customerReference}
                    onChange={(e) => setCustomerReference(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleNextFromForm}
                  className="mt-4 w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs md:text-sm tracking-wider border border-purple-400"
                >
                  SIGUIENTE →
                </button>
              </div>
            )}

            {checkoutStep === 2 && (
              <div className="space-y-4 text-xs md:text-sm">
                <p className="text-white/60">
                  Total a pagar:{' '}
                  <span className="text-white font-bold">S/ {totalAmount.toFixed(2)}</span>
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mercadopago')}
                    className={`w-full border px-3 py-2 text-left transition-all S/{
                      paymentMethod === 'mercadopago'
                        ? 'border-purple-500 bg-purple-600/20 text-white'
                        : 'border-white/20 text-white/70 hover:border-purple-500/70'
                    }`}
                  >
                    💳 Mercado Pago (tarjeta / débito)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('yape')}
                    className={`w-full border px-3 py-2 text-left transition-all S/{
                      paymentMethod === 'yape'
                        ? 'border-purple-500 bg-purple-600/20 text-white'
                        : 'border-white/20 text-white/70 hover:border-purple-500/70'
                    }`}
                  >
                    📱 Yape (coordinar por WhatsApp)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('contraentrega')}
                    className={`w-full border px-3 py-2 text-left transition-all S/{
                      paymentMethod === 'contraentrega'
                        ? 'border-purple-500 bg-purple-600/20 text-white'
                        : 'border-white/20 text-white/70 hover:border-purple-500/70'
                    }`}
                  >
                    🚚 Contraentrega (pago al recibir)
                  </button>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setCheckoutStep(1)}
                    className="flex-1 py-3 border border-white/30 text-white text-xs md:text-sm"
                  >
                    ← ATRÁS
                  </button>
                  <button
                    onClick={handleConfirmPayment}
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs md:text-sm tracking-wider border border-purple-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
                  >
                    {loading && paymentMethod === 'mercadopago'
                      ? 'PROCESANDO...'
                      : paymentMethod === 'mercadopago'
                      ? 'PAGAR CON MERCADO PAGO'
                      : paymentMethod === 'yape'
                      ? 'CONFIRMAR POR YAPE'
                      : 'CONFIRMAR CONTRAENTREGA'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}
