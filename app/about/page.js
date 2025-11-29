'use client'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { useMemo } from 'react'

export default function AboutPage() {
  const prefersReducedMotion = useReducedMotion()

  // ✅ Memoizar datos estáticos
  const principles = useMemo(() => [
    {
      number: '01',
      title: 'LIMITADO',
      desc: 'Cada drop tiene exactamente 999 unidades. Cuando se acaba, se acaba para siempre. Sin restock, sin excepciones.'
    },
    {
      number: '02',
      title: 'AUTÉNTICO',
      desc: 'Cada pieza es verificable. No producimos en masa. No seguimos tendencias. Creamos la cultura que otros copiarán.'
    },
    {
      number: '03',
      title: 'REBELDE',
      desc: 'No estamos aquí para complacer a todos. Diseñamos para los que se atreven a ser diferentes, los outsiders, los creadores.'
    }
  ], [])

  const timeline = useMemo(() => [
    {
      year: '2025',
      title: 'EL INICIO',
      desc: 'Nace ZORU en Lima. Una idea loca de crear streetwear que realmente signifique algo. Sin inversores, sin compromisos.',
      align: 'left'
    },
    {
      year: '2025',
      title: 'PRIMER DROP',
      desc: 'Lanzamos nuestra primera colección de 999 hoodies. Se agotó en 48 horas. La comunidad empezó a crecer.',
      align: 'right'
    },
    {
      year: '2025',
      title: 'AHORA',
      desc: 'Seguimos creciendo orgánicamente. Cada drop cuenta una historia. Cada cliente es parte del movimiento.',
      align: 'left'
    }
  ], [])

  const crew = useMemo(() => [
    { role: 'CREATIVE', name: 'Los Visionarios', desc: 'Diseñamos cada pieza con obsesión por el detalle' },
    { role: 'COMMUNITY', name: 'Los Conectores', desc: 'Construimos la familia ZORU día a día' },
    { role: 'OPERATIONS', name: 'Los Ejecutores', desc: 'Hacemos que cada drop sea perfecto' }
  ], [])

  const stats = useMemo(() => [
    { num: '999', label: 'PIEZAS POR DROP' },
    { num: '24H', label: 'ENTREGAS LIMA' },
    { num: '100%', label: 'AUTÉNTICO' }
  ], [])

  return (
    <div className="bg-black min-h-screen overflow-x-hidden">
      
      {/* HERO - Manifiesto */}
      <section className="relative min-h-[calc(100vh-80px)] md:min-h-screen flex items-center justify-center overflow-hidden">
        
        {/* Grid retro - optimizado */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{
            backgroundImage: 'linear-gradient(#8B5CF6 1px, transparent 1px), linear-gradient(90deg, #8B5CF6 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            willChange: 'auto'
          }} 
        />

        {/* Glows - solo desktop */}
        {!prefersReducedMotion && (
          <>
            <div className="hidden md:block absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ willChange: 'auto' }} />
            <div className="hidden md:block absolute bottom-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s', willChange: 'auto' }} />
          </>
        )}

        {/* Esquinas decorativas - responsive */}
        <div className="absolute top-4 md:top-8 left-4 md:left-8 w-16 md:w-32 h-16 md:h-32 border-l-2 md:border-l-4 border-t-2 md:border-t-4 border-purple-500/30" />
        <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 w-16 md:w-32 h-16 md:h-32 border-r-2 md:border-r-4 border-b-2 md:border-b-4 border-pink-500/30" />

        <div className="relative z-10 container mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
          
          {/* Badge superior */}
          <motion.div
            className="inline-block px-3 md:px-4 py-1.5 md:py-2 border-2 border-purple-500/50 text-purple-400 text-[10px] md:text-xs font-black tracking-widest mb-6 md:mb-8"
            initial={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            EST. 2025 - TRUJILLO, PERÚ
          </motion.div>

          {/* Título gigante responsive */}
          <motion.h1
            className="text-5xl sm:text-7xl md:text-9xl lg:text-[160px] font-black leading-none tracking-tighter mb-6 md:mb-8"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="block text-white drop-shadow-[0_0_40px_rgba(139,92,246,0.5)]">
              NO SOMOS
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 -mt-2 md:-mt-4">
              UNA MARCA
            </span>
          </motion.h1>

          {/* Subtítulo responsive */}
          <motion.p
            className="text-white/70 text-base md:text-2xl max-w-3xl mx-auto leading-relaxed font-light px-4"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Somos un <span className="text-purple-400 font-semibold">movimiento</span>. 
            Una comunidad de individuos que rechazan lo común y abrazan la exclusividad. 
            Cada pieza cuenta una historia. <span className="text-pink-400 font-semibold">Tu historia</span>.
          </motion.p>

          {/* Número decorativo - responsive */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[180px] md:text-[280px] lg:text-[400px] font-black text-purple-500/5 pointer-events-none select-none leading-none -z-10"
            aria-hidden="true"
          >
            999
          </div>
        </div>
      </section>

      {/* MANIFESTO - Cards */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-zinc-950 relative">
        
        <div className="container mx-auto max-w-6xl">
          
          {/* Header */}
          <motion.div
            className="text-center mb-12 md:mb-20"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-7xl font-black text-white mb-4 md:mb-6">
              NUESTRO
              <span className="block text-purple-400 -mt-1">MANIFIESTO</span>
            </h2>
            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto" />
          </motion.div>

          {/* Grid responsive */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            
            {principles.map((item, i) => (
              <motion.div
                key={i}
                className="group relative bg-black border-2 border-purple-500/20 p-6 md:p-8 hover:border-purple-500 transition-colors duration-300"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                whileHover={prefersReducedMotion ? {} : { y: -8 }}
              >
                {/* Glow en hover - solo desktop */}
                {!prefersReducedMotion && (
                  <div className="hidden md:block absolute inset-0 bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                )}
                
                {/* Número decorativo */}
                <div 
                  className="text-6xl md:text-8xl font-black text-purple-500/10 absolute top-3 md:top-4 right-3 md:right-4 leading-none pointer-events-none select-none"
                  aria-hidden="true"
                >
                  {item.number}
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-black text-white mb-3 md:mb-4 tracking-wider">
                    {item.title}
                  </h3>
                  <div className="w-10 md:w-12 h-[2px] bg-purple-500 mb-4 md:mb-6" />
                  <p className="text-white/60 text-xs md:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ STORY - Timeline ARREGLADA (sin overflow) */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-black relative">
        
        {/* ✅ Container con overflow hidden para contener la línea */}
        <div className="container mx-auto max-w-4xl relative">
          
          {/* ✅ Línea vertical DENTRO del container - no se desborda */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-purple-500/50 to-transparent hidden md:block" />
          
          <motion.h2
            className="text-4xl md:text-7xl font-black text-white text-center mb-12 md:mb-20 relative z-10"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            LA <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">HISTORIA</span>
          </motion.h2>

          {/* Timeline items - responsive */}
          <div className="space-y-12 md:space-y-24">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                className={`relative flex flex-col md:flex-row items-start md:items-center ${item.align === 'right' ? 'md:flex-row-reverse' : ''}`}
                initial={prefersReducedMotion ? false : { opacity: 0, x: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { 
                  opacity: 1, 
                  x: 0,
                  y: 0
                }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
              >
                {/* Punto en la línea - solo desktop */}
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-5 md:w-6 h-5 md:h-6 bg-purple-500 border-4 border-black rounded-full z-10" />

                {/* ✅ Contenido adaptado para móvil */}
                <div className={`w-full md:w-5/12 ${item.align === 'right' ? 'md:text-right' : ''}`}>
                  <div className="bg-zinc-950 border-2 border-purple-500/20 p-5 md:p-6 hover:border-purple-500 transition-colors group">
                    <div className="text-purple-400 font-black text-xs md:text-sm tracking-widest mb-2">
                      {item.year}
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white mb-2 md:mb-3">
                      {item.title}
                    </h3>
                    <p className="text-white/60 text-xs md:text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CREW - Team */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-zinc-950 relative">
        
        <div className="container mx-auto max-w-6xl">
          
          <motion.div
            className="text-center mb-12 md:mb-20"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-7xl font-black text-white mb-3 md:mb-4">
              EL <span className="text-purple-400">CREW</span>
            </h2>
            <p className="text-white/60 text-sm md:text-lg">
              Los locos detrás de ZORU
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {crew.map((member, i) => (
              <motion.div
                key={i}
                className="group relative"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                {/* Avatar placeholder */}
                <div className="aspect-square bg-gradient-to-br from-purple-600/20 to-pink-600/20 mb-4 md:mb-6 flex items-center justify-center border-2 border-purple-500/30 group-hover:border-purple-500 transition-all relative overflow-hidden">
                  <div className="text-5xl md:text-6xl font-black text-purple-500/20">
                    {member.role.charAt(0)}
                  </div>
                  
                  {/* Scan effect - solo desktop */}
                  <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                </div>

                <div className="text-purple-400 text-[10px] md:text-xs font-black tracking-widest mb-2">
                  {member.role}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-white/50 text-xs md:text-sm">
                  {member.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-black relative overflow-hidden">
        
        {/* Efectos de luz */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none" />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-6 md:mb-8 leading-none">
              <span className="block">ÚNETE A</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 -mt-1">
                LA REVOLUCIÓN
              </span>
            </h2>

            <p className="text-white/60 text-sm md:text-xl mb-8 md:mb-12 max-w-2xl mx-auto px-4">
              No vendemos ropa. Vendemos identidad. Vendemos pertenencia. 
              Vendemos la oportunidad de ser parte de algo más grande.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <Link href="/tienda">
                <motion.button
                  className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm md:text-lg tracking-wider transition-colors relative overflow-hidden group"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  <span className="relative z-10">VER DROPS</span>
                </motion.button>
              </Link>

              <Link href="/raffle">
                <motion.button
                  className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 border-2 border-white/20 hover:border-purple-500 text-white font-black text-sm md:text-lg tracking-wider transition-colors"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ENTRAR AL RAFFLE
                </motion.button>
              </Link>
            </div>

            {/* Stats decorativos - responsive */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 md:mt-20 max-w-2xl mx-auto px-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  className="border-l-2 border-purple-500/30 pl-2 md:pl-4 text-left"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                >
                  <div className="text-2xl md:text-4xl font-black text-purple-400">
                    {stat.num}
                  </div>
                  <div className="text-[9px] md:text-xs text-white/40 tracking-wider mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
