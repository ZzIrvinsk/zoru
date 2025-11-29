'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { useState, useCallback } from 'react'

export default function RafflePage() {
  const prefersReducedMotion = useReducedMotion()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    instagram: '',
    preferredSize: 'M'
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    
    try {
      // Guardar en localStorage
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
      console.error(err)
    }
  }, [formData])

  const handleChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }, [])

  const resetForm = useCallback(() => {
    setSubmitted(false)
  }, [])

  return (
    <div className="bg-black min-h-screen pt-24 pb-16 overflow-x-hidden">
      
      {/* HERO */}
      <section className="relative px-4 md:px-6 py-12 md:py-20 overflow-hidden">
        
        {/* Decoración optimizada */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none" 
          style={{
            backgroundImage: 'linear-gradient(#8B5CF6 1px, transparent 1px), linear-gradient(90deg, #8B5CF6 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            willChange: 'auto'
          }} 
        />

        {/* ✅ Glows optimizados */}
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" style={{ willChange: 'auto' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" style={{ willChange: 'auto' }} />

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          
          {/* Badge */}
          <motion.div
            className="inline-block px-3 md:px-4 py-2 border-2 border-purple-500/50 text-purple-400 text-[10px] md:text-xs font-black tracking-widest mb-6 md:mb-8"
            initial={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            RAFFLE SEMANAL
          </motion.div>

          {/* Título responsive */}
          <motion.h1
            className="text-5xl md:text-8xl lg:text-9xl font-black text-white mb-4 md:mb-6 leading-none tracking-tighter"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            GANA
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 -mt-1 md:-mt-2">
              ACCESO
            </span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            className="text-white/70 text-base md:text-2xl max-w-2xl mx-auto mb-8 md:mb-12 px-4"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            Participa gratis cada semana y gana el derecho a comprar drops exclusivos antes que nadie
          </motion.p>

          {/* Stats grid responsive */}
          <motion.div
            className="grid grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            {[
              { num: '10', label: 'GANADORES/SEMANA' },
              { num: '24H', label: 'ACCESO EARLY' },
              { num: '100%', label: 'GRATIS' }
            ].map((stat, i) => (
              <div key={i} className="border-l-2 border-purple-500/30 pl-2 md:pl-4 text-left">
                <div className="text-2xl md:text-4xl font-black text-purple-400">
                  {stat.num}
                </div>
                <div className="text-[9px] md:text-xs text-white/40 tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
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
              // Success message
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
                  Revisaremos los ganadores el próximo viernes. <br className="hidden md:block" />
                  Te avisaremos por email.
                </p>
                <button
                  onClick={resetForm}
                  className="px-6 md:px-8 py-3 border-2 border-purple-500 text-purple-400 font-bold text-sm md:text-base hover:bg-purple-500 hover:text-white transition-all"
                >
                  INSCRIBIR A ALGUIEN MÁS
                </button>
              </motion.div>
            ) : (
              // Form
              <>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-2 md:mb-3 text-center">
                  INSCRÍBETE
                  <span className="block text-purple-400">AHORA</span>
                </h2>

                <p className="text-white/50 text-sm md:text-base text-center mb-8 md:mb-12 px-4">
                  Llena el formulario y participa por acceso early a los drops
                </p>

                <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                  
                  {/* Nombre */}
                  <div>
                    <label className="block text-white font-bold text-xs md:text-sm mb-2 tracking-wider">
                      NOMBRE COMPLETO *
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
                      EMAIL *
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
                      INSTAGRAM (opcional)
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
                    <p className="text-white/30 text-[10px] md:text-xs mt-2">
                      Para anunciarte si ganas
                    </p>
                  </div>

                  {/* ✅ TALLA - ARREGLADO COMPLETAMENTE */}
                  <div>
                    <label className="block text-white font-bold text-xs md:text-sm mb-2 tracking-wider">
                      TALLA PREFERIDA
                    </label>
                    
                    {/* ✅ Select con estilos mejorados */}
                    <div className="relative">
                      <select
                        name="preferredSize"
                        value={formData.preferredSize}
                        onChange={handleChange}
                        className="w-full px-3 md:px-4 py-3 md:py-4 bg-white/5 border border-white/10 focus:border-purple-500 text-white text-sm md:text-base outline-none transition-colors cursor-pointer appearance-none pr-10"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.5)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 0.75rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.25rem'
                        }}
                      >
                        <option value="XS" className="bg-zinc-900 text-white py-2">XS - Extra Small</option>
                        <option value="S" className="bg-zinc-900 text-white py-2">S - Small</option>
                        <option value="M" className="bg-zinc-900 text-white py-2">M - Medium</option>
                        <option value="L" className="bg-zinc-900 text-white py-2">L - Large</option>
                        <option value="XL" className="bg-zinc-900 text-white py-2">XL - Extra Large</option>
                        <option value="XXL" className="bg-zinc-900 text-white py-2">XXL - Double XL</option>
                      </select>
                    </div>

                    {/* ✅ Alternativa con botones custom (más visual) */}
                    <div className="mt-3 grid grid-cols-6 gap-2">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, preferredSize: size }))}
                          className={`py-2 text-xs md:text-sm font-bold border-2 transition-all ${
                            formData.preferredSize === size
                              ? 'border-purple-500 bg-purple-500 text-white'
                              : 'border-white/10 text-white/50 hover:border-purple-500/50 hover:text-white/80'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    
                    <p className="text-white/30 text-[10px] md:text-xs mt-2">
                      Selecciona tu talla para personalizar tu experiencia
                    </p>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    className="w-full px-6 md:px-8 py-4 md:py-5 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm md:text-lg tracking-wider transition-colors relative overflow-hidden group"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative z-10">PARTICIPAR EN EL RAFFLE</span>
                  </motion.button>

                  <p className="text-white/30 text-[10px] md:text-xs text-center">
                    Al participar aceptas nuestros términos y condiciones
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
            {[
              {
                step: '01',
                title: 'INSCRÍBETE',
                desc: 'Llena el formulario cada semana. Es gratis y muy sencillo.'
              },
              {
                step: '02',
                title: 'ESPERA EL SORTEO',
                desc: 'Cada viernes a las 8PM sorteamos 10 ganadores al azar.'
              },
              {
                step: '03',
                title: 'COMPRA PRIMERO',
                desc: 'Si ganas, tienes 24h de acceso early al próximo drop antes que todos.'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="relative bg-zinc-950 border border-white/10 p-6 md:p-8 hover:border-purple-500 transition-colors duration-300"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                {/* ✅ Número de paso optimizado */}
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
