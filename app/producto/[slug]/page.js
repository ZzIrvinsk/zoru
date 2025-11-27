'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useCart } from '../../../components/CartContext'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { add } = useCart()
  
  const [product, setProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  // Cargar producto
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.slug === params.slug)
        if (found) {
          setProduct(found)
          setSelectedSize(found.sizes?.[0] || '')
        }
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [params.slug])

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Por favor selecciona una talla')
      return
    }
    add({ ...product, selectedSize }, quantity)
  }

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Cargando...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-8xl mb-6">😕</div>
          <h2 className="text-4xl font-black text-white mb-4">
            PRODUCTO NO ENCONTRADO
          </h2>
          <p className="text-white/50 mb-8">
            Este producto no existe o fue eliminado
          </p>
          <button
            onClick={() => router.push('/tienda')}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold tracking-wider transition-colors"
          >
            VER TIENDA
          </button>
        </div>
      </div>
    )
  }

  // Simular galería (en producción tendrías múltiples imágenes)
  const images = [product.image, product.image, product.image]

  return (
    <div className="bg-black min-h-screen pt-24 pb-16">
      
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Breadcrumb */}
        <motion.div
          className="mb-8 flex items-center gap-2 text-sm text-white/50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button onClick={() => router.push('/')} className="hover:text-purple-400 transition-colors">
            Home
          </button>
          <span>/</span>
          <button onClick={() => router.push('/tienda')} className="hover:text-purple-400 transition-colors">
            Tienda
          </button>
          <span>/</span>
          <span className="text-white/70">{product.title}</span>
        </motion.div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* GALERÍA DE IMÁGENES */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Imagen Principal */}
            <div className="relative aspect-[3/4] bg-zinc-950 border-2 border-purple-500/20 overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={images[selectedImage]}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Badge stock bajo */}
              {product.stock < 5 && product.stock > 0 && (
                <motion.div
                  className="absolute top-6 right-6 px-4 py-2 bg-pink-500 text-white text-xs font-black tracking-wider rotate-3 shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 3 }}
                >
                  ÚLTIMAS {product.stock}
                </motion.div>
              )}

              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <div className="text-white font-black text-4xl tracking-wider">
                    SOLD OUT
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-[3/4] border-2 transition-all ${
                    selectedImage === i
                      ? 'border-purple-500'
                      : 'border-white/10 hover:border-purple-500/50'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* INFO DEL PRODUCTO */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Badge colección */}
            <div className="inline-block px-4 py-2 border border-purple-500/50 text-purple-400 text-xs font-black tracking-widest">
              WINTER 2025 DROP
            </div>

            {/* Título */}
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tighter">
                {product.title}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-white">
                  ${product.price}
                </span>
                {product.stock > 0 && (
                  <span className="text-sm text-purple-400 font-bold">
                    {product.stock} en stock
                  </span>
                )}
              </div>
            </div>

            {/* Descripción */}
            <p className="text-white/70 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Línea decorativa */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

            {/* Selector de Talla */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-white font-bold tracking-wider">
                  TALLA
                </label>
                <button className="text-purple-400 text-sm hover:underline">
                  Guía de tallas
                </button>
              </div>

              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {(product.sizes || ['S', 'M', 'L', 'XL']).map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 font-bold text-sm tracking-wider transition-all ${
                      selectedSize === size
                        ? 'bg-purple-600 text-white border-2 border-purple-500'
                        : 'bg-white/5 text-white border-2 border-white/10 hover:border-purple-500/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Cantidad */}
            <div>
              <label className="block text-white font-bold tracking-wider mb-4">
                CANTIDAD
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center border-2 border-white/10 hover:border-purple-500 text-white font-bold transition-all"
                >
                  −
                </button>
                <span className="text-white font-bold text-2xl w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-12 h-12 flex items-center justify-center border-2 border-white/10 hover:border-purple-500 text-white font-bold transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-4">
              <motion.button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full py-5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-black text-lg tracking-wider transition-colors relative overflow-hidden group"
                whileHover={{ scale: product.stock > 0 ? 1.02 : 1 }}
                whileTap={{ scale: product.stock > 0 ? 0.98 : 1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10">
                  {product.stock === 0 ? 'AGOTADO' : 'AGREGAR AL CART'}
                </span>
              </motion.button>

              <button
                onClick={() => router.push('/tienda')}
                className="w-full py-4 border-2 border-white/20 hover:border-purple-500 text-white font-bold tracking-wider transition-colors"
              >
                SEGUIR COMPRANDO
              </button>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-8 border-t border-white/10">
              {[
                { icon: '✓', text: 'Envío gratis en compras +$100' },
                { icon: '✓', text: 'Devoluciones en 30 días' },
                { icon: '✓', text: 'Edición limitada - 999 unidades' },
                { icon: '✓', text: 'Auténtico garantizado' }
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-white/60 text-sm">
                  <span className="text-purple-400 font-bold">{feature.icon}</span>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Share - VERSIÓN FUNCIONAL */}
            <div className="flex items-center gap-4">
              <span className="text-white/50 text-sm font-bold">COMPARTIR:</span>
              <div className="flex gap-2">
                
                {/* Instagram */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    alert('¡Link copiado! Pégalo en tu Instagram Story 📸')
                  }}
                  className="w-10 h-10 flex items-center justify-center bg-gradient-to-tr from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all"
                  title="Compartir en Instagram"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={() => {
                    const text = `Mira este producto brutal de ZORU: ${product.title} 🔥`
                    const url = window.location.href
                    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
                  }}
                  className="w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 transition-all"
                  title="Compartir por WhatsApp"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </button>

                {/* Twitter/X */}
                <button
                  onClick={() => {
                    const text = `Check out ${product.title} en @zoru_peru 🔥`
                    const url = window.location.href
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
                  }}
                  className="w-10 h-10 flex items-center justify-center bg-black border border-white/20 hover:bg-white hover:text-black transition-all group"
                  title="Compartir en Twitter/X"
                >
                  <svg className="w-4 h-4 text-white group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Productos Relacionados */}
        <section className="mt-24">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
            TAMBIÉN TE PUEDE
            <span className="block text-purple-400">INTERESAR</span>
          </h2>
          <p className="text-white/50 text-sm mb-8">
            Ver más en <button onClick={() => router.push('/tienda')} className="text-purple-400 hover:underline">Tienda</button>
          </p>
        </section>
      </div>
    </div>
  )
}
