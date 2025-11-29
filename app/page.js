'use client'
import { motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Hero from '../components/Hero'

export default function HomePage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [featured, setFeatured] = useState([])
  const carouselRef = useRef(null)
  const [carouselWidth, setCarouselWidth] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setFeatured(data.slice(0, 5))
      })
      .catch(err => console.log(err))
  }, [])

  // Calcular ancho del carrusel
  useEffect(() => {
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth
      const offsetWidth = carouselRef.current.offsetWidth
      setCarouselWidth(scrollWidth - offsetWidth)
    }
  }, [products])

  // Animaciones simplificadas para móviles
  const fadeIn = prefersReducedMotion 
    ? {} 
    : { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true, margin: "-50px" } }

  return (
    // ✅ FIX: overflow-x-hidden previene scroll horizontal
    <div className="bg-black overflow-x-hidden">
      
      {/* HERO COMPONENT */}
      <Hero />

      {/* FEATURED DROPS - Grid Asimétrico 5 productos */}
      <section className="py-24 px-4 md:px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            className="mb-16"
            {...fadeIn}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-4xl md:text-7xl font-black text-white mb-3">
              FEATURED
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 -mt-2">
                DROPS
              </span>
            </h2>
            <p className="text-white/50 text-base md:text-lg">Lo más hot del momento</p>
          </motion.div>

          {/* Grid asimétrico - 5 productos */}
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[280px] md:auto-rows-[300px] gap-4 md:gap-6">
            
            {/* Producto 1 - GRANDE (2x2) */}
            {featured[0] && (
              <motion.div
                className="group relative col-span-2 row-span-2 overflow-hidden cursor-pointer bg-zinc-950 border border-white/10 hover:border-purple-500/50 transition-colors duration-300"
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4 }}
                onClick={() => router.push(`/producto/S/{featured[0].slug}`)}
                whileHover={prefersReducedMotion ? {} : { y: -8 }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={featured[0].image}
                    alt={featured[0].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="eager"
                    priority={true}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>

                {featured[0].stock < 5 && (
                  <div className="absolute top-4 md:top-6 right-4 md:right-6 px-3 md:px-4 py-1 md:py-2 bg-pink-500 text-white text-[10px] md:text-xs font-black tracking-wider rotate-3 shadow-lg">
                    ÚLTIMAS {featured[0].stock}
                  </div>
                )}

                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8">
                  <div className="text-purple-400 text-[10px] md:text-xs font-bold tracking-widest mb-2">
                    HOT DROP
                  </div>
                  <h3 className="text-white text-2xl md:text-5xl font-black mb-2 md:mb-3 leading-tight">
                    {featured[0].title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-2xl md:text-3xl font-black">
                      S/{featured[0].price}
                    </span>
                    <span className="text-purple-400 text-2xl md:text-4xl">→</span>
                  </div>
                  <div className="w-16 md:w-20 h-[2px] md:h-[3px] bg-purple-500 mt-3 md:mt-4" />
                </div>

                {/* Shimmer effect solo desktop */}
                <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.div>
            )}

            {/* Producto 2 - Alto (1x2) */}
            {featured[1] && (
              <motion.div
                className="group relative col-span-1 row-span-2 overflow-hidden cursor-pointer bg-zinc-950 border border-white/10 hover:border-purple-500/50 transition-colors duration-300"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1, duration: 0.4 }}
                onClick={() => router.push(`/producto/S/{featured[1].slug}`)}
                whileHover={prefersReducedMotion ? {} : { y: -8 }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={featured[1].image}
                    alt={featured[1].title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                </div>

                {featured[1].stock < 5 && (
                  <div className="absolute top-3 md:top-4 right-3 md:right-4 px-2 md:px-3 py-1 bg-pink-500 text-white text-[9px] md:text-[10px] font-black tracking-wider rotate-3">
                    {featured[1].stock} LEFT
                  </div>
                )}

                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                  <div className="text-purple-400 text-[9px] md:text-[10px] font-bold tracking-widest mb-1 md:mb-2">
                    NEW
                  </div>
                  <h3 className="text-white text-lg md:text-2xl font-black mb-1 md:mb-2 leading-tight line-clamp-2">
                    {featured[1].title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-lg md:text-xl font-black">
                      S/{featured[1].price}
                    </span>
                    <span className="text-purple-400 text-xl md:text-2xl">→</span>
                  </div>
                  <div className="w-10 md:w-12 h-[2px] bg-purple-500 mt-2 md:mt-3" />
                </div>
              </motion.div>
            )}

            {/* Producto 3 - Cuadrado superior (1x1) */}
            {featured[2] && (
              <motion.div
                className="group relative col-span-1 row-span-1 overflow-hidden cursor-pointer bg-zinc-950 border border-white/10 hover:border-purple-500/50 transition-colors duration-300"
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.15, duration: 0.4 }}
                onClick={() => router.push(`/producto/S/{featured[2].slug}`)}
                whileHover={prefersReducedMotion ? {} : { y: -8, scale: 1.02 }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={featured[2].image}
                    alt={featured[2].title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                </div>

                {featured[2].stock < 5 && (
                  <div className="absolute top-2 md:top-3 right-2 md:right-3 px-2 py-1 bg-pink-500 text-white text-[8px] font-black tracking-wider rotate-6">
                    🔥
                  </div>
                )}

                <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4">
                  <h3 className="text-white text-base md:text-lg font-black mb-1 leading-tight line-clamp-2">
                    {featured[2].title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-lg md:text-xl font-black">
                      S/{featured[2].price}
                    </span>
                    <span className="text-purple-400 text-lg md:text-xl">→</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Producto 4 - Cuadrado inferior (1x1) */}
            {featured[3] && (
              <motion.div
                className="group relative col-span-1 row-span-1 overflow-hidden cursor-pointer bg-zinc-950 border border-white/10 hover:border-purple-500/50 transition-colors duration-300"
                initial={prefersReducedMotion ? false : { opacity: 0, x: 30 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.2, duration: 0.4 }}
                onClick={() => router.push(`/producto/S/{featured[3].slug}`)}
                whileHover={prefersReducedMotion ? {} : { y: -8, scale: 1.02 }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={featured[3].image}
                    alt={featured[3].title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                </div>

                {featured[3].stock < 5 && (
                  <div className="absolute top-2 md:top-3 right-2 md:right-3 px-2 py-1 bg-pink-500 text-white text-[8px] font-black tracking-wider -rotate-3">
                    ⚡
                  </div>
                )}

                <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4">
                  <h3 className="text-white text-base md:text-lg font-black mb-1 leading-tight line-clamp-2">
                    {featured[3].title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-lg md:text-xl font-black">
                      S/{featured[3].price}
                    </span>
                    <span className="text-purple-400 text-lg md:text-xl">→</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Producto 5 - Ancho inferior (2x1) */}
            {featured[4] && (
              <motion.div
                className="group relative col-span-2 row-span-1 overflow-hidden cursor-pointer bg-zinc-950 border border-white/10 hover:border-purple-500/50 transition-colors duration-300"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.25, duration: 0.4 }}
                onClick={() => router.push(`/producto/S/{featured[4].slug}`)}
                whileHover={prefersReducedMotion ? {} : { y: -8 }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={featured[4].image}
                    alt={featured[4].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                </div>

                {featured[4].stock < 5 && (
                  <div className="absolute top-3 md:top-4 right-3 md:right-4 px-2 md:px-3 py-1 bg-pink-500 text-white text-[9px] md:text-[10px] font-black tracking-wider -rotate-3">
                    HOT
                  </div>
                )}

                <div className="absolute inset-0 flex items-center p-4 md:p-6">
                  <div className="max-w-md">
                    <div className="text-purple-400 text-[9px] md:text-[10px] font-bold tracking-widest mb-1 md:mb-2">
                      LIMITED
                    </div>
                    <h3 className="text-white text-xl md:text-3xl font-black mb-2 leading-tight line-clamp-2">
                      {featured[4].title}
                    </h3>
                    <div className="flex items-center gap-3 md:gap-4">
                      <span className="text-white text-xl md:text-2xl font-black">
                        S/{featured[4].price}
                      </span>
                      <div className="flex-1 h-[2px] bg-purple-500 max-w-[100px]" />
                      <span className="text-purple-400 text-xl md:text-2xl">→</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </section>

      {/* ✅ CARRUSEL OPTIMIZADO - Fix overflow horizontal */}
      <section className="py-24 bg-zinc-950 relative">
        {/* ✅ Container con overflow control */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12">
          <motion.div
            {...fadeIn}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-4xl md:text-7xl font-black text-white mb-3">
              TODA LA
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 -mt-2">
                COLECCIÓN
              </span>
            </h2>
            <div className="flex items-center gap-4 text-white/50">
              <p className="text-sm md:text-lg">Arrastra para explorar →</p>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-purple-500/50 to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* ✅ Carrusel con containment mejorado */}
        <div className="overflow-hidden">
          <motion.div 
            ref={carouselRef}
            className="cursor-grab active:cursor-grabbing"
            whileTap={{ cursor: "grabbing" }}
          >
            <motion.div
              drag="x"
              dragConstraints={{ right: 0, left: -carouselWidth }}
              dragElastic={0.05}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 30 }}
              className="flex gap-4 md:gap-6 pl-4 md:pl-6 pr-4 md:pr-6"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="min-w-[260px] md:min-w-[320px] flex-shrink-0 group"
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.3 }}
                >
                  <div 
                    className="relative bg-black border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/producto/S/{product.slug}`)
                    }}
                  >
                    {/* Imagen */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 260px, 320px"
                        loading="lazy"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Quick view hover - solo desktop */}
                      <div className="hidden md:flex absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center">
                        <span className="text-white font-bold text-sm tracking-wider">
                          VER DETALLES →
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-white font-bold text-base md:text-lg mb-1 line-clamp-1">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-purple-400 text-lg md:text-xl font-black">
                          S/{product.price}
                        </span>
                        {product.stock < 5 && (
                          <span className="text-pink-500 text-[10px] md:text-xs font-bold">
                            {product.stock} LEFT
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Card final "Ver más" */}
              <motion.div
                className="min-w-[260px] md:min-w-[320px] flex-shrink-0"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
                viewport={{ once: true }}
              >
                <div 
                  className="h-full min-h-[400px] bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 flex flex-col items-center justify-center p-6 md:p-8 cursor-pointer hover:from-purple-600/30 hover:to-pink-600/30 transition-all"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push('/tienda')
                  }}
                >
                  <div className="text-5xl md:text-6xl mb-4">→</div>
                  <h3 className="text-white font-black text-xl md:text-2xl mb-2 text-center">
                    VER TODO
                  </h3>
                  <p className="text-white/60 text-xs md:text-sm text-center">
                    Explora el catálogo completo
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Indicador de drag */}
        <div className="text-center mt-6 md:mt-8 text-white/30 text-[10px] md:text-xs tracking-wider">
          ← ARRASTRA PARA VER MÁS →
        </div>
      </section>

      {/* WHY ZORU - Visual cards */}
      <section className="py-24 px-4 md:px-6 bg-black relative overflow-hidden">
        
        {/* Glows decorativos - optimizados */}
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          <motion.div
            className="text-center mb-16 md:mb-20"
            {...fadeIn}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-4xl md:text-7xl font-black text-white mb-4">
              POR QUÉ
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 -mt-2">
                ZORU
              </span>
            </h2>
          </motion.div>

          {/* Cards visuales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                icon: '999',
                title: 'LIMITADO',
                desc: 'Solo 999 unidades por drop. Sin restock jamás.'
              },
              {
                icon: '🔥',
                title: 'EXCLUSIVO',
                desc: 'Diseños únicos que no encontrarás en ningún otro lado.'
              },
              {
                icon: '⚡',
                title: 'RÁPIDO',
                desc: 'Drops semanales. Entregas en 24h a todo Trujillo.'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="group relative bg-zinc-950 border border-white/10 p-6 md:p-8 hover:border-purple-500 transition-all"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={prefersReducedMotion ? {} : { y: -8 }}
              >
                {/* Glow en hover */}
                <div className="absolute inset-0 bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative z-10">
                  <div className="text-5xl md:text-7xl mb-4 md:mb-6 text-center">
                    {item.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white mb-3 text-center tracking-wider">
                    {item.title}
                  </h3>
                  <div className="w-12 h-[2px] bg-purple-500 mx-auto mb-4" />
                  <p className="text-white/60 text-sm leading-relaxed text-center">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL - Simplificado */}
      <section className="py-24 md:py-32 px-4 md:px-6 bg-zinc-950">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-5xl md:text-8xl font-black leading-none mb-6 md:mb-8">
            <span className="block text-white">READY TO</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 -mt-2">
              DROP?
            </span>
          </h2>

          <p className="text-white/60 text-base md:text-xl mb-8 md:mb-12 max-w-2xl mx-auto px-4">
            Entra al raffle semanal y gana acceso exclusivo a los próximos drops
          </p>

          <motion.button
            onClick={() => router.push('/raffle')}
            className="px-8 md:px-12 py-4 md:py-5 bg-purple-600 hover:bg-purple-700 text-white font-black text-base md:text-lg tracking-wider transition-colors relative overflow-hidden group"
            whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10">ENTRAR AL RAFFLE</span>
          </motion.button>

          <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-6 text-white/40 text-[10px] md:text-xs">
            <span>✓ Gratis</span>
            <div className="w-1 h-1 bg-white/40 rounded-full" />
            <span>✓ Sin compromisos</span>
            <div className="w-1 h-1 bg-white/40 rounded-full" />
            <span>✓ Premios semanales</span>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
