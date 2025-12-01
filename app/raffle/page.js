'use client'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useState, useCallback, useRef, useMemo } from 'react'

export default function RafflePage() {
  const prefersReducedMotion = useReducedMotion()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    instagram: '',
    preferredSize: 'M'
  })
  const [submitted, setSubmitted] = useState(false)

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // ✅ Memoizar arrays estáticos
  const stats = useMemo(() => [
    { value: '10', label: 'GANADORES/SEMANA', color: 'from-white to-purple-400' },
    { value: '24H', label: 'ACCESO EARLY', color: 'from-purple-400 to-pink-500' },
    { value: '100%', label: 'GRATIS', color: 'from-pink-500 to-pink-400' }
  ], [])

  const sizes = useMemo(() => ['XS', 'S', 'M', 'L', 'XL', 'XXL'], [])

  const steps = useMemo(() => [
    {
      step: '01',
      title: 'INSCRÍBETE',
      desc: 'Llena el formulario con tu nombre, email y talla preferida. Es 100% gratis.'
    },
    {
      step: '02',
      title: 'ESPERA SORTEO',
      desc: 'Cada viernes 8PM sorteamos 10 ganadores al azar y los notificamos por email.'
    },
    {
      step: '03',
      title: 'COMPRA PRIMERO',
      desc: 'Si ganas, tienes 24 horas de acceso exclusivo antes del lanzamiento público.'
    }
  ], [])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    
    try {
      // TODO: Reemplazar con API call a tu base de datos
      // Ejemplo: await fetch('/api/raffle/enter', { method: 'POST', body: JSON.stringify(formData) })
      
      const entries = JSON.parse(localStorage.getItem('zoru_raffle_entries') || '[]')
      entries.push({
        ...formData,
        timestamp: new Date().toISOString(),
        id: Date.now()
      })
      localStorage.setItem('zoru_raffle_entries', JSON.stringify(entries))
      
      setSubmitted(true)
      setFormData({ name: '', email: '', instagram: '', preferredSize: 'M' })
      
      setTimeout(() => setSubmitted(false), 5000)
    } catch(err) {
      console.error('Error submitting raffle entry:', err)
    }
  }, [formData])

  const handleChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }, [])

  const handleSizeSelect = useCallback((size) => {
    setFormData(prev => ({ ...prev, preferredSize: size }))
  }, [])

  const resetForm = useCallback(() => {
    setSubmitted(false)
  }, [])

  return (
    <div className="bg-black min-h-screen overflow-x-hidden">
      
      {/* HERO */}
      <section 
        ref={heroRef}
        className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center px-4 md:px-6 pt-32 pb-16 overflow-hidden"
      >
        {/* Partículas */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
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

        {/* Grid animado */}
        <motion.div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{
            backgroundImage: 'linear-gradient(#8B5CF6 1px, transparent 1px), linear-gradient(90deg, #8B5CF6 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            y: prefersReducedMotion ? 0 : y,
          }} 
        />

        {/* Glows */}
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
          
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 bg-purple-600/20 border-2 border-purple-500/50 text-purple-400 text-sm font-black tracking-[0.3em] mb-8"
            initial={prefersReducedMotion ? false : { opacity: 0, y: -30 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="w-3 h-3 bg-purple-400 rounded-full"
              animate={prefersReducedMotion ? {} : {
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            RAFFLE SEMANAL
          </motion.div>

          {/* Título GIGANTE */}
          <div className="relative mb-8">
            <motion.h1
              className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black leading-none tracking-tighter"
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8, y: 50 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="block text-white drop-shadow-[0_0_40px_rgba(139,92,246,0.5)]">
                GANA
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 -mt-4 md:-mt-8">
                ACCESO
              </span>
            </motion.h1>
          </div>

          {/* Subtítulo */}
          <motion.div
            className="flex items-center justify-center gap-4 text-white/50 text-sm md:text-base mb-12 font-mono tracking-wider flex-wrap"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <span className="text-purple-400">EARLY ACCESS</span>
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="text-pink-400">100% GRATIS</span>
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="text-white/70">10 GANADORES</span>
          </motion.div>

          {/* Stats minimalistas */}
          <motion.div
            className="grid grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="relative group"
                whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {!prefersReducedMotion && (
                  <div className="absolute inset-0 bg-purple-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                
                <div className="relative bg-black/50 backdrop-blur-sm border border-purple-500/30 group-hover:border-purple-500/60 p-3 md:p-4 transition-all duration-300">
                  <div className={`text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-white/40 text-[10px] md:text-xs font-black tracking-[0.2em]">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Número decorativo */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] md:text-[500px] font-black text-purple-500/[0.02] pointer-events-none select-none leading-none -z-10"
          aria-hidden="true"
        >
          999
        </div>
      </section>

      {/* INTRODUCCIÓN */}
      <section className="px-4 md:px-6 py-12 md:py-16 bg-black border-y border-purple-500/20">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.p
            className="text-white/70 text-lg md:text-2xl lg:text-3xl leading-relaxed font-light"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            Participa gratis cada semana y gana el derecho a comprar{' '}
            <span className="text-purple-400 font-bold">drops exclusivos</span>{' '}
            antes que nadie
          </motion.p>
        </div>
      </section>

      {/* FORMULARIO */}
      <section className="px-4 md:px-6 py-12 md:py-16 bg-zinc-950">
        <div className="container mx-auto max-w-2xl">
          
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            
            {submitted ? (
              <motion.div
                className="text-center py-12 md:py-20"
                initial={prefersReducedMotion ? false : { scale: 0.9, opacity: 0 }}
                animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-5xl md:text-7xl mb-4 md:mb-6">✓</div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-3 md:mb-4">
                  ¡ESTÁS DENTRO!
                </h3>
                <p className="text-white/60 text-sm md:text-lg mb-6 md:mb-8 px-4">
                  Sorteo este viernes 8PM. Te avisaremos por email si ganas.
                </p>
                <button
                  onClick={resetForm}
                  className="px-6 md:px-8 py-3 border-2 border-purple-500 text-purple-400 font-bold text-sm md:text-base hover:bg-purple-500 hover:text-white transition-all"
                >
                  NUEVA ENTRADA
                </button>
              </motion.div>
            ) : (
              <>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-2 md:mb-3 text-center">
                  INSCRÍBETE
                  <span className="block text-purple-400">AHORA</span>
                </h2>

                <p className="text-white/50 text-sm md:text-base text-center mb-8 md:mb-12 px-4">
                  Llena el formulario y participa por acceso early a los próximos drops
                </p>

                <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                  
                  {/* Nombre */}
                  <div>
                    <label className="block text-white font-bold text-xs md:text-sm mb-2 tracking-wider">
                      NOMBRE COMPLETO
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-3 md:py-4 bg-white/5 border border-white/10 focus:border-purple-500 text-white text-sm md:text-base placeholder:text-white/30 outline-none transition-colors"
                      placeholder="Tu nombre"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-white font-bold text-xs md:text-sm mb-2 tracking-wider">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-3 md:py-4 bg-white/5 border border-white/10 focus:border-purple-500 text-white text-sm md:text-base placeholder:text-white/30 outline-none transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="block text-white font-bold text-xs md:text-sm mb-2 tracking-wider">
                      INSTAGRAM (OPCIONAL)
                    </label>
                    <div className="flex">
                      <span className="flex items-center px-3 md:px-4 bg-white/5 border border-r-0 border-white/10 text-white/50 text-sm md:text-base">
                        @
                      </span>
                      <input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="flex-1 px-3 md:px-4 py-3 md:py-4 bg-white/5 border border-white/10 focus:border-purple-500 text-white text-sm md:text-base placeholder:text-white/30 outline-none transition-colors"
                        placeholder="tuusuario"
                      />
                    </div>
                  </div>

                  {/* Talla */}
                  <div>
                    <label className="block text-white font-bold text-xs md:text-sm mb-3 tracking-wider">
                      TALLA PREFERIDA
                    </label>
                    
                    <div className="grid grid-cols-6 gap-2">
                      {sizes.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeSelect(size)}
                          className={`py-2.5 md:py-3 text-xs md:text-sm font-bold border-2 transition-all ${
                            formData.preferredSize === size
                              ? 'border-purple-500 bg-purple-500 text-white'
                              : 'border-white/10 text-white/50 hover:border-purple-500/50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    className="w-full px-6 md:px-8 py-4 md:py-5 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm md:text-lg tracking-wider transition-colors relative overflow-hidden group"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {!prefersReducedMotion && (
                      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    )}
                    <span className="relative z-10">PARTICIPAR AHORA</span>
                  </motion.button>

                  <p className="text-white/30 text-[10px] md:text-xs text-center">
                    Al participar aceptas términos y condiciones
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-black">
        <div className="container mx-auto max-w-6xl">
          
          <motion.h2
            className="text-4xl md:text-7xl font-black text-white text-center mb-12 md:mb-16"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            CÓMO
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 -mt-1">
              FUNCIONA
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((item, i) => (
              <motion.div
                key={i}
                className="relative bg-zinc-950 border border-white/10 p-6 md:p-8 hover:border-purple-500 transition-colors duration-300"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div 
                  className="text-6xl md:text-8xl font-black text-purple-500/10 absolute top-4 right-4 pointer-events-none select-none"
                  aria-hidden="true"
                >
                  {item.step}
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-black text-white mb-3 md:mb-4">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
