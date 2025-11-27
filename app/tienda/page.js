'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '../../components/CartContext'

export default function TiendaPage() {
  const router = useRouter()
  const { add } = useCart() // ← CAMBIO: era addToCart, ahora es add
  
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [searchTerm, setSearchTerm] = useState('')
  const [flyingItem, setFlyingItem] = useState(null)

  // Cargar productos
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setFilteredProducts(data)
      })
      .catch(err => console.log(err))
  }, [])

  // Filtrar y ordenar
  useEffect(() => {
    let result = [...products]

    // Filtro por categoría
    if (selectedCategory !== 'all') {
      result = result.filter(p => 
        p.title.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    }

    // Filtro por búsqueda
    if (searchTerm) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Ordenar
    switch(sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      default: // newest
        break
    }

    setFilteredProducts(result)
  }, [products, selectedCategory, sortBy, searchTerm])

  const categories = [
    { id: 'all', label: 'TODO' },
    { id: 'hoodie', label: 'HOODIES' },
    { id: 'tee', label: 'TEES' },
    { id: 'pant', label: 'PANTS' },
    { id: 'accessory', label: 'ACCESORIOS' },
  ]

  // Función para manejar el "fly to cart"
  const handleFlyToCart = (product, startPosition) => {
    setFlyingItem({
      product,
      startX: startPosition.x,
      startY: startPosition.y
    })

    // Agregar al carrito
    add(product, 1)

    // Limpiar animación después de completarse
    setTimeout(() => {
      setFlyingItem(null)
    }, 800)
  }

  return (
    <div className="bg-black min-h-screen pt-24 pb-16">
      
      {/* HEADER CON FILTROS */}
      <section className="px-6 mb-12">
        <div className="container mx-auto max-w-7xl">
          
          {/* Título y contador */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-white mb-3 tracking-tighter">
              SHOP
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 -mt-2">
                ALL
              </span>
            </h1>
            
            <div className="flex items-center gap-3 text-white/50 text-sm">
              <span className="text-purple-400 font-bold">{filteredProducts.length}</span>
              {filteredProducts.length === 1 ? 'producto' : 'productos'} disponibles
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            </div>
          </motion.div>

          {/* Filtros Row */}
          <motion.div
            className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            
            {/* Categorías */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2 font-bold text-sm tracking-wider transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat.label}
                </motion.button>
              ))}
            </div>

            {/* Search y Sort */}
            <div className="flex gap-3 w-full lg:w-auto">
              
              {/* Búsqueda */}
              <div className="relative flex-1 lg:w-64">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 focus:border-purple-500 text-white placeholder:text-white/30 outline-none text-sm transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Ordenar */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 text-white text-sm outline-none cursor-pointer hover:border-purple-500 transition-colors"
              >
                <option value="newest">Más reciente</option>
                <option value="price-low">Menor precio</option>
                <option value="price-high">Mayor precio</option>
                <option value="name">A-Z</option>
              </select>
            </div>
          </motion.div>

        </div>
      </section>

      {/* GRID DE PRODUCTOS */}
      <section className="px-6">
        <div className="container mx-auto max-w-7xl">
          
          <AnimatePresence mode="wait">
            {filteredProducts.length === 0 ? (
              
              // Empty state
              <motion.div
                key="empty"
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-8xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  No encontramos nada
                </h3>
                <p className="text-white/50 mb-6">
                  Intenta con otro término de búsqueda
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition-colors"
                >
                  VER TODO
                </button>
              </motion.div>

            ) : (
              
              // Grid de productos
              <motion.div
                key="grid"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                layout
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    index={index}
                    onFlyToCart={handleFlyToCart}
                    router={router}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* ANIMACIÓN "FLY TO CART" */}
      <AnimatePresence>
        {flyingItem && (
          <motion.div
            className="fixed z-[100] pointer-events-none"
            initial={{
              x: flyingItem.startX,
              y: flyingItem.startY,
              scale: 1,
              opacity: 1
            }}
            animate={{
              x: window.innerWidth - 100,
              y: 20,
              scale: 0.3,
              opacity: 0.5
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0.0, 0.2, 1]
            }}
          >
            <div className="w-24 h-32 bg-zinc-900 border-2 border-purple-500 relative overflow-hidden shadow-2xl shadow-purple-500/50">
              <Image
                src={flyingItem.product.image}
                alt={flyingItem.product.title}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

// PRODUCT CARD COMPONENT
function ProductCard({ product, index, onFlyToCart, router }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    
    // Obtener posición del botón
    const rect = e.currentTarget.getBoundingClientRect()
    const startPosition = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }
    
    onFlyToCart(product, startPosition)
  }

  return (
    <motion.div
      className="group relative cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      layout
      onClick={() => router.push(`/producto/${product.slug}`)}
    >
      {/* Card container */}
      <div className="relative bg-zinc-950 border border-white/10 overflow-hidden group-hover:border-purple-500/50 transition-all duration-300">
        
        {/* Imagen */}
        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className={`object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Skeleton loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 animate-pulse" />
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badge de stock bajo */}
          {product.stock < 5 && product.stock > 0 && (
            <motion.div
              className="absolute top-4 right-4 px-3 py-1 bg-pink-500 text-white text-xs font-black tracking-wider rotate-3 shadow-lg"
              initial={{ rotate: 0, scale: 0 }}
              animate={{ rotate: 3, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              ÚLTIMAS {product.stock}
            </motion.div>
          )}

          {/* Badge agotado */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-white font-black text-2xl tracking-wider">
                SOLD OUT
              </div>
            </div>
          )}

          {/* Quick actions hover */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wider transition-colors relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              <span className="relative z-10">
                {product.stock === 0 ? 'AGOTADO' : 'AGREGAR AL CART'}
              </span>
            </button>
          </div>
        </div>

        {/* Info section */}
        <div className="p-5 space-y-3">
          
          {/* Título */}
          <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
            {product.title}
          </h3>

          {/* Descripción */}
          <p className="text-white/50 text-xs line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Precio y tallas */}
          <div className="flex items-end justify-between pt-2 border-t border-white/10">
            <div>
              <div className="text-2xl font-black text-white">
                ${product.price}
              </div>
              {product.sizes && (
                <div className="flex gap-1 mt-2">
                  {product.sizes.slice(0, 4).map(size => (
                    <span 
                      key={size}
                      className="text-[10px] text-white/40 px-2 py-0.5 border border-white/10"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Arrow indicator */}
            <motion.div
              className="text-purple-400 text-2xl"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.div>
          </div>

          {/* Colores disponibles */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-2 pt-2">
              {product.colors.map(color => (
                <div
                  key={color}
                  className="w-6 h-6 rounded-full border-2 border-white/20"
                  style={{ backgroundColor: color === 'black' ? '#000' : color === 'white' ? '#fff' : color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>

        {/* Shine effect sutil */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      </div>
    </motion.div>
  )
}
