'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Hero(){
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(3600 + Math.floor(Math.random() * 3600))
    const t = setInterval(() => setCount(c => c > 0 ? c - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [])

  function formatTime(s){
    const h = Math.floor(s/3600).toString().padStart(2,'0')
    const m = Math.floor((s%3600)/60).toString().padStart(2,'0')
    const sec = (s%60).toString().padStart(2,'0')
    return `${h}:${m}:${sec}`
  }

  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex items-center">
      
      {/* Textura grunge de fondo */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />

      {/* Grid retro */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#8B5CF6 1px, transparent 1px), linear-gradient(90deg, #8B5CF6 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Decoración: Esquinas glitch */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-purple-500/50" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r-4 border-t-4 border-pink-500/50" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-4 border-b-4 border-pink-500/50" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-purple-500/50" />

      {/* Contenido principal */}
      <div className="container relative z-10 px-6 py-20">
        
        {/* Badge "LIVE DROP" flotante */}
        <motion.div
          className="absolute top-8 right-8 md:right-20"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="relative">
            {/* Glow pulsante */}
            <motion.div 
              className="absolute inset-0 bg-pink-500 blur-xl opacity-50"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative bg-pink-500 text-white px-6 py-3 font-black tracking-wider text-sm rotate-6 border-4 border-white">
              LIVE DROP
            </div>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          
          {/* Título gigante con glitch effect */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            {/* Número decorativo grande */}
            <div className="text-purple-500/10 text-[180px] md:text-[280px] font-black leading-none absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none select-none">
              999
            </div>

            {/* Título principal */}
            <h1 className="relative text-[80px] md:text-[140px] lg:text-[180px] font-black leading-none tracking-tighter">
              <span className="block text-white drop-shadow-[0_0_40px_rgba(139,92,246,0.6)]">
                ZORU
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 -mt-4">
                DROPS
              </span>
            </h1>

            {/* Subtítulo con efecto typing */}
            <motion.p 
              className="text-white/70 text-xl md:text-2xl font-light mt-8 tracking-wide max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Ediciones limitadas que no volverán. <br/>
              <span className="text-purple-400 font-semibold">
                {count > 0 ? 'Next drop in progress...' : 'AGOTADO'}
              </span>
            </motion.p>
          </motion.div>

          {/* Countdown + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid md:grid-cols-2 gap-8 max-w-4xl"
          >
            
            {/* Countdown brutal */}
            <div className="relative group">
              {/* Borde animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              
              <div className="relative bg-zinc-950 border-2 border-purple-500/30 p-8">
                {/* Label */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" />
                  <span className="text-purple-400 font-bold tracking-widest text-xs uppercase">
                    Próximo Drop
                  </span>
                </div>

                {/* Timer gigante */}
                <div className="font-mono text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                  {formatTime(count)}
                </div>

                {/* Barra de progreso fake */}
                <div className="w-full h-1 bg-zinc-800 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                </div>

                <p className="text-white/40 text-xs mt-4 tracking-wide">
                  SOLO <span className="text-pink-500 font-bold">999 UNIDADES</span> DISPONIBLES
                </p>
              </div>
            </div>

            {/* CTAs Stack */}
            <div className="flex flex-col gap-4 justify-center">
              
              {/* Botón principal */}
              <Link href="/tienda">
                <motion.div
                  className="group relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Efecto scan */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  <div className="relative bg-purple-600 hover:bg-purple-700 px-8 py-5 border-4 border-purple-400 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-black text-lg tracking-wider uppercase">
                        Ver Drops Activos
                      </span>
                      <motion.span 
                        className="text-2xl"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative border-2 border-white/20 hover:border-pink-500 px-8 py-4 bg-black/50 backdrop-blur-sm transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold tracking-wider uppercase text-sm">
                        Entrar al Raffle
                      </span>
                      <span className="text-pink-500 font-black">999</span>
                    </div>
                  </div>
                </motion.div>
              </Link>

              {/* Info adicional */}
              <div className="flex items-center gap-4 text-white/40 text-xs mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Stock en tiempo real</span>
                </div>
                <div className="w-[1px] h-4 bg-white/20" />
                <span>Sin restock</span>
              </div>
            </div>

          </motion.div>

          {/* Tags estilo graffiti */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap gap-4 mt-12 max-w-4xl"
          >
            {['STREETWEAR', 'LIMITED', 'NO RESTOCK', 'AUTHENTIC'].map((tag, i) => (
              <motion.div
                key={tag}
                className="border-2 border-purple-500/30 px-6 py-2 text-purple-400 font-bold text-xs tracking-widest hover:border-purple-500 hover:bg-purple-500/10 transition-all cursor-default"
                whileHover={{ rotate: Math.random() > 0.5 ? 3 : -3 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + (i * 0.1) }}
              >
                #{tag}
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Efecto de luz inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-600/10 to-transparent pointer-events-none" />

    </section>
  )
}
