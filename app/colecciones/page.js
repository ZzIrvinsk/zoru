'use client'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { formatPrice } from '../../lib/currency'



// ✅ COMPONENTE: Contador Animado
function AnimatedCounter({ value, duration = 2 }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let start = 0
    const end = parseInt(value)
    if (start === end) return

    let timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start === end) clearInterval(timer)
    }, (duration * 1000) / end)

    return () => clearInterval(timer)
  }, [value, duration])

  return <span>{count}</span>
}

// ✅ COMPONENTE: Modal de Notificaciones
function NotifyModal({ isOpen, onClose, dropName }) {
  const prefersReducedMotion = useReducedMotion()
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    
    try {
      const notifications = JSON.parse(localStorage.getItem('zoru_notifications') || '[]')
      notifications.push({
        email,
        dropName,
        timestamp: new Date().toISOString()
      })
      localStorage.setItem('zoru_notifications', JSON.stringify(notifications))
      
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setEmail('')
      }, 2000)
    } catch(err) {
      console.error(err)
    }
  }, [email, dropName, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        exit={prefersReducedMotion ? {} : { opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
        onClick={onClose}
      />

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
        exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-6"
        onClick={onClose}
      >
        <div 
          className="bg-black border-2 border-purple-500/50 p-6 md:p-8 max-w-md w-full relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 md:top-4 right-3 md:right-4 w-8 h-8 flex items-center justify-center border border-white/10 hover:border-purple-500 text-white/50 hover:text-white transition-colors"
            aria-label="Cerrar modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {success ? (
            <motion.div 
              className="text-center py-6 md:py-8"
              initial={prefersReducedMotion ? false : { scale: 0.9, opacity: 0 }}
              animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="text-5xl md:text-7xl mb-3 md:mb-4"
                animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                ✓
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2 md:mb-3">
                ¡LISTO!
              </h3>
              <p className="text-white/60 text-xs md:text-sm px-4">
                Te avisaremos cuando <span className="text-purple-400 font-bold">{dropName}</span> esté disponible
              </p>
            </motion.div>
          ) : (
            <>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
                ACTIVAR
                <span className="block text-purple-400">RECORDATORIO</span>
              </h3>
              
              <p className="text-white/60 text-xs md:text-sm mb-6 leading-relaxed">
                Te enviaremos un email cuando <span className="text-purple-400 font-bold">{dropName}</span> esté listo para comprar
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/50 text-xs font-bold mb-2 tracking-wider">
                    TU EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="w-full px-3 md:px-4 py-3 bg-white/5 border border-white/10 focus:border-purple-500 text-white text-sm md:text-base placeholder:text-white/30 outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 md:py-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs md:text-sm tracking-wider transition-colors relative overflow-hidden group"
                >
                  <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  <span className="relative z-10">NOTIFICARME</span>
                </button>

                <p className="text-white/30 text-[10px] md:text-xs text-center">
                  Sin spam. Solo te avisamos del drop.
                </p>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// ✅ PÁGINA DROPS - ULTRA IMPACTANTE
export default function DropsPage() {
  const prefersReducedMotion = useReducedMotion()
  const [products, setProducts] = useState([])
  const [notifyModal, setNotifyModal] = useState({ open: false, dropName: '' })
  const [activeTab, setActiveTab] = useState('upcoming')
  
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Cargar productos
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err))
  }, [])

  const liveDrop = useMemo(() => products[0] || null, [products])
  const upcomingDrops = useMemo(() => products.slice(1, 4), [products])
  const soldOutDrops = useMemo(() => products.slice(4, 8), [products])

  const stats = useMemo(() => ({
    totalDrops: 3,
    soldOut: 1,
    upcoming: 3,
    activeNow: liveDrop ? 1 : 0
  }), [liveDrop])

  const handleOpenNotify = useCallback((dropName) => {
    setNotifyModal({ open: true, dropName })
  }, [])

  const handleCloseNotify = useCallback(() => {
    setNotifyModal({ open: false, dropName: '' })
  }, [])

  return (
    <div className="bg-black min-h-screen overflow-x-hidden">
      
      {/* ✅ HERO ULTRA IMPACTANTE - MÁS GRANDE */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-4 md:px-6 overflow-hidden"
      >
        {/* Partículas flotantes */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-500/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}

        {/* Grid retro animado */}
        <motion.div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{
            backgroundImage: 'linear-gradient(#8B5CF6 1px, transparent 1px), linear-gradient(90deg, #8B5CF6 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            y: prefersReducedMotion ? 0 : y,
          }} 
        />

        {/* Glows dinámicos */}
        {!prefersReducedMotion && (
          <>
            <motion.div 
              className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />
          </>
        )}

        {/* Contenido Hero */}
        <motion.div 
          className="relative z-10 text-center max-w-5xl mx-auto"
          style={{ opacity: prefersReducedMotion ? 1 : opacity }}
        >
          
            {/* Badge animado */}
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 bg-purple-600/20 border-2 border-purple-500/50 text-purple-400 text-sm font-black tracking-[0.3em] mb-8 mt-24 md:mt-28"
              initial={prefersReducedMotion ? false : { opacity: 0, y: -50 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="w-3 h-3 bg-purple-400 rounded-full"
                animate={prefersReducedMotion ? {} : {
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              DROP SYSTEM LIVE
            </motion.div>


          {/* Título GIGANTE con efecto glitch */}
          <div className="relative mb-8">
            {/* Efecto glitch layers */}
            {!prefersReducedMotion && (
              <>
                <motion.h1
                  className="absolute inset-0 text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] font-black leading-none tracking-tighter text-purple-500 opacity-20"
                  animate={{
                    x: [-2, 2, -2],
                    y: [2, -2, 2],
                  }}
                  transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3 }}
                >
                  ZORU<br />DROPS
                </motion.h1>
                <motion.h1
                  className="absolute inset-0 text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] font-black leading-none tracking-tighter text-pink-500 opacity-20"
                  animate={{
                    x: [2, -2, 2],
                    y: [-2, 2, -2],
                  }}
                  transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3, delay: 0.1 }}
                >
                  ZORU<br />DROPS
                </motion.h1>
              </>
            )}
            
            {/* Título principal */}
            <motion.h1
              className="relative text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] font-black leading-none tracking-tighter"
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8, y: 50 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            >
              <span className="block text-white drop-shadow-[0_0_40px_rgba(139,92,246,0.5)]">
                ZORU
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 -mt-4 md:-mt-8">
                DROPS
              </span>
            </motion.h1>
          </div>

          {/* Subtítulo animado */}
          <motion.p
            className="text-white/70 text-lg md:text-2xl lg:text-3xl mb-12 max-w-3xl mx-auto leading-relaxed font-light"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Ediciones limitadas que <span className="text-purple-400 font-bold">desaparecen para siempre</span>
            <br className="hidden md:block" />
            <span className="text-pink-400 font-bold">999 unidades</span> · Sin restock · Una vez, única vez
          </motion.p>

          {/* Stats con contadores animados */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-12"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {[
              { value: stats.totalDrops, label: 'Total Drops', color: 'from-white to-purple-400', icon: '📦' },
              { value: stats.activeNow, label: 'Live Now', color: 'from-pink-500 to-pink-400', icon: '🔴' },
              { value: stats.upcoming, label: 'Próximos', color: 'from-purple-400 to-pink-500', icon: '📅' },
              { value: stats.soldOut, label: 'Sold Out', color: 'from-white/40 to-white/20', icon: '💀' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="relative group"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20, scale: 0.8 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.2 + (i * 0.1), duration: 0.5 }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -5 }}
              >
                {/* Glow effect en hover */}
                {!prefersReducedMotion && (
                  <div className="absolute inset-0 bg-purple-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                
                <div className="relative bg-black/50 backdrop-blur-sm border-2 border-purple-500/30 group-hover:border-purple-500 p-4 md:p-6 transition-all duration-300">
                  <div className="text-3xl md:text-4xl mb-2">{stat.icon}</div>
                  <div className={`text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br ${stat.color} mb-2`}>
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-white/40 text-xs md:text-sm font-bold tracking-[0.2em] uppercase">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Scroll */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <p className="text-white/50 text-sm font-bold tracking-wider">
              SCROLL PARA DESCUBRIR
            </p>
            <motion.div
              animate={prefersReducedMotion ? {} : {
                y: [0, 10, 0],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Número decorativo gigante */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] md:text-[500px] lg:text-[700px] font-black text-purple-500/[0.02] pointer-events-none select-none leading-none -z-10"
          aria-hidden="true"
        >
          999
        </div>
      </section>

      {/* ✅ LIVE DROP - SI EXISTE (COMPACTO) */}
      {liveDrop && (
        <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-br from-pink-900/10 via-black to-purple-900/10">
          <div className="container mx-auto max-w-7xl">
            
            <motion.div
              className="bg-black border-2 border-pink-500/50 p-6 md:p-8 lg:p-12 relative overflow-hidden"
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge Live pulsante */}
              <motion.div 
                className="absolute top-6 right-6 md:top-8 md:right-8"
                animate={prefersReducedMotion ? {} : {
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="relative">
                  {!prefersReducedMotion && (
                    <div className="absolute inset-0 bg-pink-500 blur-xl opacity-50" />
                  )}
                  <div className="relative flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-pink-500 text-white text-xs md:text-sm font-black tracking-wider">
                    <motion.div 
                      className="w-2 h-2 bg-white rounded-full"
                      animate={prefersReducedMotion ? {} : {
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    LIVE NOW
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Imagen */}
                <motion.div 
                  className="relative aspect-square bg-zinc-950 border-2 border-purple-500/20 overflow-hidden group"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-9xl text-purple-500/20 font-black">
                    999
                  </div>
                  {!prefersReducedMotion && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}
                </motion.div>

                {/* Info */}
                <div className="flex flex-col justify-center space-y-6">
                  <div>
                    <motion.div 
                      className="text-purple-400 text-xs md:text-sm font-black tracking-[0.3em] mb-3"
                      initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
                      whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      WINTER 2025 · EN VIVO AHORA
                    </motion.div>
                    <motion.h2 
                      className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-none"
                      initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
                      whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      {liveDrop.title}
                    </motion.h2>
                    <motion.p 
                      className="text-white/60 text-base md:text-lg leading-relaxed"
                      initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
                      whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                    >
                      Edición limitada a 999 unidades. Una vez agotado, desaparece para siempre.
                    </motion.p>
                  </div>

                  {/* Stock Bar animada */}
                  <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white/50 text-sm font-bold tracking-wider">STOCK DISPONIBLE</span>
                      <span className="text-pink-500 font-black text-lg">
                        {liveDrop.stock}/999
                      </span>
                    </div>
                    <div className="w-full h-4 bg-white/10 overflow-hidden rounded-sm">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-[length:200%_100%]"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(liveDrop.stock / 999) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
                        animate={prefersReducedMotion ? {} : {
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        style={{
                          transition: 'background-position 3s ease-in-out infinite',
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Precio + CTA */}
                  <motion.div 
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="text-5xl md:text-6xl font-black text-white">
                      {formatPrice(liveDrop.price)}
                    </div>
                    <Link href={`/producto/${liveDrop.slug}`} className="flex-1 w-full sm:w-auto">
                      <motion.button 
                        className="w-full px-8 py-4 md:py-5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-sm md:text-base tracking-wider transition-all relative overflow-hidden group"
                        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {!prefersReducedMotion && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        )}
                        <span className="relative z-10">COMPRAR AHORA →</span>
                      </motion.button>
                    </Link>
                  </motion.div>

                  {/* Warning FOMO */}
                  <motion.div 
                    className="flex items-start gap-3 p-4 bg-pink-500/10 border-2 border-pink-500/30 rounded-sm"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                  >
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <p className="text-pink-400 text-sm font-bold mb-1">
                        Stock limitado. Sin restock. Una vez sold out, nunca vuelve.
                      </p>
                      <p className="text-pink-400/60 text-xs">
                        Los drops anteriores se agotaron en menos de 3 horas.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ✅ TABS DE NAVEGACIÓN */}
      <section className="py-8 px-4 md:px-6 border-y border-white/10 sticky top-32 md:top-36 bg-black z-40">
        <div className="container mx-auto max-w-7xl">
          <div className="flex gap-3">
            <motion.button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-4 md:py-5 font-black text-sm md:text-base tracking-wider transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                  : 'bg-zinc-950 text-white/50 hover:text-white border-2 border-white/10 hover:border-purple-500/50'
              }`}
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📅 PRÓXIMOS ({upcomingDrops.length})
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-4 md:py-5 font-black text-sm md:text-base tracking-wider transition-all ${
                activeTab === 'history'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                  : 'bg-zinc-950 text-white/50 hover:text-white border-2 border-white/10 hover:border-purple-500/50'
              }`}
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📦 SOLD OUT ({soldOutDrops.length})
            </motion.button>
          </div>
        </div>
      </section>

      {/* ✅ PRÓXIMOS DROPS - FEED */}
      <AnimatePresence mode="wait">
        {activeTab === 'upcoming' && (
          <motion.section
            key="upcoming"
            initial={prefersReducedMotion ? false : { opacity: 0, x: -50 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
            className="py-16 md:py-24 px-4 md:px-6"
          >
            <div className="container mx-auto max-w-4xl">
              
              <motion.div 
                className="mb-12"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
                  Próximos Lanzamientos
                </h2>
                <p className="text-white/50 text-base md:text-lg">
                  Activa recordatorios para no perderte ningún drop 🔔
                </p>
              </motion.div>

              <div className="space-y-8">
                {upcomingDrops.map((product, i) => (
                  <motion.div
                    key={product.id}
                    className="bg-zinc-950 border-2 border-white/10 hover:border-purple-500/50 transition-all overflow-hidden group"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
                    whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
                      {/* Imagen */}
                      <div className="relative aspect-square bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex items-center justify-center overflow-hidden">
                        <div className="text-8xl text-purple-500/20 font-black">
                          {i + 2}
                        </div>
                        <div className="absolute top-4 left-4 px-4 py-2 bg-purple-600 text-white text-xs font-black tracking-wider">
                          PRÓXIMO
                        </div>
                        {!prefersReducedMotion && (
                          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/0 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="md:col-span-2 flex flex-col justify-between">
                        <div>
                          <div className="text-purple-400 text-xs font-black tracking-[0.2em] mb-2">
                            WINTER 2025 DROP
                          </div>
                          <h3 className="text-3xl md:text-4xl font-black text-white mb-3">
                            {product.title}
                          </h3>
                          <p className="text-white/60 text-sm md:text-base mb-6 leading-relaxed">
                            Edición limitada a 999 unidades. Lanzamiento exclusivo.
                          </p>

                          {/* Fecha destacada */}
                          <div className="flex items-center gap-4 mb-6 p-4 bg-black border-2 border-purple-500/30 group-hover:border-purple-500/50 transition-colors">
                            <span className="text-3xl">📅</span>
                            <div>
                              <div className="text-white font-black text-base md:text-lg">
                                {i === 0 ? 'Viernes 29 Nov, 2025' : 'Viernes 6 Dic, 2025'}
                              </div>
                              <div className="text-purple-400 text-sm font-bold">
                                8:00 PM · {i === 0 ? 'En 2 días ⏱️' : 'En 1 semana ⏱️'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <motion.button
                            onClick={() => handleOpenNotify(product.title)}
                            className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm tracking-wider transition-colors relative overflow-hidden group/btn"
                            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {!prefersReducedMotion && (
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                            )}
                            <span className="relative z-10">🔔 ACTIVAR RECORDATORIO</span>
                          </motion.button>
                          <button className="px-8 py-4 border-2 border-white/20 hover:border-purple-500 text-white font-bold text-sm tracking-wider transition-colors">
                            VER DETALLES
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* ✅ DROP HISTORY - SOLD OUT */}
        {activeTab === 'history' && (
          <motion.section
            key="history"
            initial={prefersReducedMotion ? false : { opacity: 0, x: 50 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="py-16 md:py-24 px-4 md:px-6"
          >
            <div className="container mx-auto max-w-7xl">
              
              <motion.div 
                className="mb-12 text-center"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
                  Drops Anteriores
                </h2>
                <p className="text-white/50 text-base md:text-lg">
                  Estos productos se agotaron y nunca volverán 💀
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {soldOutDrops.map((product, i) => (
                  <motion.div
                    key={product.id}
                    className="group relative bg-zinc-950 border-2 border-white/10 hover:border-white/20 overflow-hidden transition-all"
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
                    whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    whileHover={prefersReducedMotion ? {} : { y: -5 }}
                  >
                    {/* Imagen */}
                    <div className="relative aspect-square bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex items-center justify-center">
                      <div className="text-6xl text-purple-500/10 font-black">
                        {i + 1}
                      </div>
                      {/* Overlay Sold Out */}
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="text-center">
                          <motion.div 
                            className="text-white font-black text-2xl mb-2 rotate-[-8deg]"
                            animate={prefersReducedMotion ? {} : {
                              rotate: [-8, -6, -8],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            SOLD OUT
                          </motion.div>
                          <div className="text-white/50 text-sm font-bold">
                            999/999
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <div className="text-white/40 text-xs font-bold tracking-wider mb-2">
                        NOV 2025
                      </div>
                      <h3 className="text-xl font-black text-white/70 mb-3">
                        {product.title}
                      </h3>
                      <div className="text-white/40 text-base line-through">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Warning FOMO final */}
              <motion.div
                className="mt-16 p-8 md:p-12 bg-gradient-to-r from-pink-900/20 to-purple-900/20 border-2 border-pink-500/30 text-center relative overflow-hidden"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {!prefersReducedMotion && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10" />
                )}
                
                <div className="relative z-10">
                  <motion.div 
                    className="text-5xl md:text-6xl mb-4"
                    animate={prefersReducedMotion ? {} : {
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ⚠️
                  </motion.div>
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-3">
                    No Te Lo Pierdas Otra Vez
                  </h3>
                  <p className="text-white/60 text-base md:text-lg mb-8 max-w-2xl mx-auto">
                    Estos productos desaparecieron en menos de 3 horas. 
                    Activa alertas para los próximos drops y no te quedes sin el tuyo.
                  </p>
                  <motion.button 
                    onClick={() => setActiveTab('upcoming')}
                    className="px-10 py-5 bg-purple-600 hover:bg-purple-700 text-white font-black text-lg tracking-wider transition-colors relative overflow-hidden group"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {!prefersReducedMotion && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    )}
                    <span className="relative z-10">VER PRÓXIMOS DROPS →</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Modal */}
      <NotifyModal 
        isOpen={notifyModal.open}
        onClose={handleCloseNotify}
        dropName={notifyModal.dropName}
      />
    </div>
  )
}
