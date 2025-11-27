'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// COMPONENTE: Modal de Notificaciones
function NotifyModal({ isOpen, onClose, dropName }) {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Guardar en localStorage
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
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-6"
            onClick={onClose}
          >
            <div 
              className="bg-black border-2 border-purple-500/50 p-8 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border border-white/10 hover:border-purple-500 text-white/50 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {success ? (
                // Success state
                <motion.div 
                  className="text-center py-8"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <motion.div 
                    className="text-7xl mb-4"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    ✓
                  </motion.div>
                  <h3 className="text-3xl font-black text-white mb-3">
                    ¡LISTO!
                  </h3>
                  <p className="text-white/60 text-sm">
                    Te avisaremos cuando <span className="text-purple-400 font-bold">{dropName}</span> esté disponible
                  </p>
                </motion.div>
              ) : (
                // Form
                <>
                  <h3 className="text-3xl font-black text-white mb-2 leading-tight">
                    ACTIVAR
                    <span className="block text-purple-400">RECORDATORIO</span>
                  </h3>
                  
                  <p className="text-white/60 text-sm mb-6 leading-relaxed">
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
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-purple-500 text-white placeholder:text-white/30 outline-none transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm tracking-wider transition-colors relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <span className="relative z-10">NOTIFICARME</span>
                    </button>

                    <p className="text-white/30 text-xs text-center">
                      Sin spam. Solo te avisamos del drop.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// PÁGINA PRINCIPAL
export default function DropsPage() {
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [products, setProducts] = useState([])
  const [notifyModal, setNotifyModal] = useState({ open: false, dropName: '' })

  // Cargar productos
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.slice(0, 3))) // Solo primeros 3
      .catch(err => console.log(err))
  }, [])

  // Countdown
  useEffect(() => {
    const targetTime = new Date().getTime() + (6 * 60 * 60 * 1000)
    
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetTime - now
      
      if (distance > 0) {
        setCountdown({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const activeDrop = products[0] || null

  return (
    <div className="bg-black min-h-screen pt-24 pb-16">
      
      {/* HERO - DROP ACTIVO */}
      <section className="relative min-h-[80vh] flex items-center px-6 overflow-hidden">
        
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20" />
        
        {/* Grid retro */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(#8B5CF6 1px, transparent 1px), linear-gradient(90deg, #8B5CF6 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        {/* Badge LIVE flotante */}
        <motion.div
          className="absolute top-8 right-8 z-20"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [3, 8, 3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="relative">
            <motion.div 
              className="absolute inset-0 bg-pink-500 blur-2xl"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div className="relative bg-pink-500 text-white px-6 py-3 font-black text-sm tracking-wider border-4 border-white rotate-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE NOW
              </div>
            </div>
          </div>
        </motion.div>

        {/* Esquinas decorativas */}
        <div className="absolute top-8 left-8 w-32 h-32 border-l-4 border-t-4 border-purple-500/30" />
        <div className="absolute bottom-8 right-8 w-32 h-32 border-r-4 border-b-4 border-pink-500/30" />

        {/* Contenido */}
        <div className="relative z-10 container mx-auto max-w-7xl">
          <div className="max-w-2xl">
            
            {activeDrop ? (
              <>
                {/* Collection tag */}
                <motion.div
                  className="inline-block px-4 py-2 border-2 border-purple-500/50 text-purple-400 text-xs font-black tracking-widest mb-6"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  WINTER 2025 DROP
                </motion.div>

                {/* Título */}
                <motion.h1
                  className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6 leading-none tracking-tighter"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {activeDrop.title}
                </motion.h1>

                {/* Descripción */}
                <motion.p
                  className="text-white/70 text-xl mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Edición limitada a <span className="text-purple-400 font-bold">999 unidades</span>. 
                  Una vez agotado, desaparece para siempre.
                </motion.p>

                {/* Stock bar */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/50 text-sm">STOCK DISPONIBLE</span>
                    <span className="text-pink-500 font-bold text-sm">
                      {activeDrop.stock}/999
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(activeDrop.stock / 999) * 100}%` }}
                      transition={{ delay: 0.8, duration: 1 }}
                    />
                  </div>
                </motion.div>

                {/* Countdown */}
                <motion.div
                  className="bg-black/50 backdrop-blur-sm border-2 border-purple-500/30 p-6 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="text-purple-400 text-xs font-bold tracking-widest mb-3">
                    TERMINA EN
                  </div>
                  <div className="flex gap-4">
                    {[
                      { value: countdown.hours, label: 'HORAS' },
                      { value: countdown.minutes, label: 'MIN' },
                      { value: countdown.seconds, label: 'SEG' }
                    ].map((unit, i) => (
                      <div key={i} className="flex-1 text-center">
                        <div className="text-4xl md:text-5xl font-black text-white font-mono">
                          {unit.value.toString().padStart(2, '0')}
                        </div>
                        <div className="text-white/40 text-xs mt-1 tracking-wider">
                          {unit.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* CTAs */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <Link href={`/producto/${activeDrop.slug}`} className="flex-1">
                    <button className="w-full px-8 py-5 bg-purple-600 hover:bg-purple-700 text-white font-black text-lg tracking-wider transition-colors">
                      COMPRAR AHORA - ${activeDrop.price}
                    </button>
                  </Link>

                  <Link href="/tienda">
                    <button className="px-8 py-5 border-2 border-white/20 hover:border-purple-500 text-white font-bold tracking-wider transition-colors">
                      VER MÁS
                    </button>
                  </Link>
                </motion.div>
              </>
            ) : (
              <div className="text-white text-2xl">Cargando drop...</div>
            )}

          </div>
        </div>
      </section>

      {/* PRÓXIMOS DROPS */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="container mx-auto max-w-7xl">
          
          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-white mb-4">
              PRÓXIMOS
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                DROPS
              </span>
            </h2>
            <p className="text-white/50 text-lg">
              Activa notificaciones para no perderte nada
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.slice(1, 3).map((product, i) => (
              <motion.div
                key={product.id}
                className="group relative bg-black border-2 border-white/10 hover:border-purple-500/50 transition-all overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                {/* Placeholder imagen */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex items-center justify-center">
                  <div className="text-8xl text-purple-500/20 font-black">
                    {i + 2}
                  </div>
                  
                  <div className="absolute top-6 left-6 px-4 py-2 bg-purple-600 text-white font-bold text-xs tracking-wider">
                    EN {i === 0 ? '3 DÍAS' : '1 SEMANA'}
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-purple-400 text-xs font-bold tracking-widest mb-2">
                    WINTER 2025
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-3 text-white/50 text-sm mb-6">
                    <span>🗓️</span>
                    <span>{i === 0 ? 'Viernes 29 Nov' : 'Viernes 6 Dic'}, 8:00 PM</span>
                  </div>

                  {/* BOTÓN CONECTADO AL MODAL */}
                  <button 
                    onClick={() => setNotifyModal({ open: true, dropName: product.title })}
                    className="w-full py-3 border-2 border-purple-500/30 hover:bg-purple-600 hover:border-purple-600 text-white font-bold text-sm tracking-wider transition-all"
                  >
                    ACTIVAR RECORDATORIO
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-6 bg-black">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-8xl font-black text-white mb-6">
              NO TE LO
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                PIERDAS
              </span>
            </h2>

            <p className="text-white/60 text-xl mb-12">
              Cada drop se agota en horas. Sin restock. Sin segundas oportunidades.
            </p>

            <Link href="/raffle">
              <button className="px-10 py-5 bg-purple-600 hover:bg-purple-700 text-white font-black text-lg tracking-wider transition-colors">
                ENTRAR AL RAFFLE
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* MODAL DE NOTIFICACIONES */}
      <NotifyModal 
        isOpen={notifyModal.open}
        onClose={() => setNotifyModal({ open: false, dropName: '' })}
        dropName={notifyModal.dropName}
      />

    </div>
  )
}
