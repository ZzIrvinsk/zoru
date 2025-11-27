'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function RafflePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    instagram: '',
    preferredSize: 'M'
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
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
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="bg-black min-h-screen pt-24 pb-16">
      
      {/* HERO */}
      <section className="relative px-6 py-20 overflow-hidden">
        
        {/* Decoración */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(#8B5CF6 1px, transparent 1px), linear-gradient(90deg, #8B5CF6 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          
          {/* Badge */}
          <motion.div
            className="inline-block px-4 py-2 border-2 border-purple-500/50 text-purple-400 text-xs font-black tracking-widest mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            RAFFLE SEMANAL
          </motion.div>

          {/* Título */}
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6 leading-none tracking-tighter"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            GANA
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 -mt-2">
              ACCESO
            </span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            className="text-white/70 text-xl md:text-2xl max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Participa gratis cada semana y gana el derecho a comprar drops exclusivos antes que nadie
          </motion.p>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { num: '10', label: 'GANADORES/SEMANA' },
              { num: '24H', label: 'ACCESO EARLY' },
              { num: '100%', label: 'GRATIS' }
            ].map((stat, i) => (
              <div key={i} className="border-l-2 border-purple-500/30 pl-4 text-left">
                <div className="text-4xl font-black text-purple-400">
                  {stat.num}
                </div>
                <div className="text-xs text-white/40 tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FORMULARIO */}
      <section className="px-6 py-16 bg-zinc-950">
        <div className="container mx-auto max-w-2xl">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            
            {submitted ? (
              // Success message
              <motion.div
                className="text-center py-20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="text-7xl mb-6">✓</div>
                <h3 className="text-4xl font-black text-white mb-4">
                  ¡ESTÁS DENTRO!
                </h3>
                <p className="text-white/60 text-lg mb-8">
                  Revisaremos los ganadores el próximo viernes. <br/>
                  Te avisaremos por email.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3 border-2 border-purple-500 text-purple-400 font-bold hover:bg-purple-500 hover:text-white transition-all"
                >
                  INSCRIBIR A ALGUIEN MÁS
                </button>
              </motion.div>
            ) : (
              // Form
              <>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-3 text-center">
                  INSCRÍBETE
                  <span className="block text-purple-400">AHORA</span>
                </h2>

                <p className="text-white/50 text-center mb-12">
                  Llena el formulario y participa por acceso early a los drops
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Nombre */}
                  <div>
                    <label className="block text-white font-bold text-sm mb-2 tracking-wider">
                      NOMBRE COMPLETO *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 focus:border-purple-500 text-white placeholder:text-white/30 outline-none transition-colors"
                      placeholder="Tu nombre"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-white font-bold text-sm mb-2 tracking-wider">
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 focus:border-purple-500 text-white placeholder:text-white/30 outline-none transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="block text-white font-bold text-sm mb-2 tracking-wider">
                      INSTAGRAM (opcional)
                    </label>
                    <div className="flex">
                      <span className="flex items-center px-4 bg-white/5 border border-r-0 border-white/10 text-white/50">
                        @
                      </span>
                      <input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="flex-1 px-4 py-4 bg-white/5 border border-white/10 focus:border-purple-500 text-white placeholder:text-white/30 outline-none transition-colors"
                        placeholder="tuusuario"
                      />
                    </div>
                    <p className="text-white/30 text-xs mt-2">
                      Para anunciarte si ganas
                    </p>
                  </div>

                  {/* Talla */}
                  <div>
                    <label className="block text-white font-bold text-sm mb-2 tracking-wider">
                      TALLA PREFERIDA
                    </label>
                    <select
                      name="preferredSize"
                      value={formData.preferredSize}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 focus:border-purple-500 text-white outline-none transition-colors cursor-pointer"
                    >
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    className="w-full px-8 py-5 bg-purple-600 hover:bg-purple-700 text-white font-black text-lg tracking-wider transition-colors relative overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative z-10">PARTICIPAR EN EL RAFFLE</span>
                  </motion.button>

                  <p className="text-white/30 text-xs text-center">
                    Al participar aceptas nuestros términos y condiciones
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="py-24 px-6 bg-black">
        <div className="container mx-auto max-w-6xl">
          
          <motion.h2
            className="text-5xl md:text-7xl font-black text-white text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            CÓMO
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              FUNCIONA
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'INSCRÍBETE',
                desc: 'Llena el formulario cada semana. Es gratis y toma 30 segundos.'
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
                className="relative bg-zinc-950 border border-white/10 p-8 hover:border-purple-500 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="text-8xl font-black text-purple-500/10 absolute top-4 right-4">
                  {item.step}
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-white mb-4">
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
