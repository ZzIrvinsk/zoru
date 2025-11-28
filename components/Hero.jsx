'use client'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { useState, useEffect, useMemo, useCallback } from 'react'

export default function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const [count, setCount] = useState(0)

  // ✅ Inicializar countdown solo una vez
  useEffect(() => {
    setCount(3600 + Math.floor(Math.random() * 3600))
    const t = setInterval(() => setCount(c => c > 0 ? c - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [])

  // ✅ Memoizar formato de tiempo para evitar recálculos
  const formatTime = useCallback((s) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0')
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${h}:${m}:${sec}`
  }, [])

  const formattedTime = useMemo(() => formatTime(count), [count, formatTime])

  return (
    <section className="relative min-h-[calc(100vh-80px)] md:min-h-screen bg-black overflow-hidden flex items-center">
      
      {/* ✅ ANIMACIÓN DE ENTRADA: Flash inicial */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 bg-purple-600 pointer-events-none z-50"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}

      {/* Textura grunge de fondo - optimizada */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          willChange: 'auto'
        }} 
      />

      {/* Grid retro - animado en entrada */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(#8B5CF6 1px, transparent 1px), linear-gradient(90deg, #8B5CF6 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          willChange: 'auto'
        }}
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.2 }}
        animate={prefersReducedMotion ? {} : { opacity: 0.03, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* ✅ Decoración: Esquinas glitch - animadas */}
      <motion.div 
        className="absolute top-0 left-0 w-16 md:w-32 h-16 md:h-32 border-l-2 md:border-l-4 border-t-2 md:border-t-4 border-purple-500/50"
        initial={prefersReducedMotion ? false : { opacity: 0, x: -50, y: -50 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      <motion.div 
        className="absolute top-0 right-0 w-16 md:w-32 h-16 md:h-32 border-r-2 md:border-r-4 border-t-2 md:border-t-4 border-pink-500/50"
        initial={prefersReducedMotion ? false : { opacity: 0, x: 50, y: -50 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-16 md:w-32 h-16 md:h-32 border-l-2 md:border-l-4 border-b-2 md:border-b-4 border-pink-500/50"
        initial={prefersReducedMotion ? false : { opacity: 0, x: -50, y: 50 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-16 md:w-32 h-16 md:h-32 border-r-2 md:border-r-4 border-b-2 md:border-b-4 border-purple-500/50"
        initial={prefersReducedMotion ? false : { opacity: 0, x: 50, y: 50 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />

      {/* Contenido principal */}
      <div className="container relative z-10 px-4 md:px-6 py-12 md:py-20">
        
        {/* ✅ Badge "LIVE DROP" flotante - entrada dramática */}
        <motion.div
          className="absolute top-4 md:top-8 right-4 md:right-20"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0, rotate: -180 }}
          animate={prefersReducedMotion ? {} : { 
            opacity: 1,
            scale: 1,
            rotate: 0
          }}
          transition={{ 
            duration: 0.8,
            delay: 0.6,
            type: "spring",
            stiffness: 200
          }}
        >
          <motion.div
            className="relative"
            animate={prefersReducedMotion ? {} : { 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={prefersReducedMotion ? {} : { 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Glow pulsante */}
            {!prefersReducedMotion && (
              <motion.div 
                className="hidden md:block absolute inset-0 bg-pink-500 blur-xl opacity-50 pointer-events-none"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ willChange: 'auto' }}
              />
            )}
            <div className="relative bg-pink-500 text-white px-3 md:px-6 py-2 md:py-3 font-black tracking-wider text-[10px] md:text-sm rotate-6 border-2 md:border-4 border-white">
              LIVE DROP
            </div>
          </motion.div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          
          {/* ✅ Título gigante con ENTRADA ÉPICA */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8 md:mb-12"
          >
            {/* Número decorativo grande - entrada desde abajo */}
            <motion.div 
              className="text-purple-500/10 text-[100px] md:text-[180px] lg:text-[280px] font-black leading-none absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none select-none"
              aria-hidden="true"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 100, scale: 0.5 }}
              animate={prefersReducedMotion ? {} : { opacity: 0.1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            >
              999
            </motion.div>

            {/* ✅ Título principal - EXPLOSIÓN DE ENTRADA */}
            <h1 className="relative text-[60px] sm:text-[80px] md:text-[140px] lg:text-[180px] font-black leading-none tracking-tighter">
              <motion.span 
                className="block text-white drop-shadow-[0_0_40px_rgba(139,92,246,0.6)]"
                initial={prefersReducedMotion ? false : { 
                  opacity: 0, 
                  y: 100, 
                  scale: 0.8,
                  filter: "blur(20px)"
                }}
                animate={prefersReducedMotion ? {} : { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  filter: "blur(0px)"
                }}
                transition={{ 
                  duration: 1,
                  delay: 0.4,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                ZORU
              </motion.span>
              <motion.span 
                className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 -mt-2 md:-mt-4"
                initial={prefersReducedMotion ? false : { 
                  opacity: 0, 
                  y: 100, 
                  scale: 0.8,
                  filter: "blur(20px)"
                }}
                animate={prefersReducedMotion ? {} : { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  filter: "blur(0px)"
                }}
                transition={{ 
                  duration: 1,
                  delay: 0.6,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                DROPS
              </motion.span>
            </h1>

            {/* ✅ Subtítulo - fade in suave */}
            <motion.p 
              className="text-white/70 text-base md:text-2xl font-light mt-4 md:mt-8 tracking-wide max-w-2xl leading-relaxed"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              Ediciones limitadas que no volverán. <br/>
              <span className="text-purple-400 font-semibold">
                {count > 0 ? 'Next drop in progress...' : 'AGOTADO'}
              </span>
            </motion.p>
          </motion.div>

          {/* ✅ Countdown + CTAs - entrada escalonada */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl"
          >
            
            {/* Countdown optimizado */}
            <motion.div 
              className="relative group"
              initial={prefersReducedMotion ? false : { opacity: 0, x: -50 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              {/* Borde animado */}
              {!prefersReducedMotion && (
                <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" style={{ willChange: 'auto' }} />
              )}
              
              <div className="relative bg-zinc-950 border-2 border-purple-500/30 p-6 md:p-8">
                {/* Label */}
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <div className="w-2 md:w-3 h-2 md:h-3 bg-pink-500 rounded-full animate-pulse" />
                  <span className="text-purple-400 font-bold tracking-widest text-[10px] md:text-xs uppercase">
                    Próximo Drop
                  </span>
                </div>

                {/* Timer gigante */}
                <div className="font-mono text-4xl md:text-6xl font-black text-white mb-4 md:mb-6 tracking-tight">
                  {formattedTime}
                </div>

                {/* Barra de progreso */}
                <div className="w-full h-1 bg-zinc-800 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    animate={prefersReducedMotion ? {} : { width: ['0%', '100%'] }}
                    transition={prefersReducedMotion ? {} : { duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{ willChange: prefersReducedMotion ? 'auto' : 'width' }}
                  />
                </div>

                <p className="text-white/40 text-[10px] md:text-xs mt-3 md:mt-4 tracking-wide">
                  SOLO <span className="text-pink-500 font-bold">999 UNIDADES</span> DISPONIBLES
                </p>
              </div>
            </motion.div>

            {/* ✅ CTAs Stack - entrada desde la derecha */}
            <motion.div 
              className="flex flex-col gap-3 md:gap-4 justify-center"
              initial={prefersReducedMotion ? false : { opacity: 0, x: 50 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              
              {/* ✅ Botón principal - AHORA VA A /drops */}
              <Link href="/colecciones">
                <motion.div
                  className="group relative overflow-hidden"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.4 }}
                >
                  {/* Efecto scan */}
                  <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  
                  <div className="relative bg-purple-600 hover:bg-purple-700 px-6 md:px-8 py-4 md:py-5 border-2 md:border-4 border-purple-400 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-black text-sm md:text-lg tracking-wider uppercase">
                        Ver Drops Activos
                      </span>
                      <motion.span 
                        className="text-lg md:text-2xl"
                        animate={prefersReducedMotion ? {} : { x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              </Link>

              {/* Botón secundario */}
              <Link href="/raffle">
                <motion.div
                  className="group relative"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ delay: 2, duration: 0.4 }}
                >
                  <div className="relative border-2 border-white/20 hover:border-pink-500 px-6 md:px-8 py-3 md:py-4 bg-black/50 backdrop-blur-sm transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold tracking-wider uppercase text-xs md:text-sm">
                        Entrar al Raffle
                      </span>
                      <span className="text-pink-500 font-black text-sm md:text-base">999</span>
                    </div>
                  </div>
                </motion.div>
              </Link>

              {/* Info adicional */}
              <motion.div 
                className="flex flex-wrap items-center gap-3 md:gap-4 text-white/40 text-[10px] md:text-xs mt-2"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={prefersReducedMotion ? {} : { opacity: 1 }}
                transition={{ delay: 2.2, duration: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-green-500 rounded-full" />
                  <span>Stock en tiempo real</span>
                </div>
                <div className="w-[1px] h-3 md:h-4 bg-white/20" />
                <span>Sin restock</span>
              </motion.div>
            </motion.div>

          </motion.div>

          {/* ✅ Tags estilo graffiti - entrada escalonada */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6 }}
            className="flex flex-wrap gap-2 md:gap-4 mt-8 md:mt-12 max-w-4xl"
          >
            {['STREETWEAR', 'LIMITED', 'NO RESTOCK', 'AUTHENTIC'].map((tag, i) => (
              <motion.div
                key={tag}
                className="border-2 border-purple-500/30 px-3 md:px-6 py-1.5 md:py-2 text-purple-400 font-bold text-[10px] md:text-xs tracking-widest hover:border-purple-500 hover:bg-purple-500/10 transition-all cursor-default"
                whileHover={prefersReducedMotion ? {} : { rotate: Math.random() > 0.5 ? 3 : -3, y: -3 }}
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8, rotate: -10 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 2.4 + (i * 0.1), duration: 0.4, type: "spring" }}
              >
                #{tag}
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Efecto de luz inferior */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-purple-600/10 to-transparent pointer-events-none" 
        style={{ willChange: 'auto' }}
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      />

    </section>
  )
}
