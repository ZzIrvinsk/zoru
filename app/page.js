'use client'
import { motion, useMotionValue, useTransform } from 'framer-motion'
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

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setFeatured(data.slice(0, 5)) // 5 productos para grid asimétrico
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

  return (
    <div className="bg-black">
      
      {/* HERO COMPONENT */}
      <Hero />

      {/* FEATURED DROPS - Grid Asimétrico 5 productos */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-white mb-3">
              FEATURED
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 -mt-2">
                DROPS
              </span>
            </h2>
            <p className="text-white/50 text-lg">Lo más hot del momento</p>
          </motion.div>

          {/* Grid asimétrico - 5 productos */}
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[300px] gap-6">
            
            {/* Producto 1 - GRANDE (2x2) */}
            {featured[0] && (
              <motion.div
                className="group relative col-span-2 row-span-2 overflow-hidden cursor-pointer bg-zinc-950 border border-white/10 hover:border-purple-500/50 transition-all"
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                onClick={() => router.push(`/producto/${featured[0].slug}`)}
                whileHover={{ y: -10, rotate: 1 }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={featured[0].image}
                    alt={featured[0].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>

                {featured[0].stock < 5 && (
                  <motion.div
                    className="absolute top-6 right-6 px-4 py-2 bg-pink-500 text-white text-xs font-black tracking-wider rotate-3 shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 3 }}
                    transition={{ delay: 0.5 }}
                  >
                    ÚLTIMAS {featured[0].stock}
                  </motion.div>
                )}

                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="text-purple-400 text-xs font-bold tracking-widest mb-2">
                    HOT DROP
                  </div>
                  <h3 className="text-white text-4xl md:text-5xl font-black mb-3 leading-tight">
                    {featured[0].title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-3xl font-black">
                      ${featured[0].price}
                    </span>
                    <motion.div
                      className="text-purple-400 text-4xl"
                      animate={{ x: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.div>
                  </div>
                  <div className="w-20 h-[3px] bg-purple-500 mt-4" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.div>
            )}

            {/* Producto 2 - Alto (1x2) */}
            {featured[1] && (
              <motion.div
                className="group relative col-span-1 row-span-2 overflow-hidden cursor-pointer bg-zinc-950 border border-white/10 hover:border-purple-500/50 transition-all"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                onClick={() => router.push(`/producto/${featured[1].slug}`)}
                whileHover={{ y: -10, rotate: -1 }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={featured[1].image}
                    alt={featured[1].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                </div>

                {featured[1].stock < 5 && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-pink-500 text-white text-[10px] font-black tracking-wider rotate-3">
                    {featured[1].stock} LEFT
                  </div>
                )}

                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="text-purple-400 text-[10px] font-bold tracking-widest mb-2">
                    NEW
                  </div>
                  <h3 className="text-white text-2xl font-black mb-2 leading-tight">
                    {featured[1].title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xl font-black">
                      ${featured[1].price}
                    </span>
                    <span className="text-purple-400 text-2xl">→</span>
                  </div>
                  <div className="w-12 h-[2px] bg-purple-500 mt-3" />
                </div>
              </motion.div>
            )}

            {/* Producto 3 - Cuadrado superior (1x1) */}
            {featured[2] && (
              <motion.div
                className="group relative col-span-1 row-span-1 overflow-hidden cursor-pointer bg-zinc-950 border border-white/10 hover:border-purple-500/50 transition-all"
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                onClick={() => router.push(`/producto/${featured[2].slug}`)}
                whileHover={{ y: -10, scale: 1.05, rotate: -2 }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={featured[2].image}
                    alt={featured[2].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                </div>

                {featured[2].stock < 5 && (
                  <div className="absolute top-3 right-3 px-2 py-1 bg-pink-500 text-white text-[8px] font-black tracking-wider rotate-6">
                    🔥
                  </div>
                )}

                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <h3 className="text-white text-lg font-black mb-1 leading-tight line-clamp-2">
                    {featured[2].title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xl font-black">
                      ${featured[2].price}
                    </span>
                    <span className="text-purple-400 text-xl">→</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Producto 4 - Cuadrado inferior (1x1) */}
            {featured[3] && (
              <motion.div
                className="group relative col-span-1 row-span-1 overflow-hidden cursor-pointer bg-zinc-950 border border-white/10 hover:border-purple-500/50 transition-all"
                initial={{ opacity: 0, x: 50, rotate: -5 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                onClick={() => router.push(`/producto/${featured[3].slug}`)}
                whileHover={{ y: -10, scale: 1.05, rotate: 3 }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={featured[3].image}
                    alt={featured[3].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                </div>

                {featured[3].stock < 5 && (
                  <div className="absolute top-3 right-3 px-2 py-1 bg-pink-500 text-white text-[8px] font-black tracking-wider -rotate-3">
                    ⚡
                  </div>
                )}

                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <h3 className="text-white text-lg font-black mb-1 leading-tight line-clamp-2">
                    {featured[3].title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xl font-black">
                      ${featured[3].price}
                    </span>
                    <span className="text-purple-400 text-xl">→</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Producto 5 - Ancho inferior (2x1) */}
            {featured[4] && (
              <motion.div
                className="group relative col-span-2 row-span-1 overflow-hidden cursor-pointer bg-zinc-950 border border-white/10 hover:border-purple-500/50 transition-all"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                onClick={() => router.push(`/producto/${featured[4].slug}`)}
                whileHover={{ y: -10, rotate: -1 }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={featured[4].image}
                    alt={featured[4].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                </div>

                {featured[4].stock < 5 && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-pink-500 text-white text-[10px] font-black tracking-wider -rotate-3">
                    HOT
                  </div>
                )}

                <div className="absolute inset-0 flex items-center p-6">
                  <div className="max-w-md">
                    <div className="text-purple-400 text-[10px] font-bold tracking-widest mb-2">
                      LIMITED
                    </div>
                    <h3 className="text-white text-2xl md:text-3xl font-black mb-2 leading-tight">
                      {featured[4].title}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className="text-white text-2xl font-black">
                        ${featured[4].price}
                      </span>
                      <div className="flex-1 h-[2px] bg-purple-500" />
                      <span className="text-purple-400 text-2xl">→</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </section>

      {/* CARRUSEL HORIZONTAL - Drag to scroll */}
      <section className="py-24 px-6 bg-zinc-950 overflow-hidden">
        <div className="max-w-7xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-white mb-3">
              TODA LA
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 -mt-2">
                COLECCIÓN
              </span>
            </h2>
            <div className="flex items-center gap-4 text-white/50">
              <p className="text-lg">Arrastra para explorar →</p>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-purple-500/50 to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* Carrusel draggable */}
        <motion.div 
          ref={carouselRef}
          className="cursor-grab active:cursor-grabbing"
          whileTap={{ cursor: "grabbing" }}
        >
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -carouselWidth }}
            className="flex gap-6 px-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="min-w-[280px] md:min-w-[320px] flex-shrink-0 group"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div 
                  className="relative bg-black border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer"
                  onClick={() => router.push(`/producto/${product.slug}`)}
                >
                  {/* Imagen */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Quick view hover */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-bold text-sm tracking-wider">
                        VER DETALLES →
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-400 text-xl font-black">
                        ${product.price}
                      </span>
                      {product.stock < 5 && (
                        <span className="text-pink-500 text-xs font-bold">
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
              className="min-w-[280px] md:min-w-[320px] flex-shrink-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div 
                className="h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 flex flex-col items-center justify-center p-8 cursor-pointer hover:from-purple-600/30 hover:to-pink-600/30 transition-all"
                onClick={() => router.push('/tienda')}
              >
                <div className="text-6xl mb-4">→</div>
                <h3 className="text-white font-black text-2xl mb-2 text-center">
                  VER TODO
                </h3>
                <p className="text-white/60 text-sm text-center">
                  Explora el catálogo completo
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Indicador de drag */}
        <div className="text-center mt-8 text-white/30 text-xs tracking-wider">
          ← ARRASTRA PARA VER MÁS →
        </div>
      </section>

      {/* WHY ZORU - Visual cards */}
      <section className="py-24 px-6 bg-black relative">
        
        {/* Glows decorativos */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-white mb-4">
              POR QUÉ
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 -mt-2">
                ZORU
              </span>
            </h2>
          </motion.div>

          {/* Cards visuales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                desc: 'Drops semanales. Entregas en 24h en Lima.'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="group relative bg-zinc-950 border border-white/10 p-8 hover:border-purple-500 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -10 }}
              >
                {/* Glow en hover */}
                <div className="absolute inset-0 bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  <div className="text-7xl mb-6 text-center">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3 text-center tracking-wider">
                    {item.title}
                  </h3>
                  <div className="w-12 h-[2px] bg-purple-500 mx-auto mb-4" />
                  <p className="text-white/60 text-sm text-center leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL - Simplificado */}
      <section className="py-32 px-6 bg-zinc-950">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl md:text-8xl font-black leading-none mb-8">
            <span className="block text-white">READY TO</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 -mt-2">
              DROP?
            </span>
          </h2>

          <p className="text-white/60 text-xl mb-12 max-w-2xl mx-auto">
            Entra al raffle semanal y gana acceso exclusivo a los próximos drops
          </p>

          <motion.button
            onClick={() => router.push('/raffle')}
            className="px-12 py-5 bg-purple-600 hover:bg-purple-700 text-white font-black text-lg tracking-wider transition-colors relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10">ENTRAR AL RAFFLE</span>
          </motion.button>

          <div className="mt-8 flex items-center justify-center gap-6 text-white/40 text-xs">
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
