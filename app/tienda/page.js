'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '../../components/CartContext'
import { formatPrice } from '../../lib/currency'




export default function TiendaPage() {
  const router = useRouter()
  const { add } = useCart()
  const prefersReducedMotion = useReducedMotion()
  
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [searchTerm, setSearchTerm] = useState('')
  const [flyingItem, setFlyingItem] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Cargar productos
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err))
  }, [])

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (selectedCategory !== 'all') {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          (p.description && p.description.toLowerCase().includes(term))
      )
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        break
    }

    return result
  }, [products, selectedCategory, sortBy, searchTerm])

  // Stats
  const stats = useMemo(
    () => ({
      total: products.length,
      inStock: products.filter((p) => p.stock > 0).length,
      lowStock: products.filter((p) => p.stock > 0 && p.stock < 5).length,
      soldOut: products.filter((p) => p.stock === 0).length,
    }),
    [products]
  )

  const categories = [
    { id: 'all', label: 'ALL' },
    { id: 'hoodie', label: 'HOODIES' },
    { id: 'boxy', label: 'BOXY FIT' },
    { id: 'tee', label: 'TEES' },
    { id: 'pant', label: 'PANTS' },
    { id: 'accessory', label: 'EXTRAS' },
  ]

  const handleFlyToCart = useCallback(
    (product, startPosition) => {
      setFlyingItem({
        product,
        startX: startPosition.x,
        startY: startPosition.y,
      })

      add(product, 1)

      setTimeout(() => {
        setFlyingItem(null)
      }, 800)
    },
    [add]
  )

  const resetFilters = useCallback(() => {
    setSearchTerm('')
    setSelectedCategory('all')
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
            backgroundImage:
              'linear-gradient(#8B5CF6 1px, transparent 1px), linear-gradient(90deg, #8B5CF6 1px, transparent 1px)',
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

        {/* Contenido hero */}
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
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1],
                    }
              }
              transition={{ duration: 2, repeat: Infinity }}
            />
            EXCLUSIVE SHOP
          </motion.div>

          {/* Título */}
          <div className="relative mb-8">
            <motion.h1
              className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black leading-none tracking-tighter"
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8, y: 50 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="block text-white drop-shadow-[0_0_40px_rgba(139,92,246,0.5)]">
                SHOP
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 -mt-4 md:-mt-8">
                ALL
              </span>
            </motion.h1>
          </div>

          {/* Subtítulo */}
          <motion.div
            className="flex items-center justify-center gap-4 text-white/50 text-sm md:text-base mb-12 font-mono tracking-wider"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <span className="text-purple-400">EXCLUSIVE</span>
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="text-pink-400">LIMITED</span>
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <span className="text-white/70">NO RESTOCK</span>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {[
              { value: stats.total, label: 'TOTAL', color: 'from-white to-purple-400' },
              { value: stats.inStock, label: 'EN STOCK', color: 'from-purple-400 to-pink-500' },
              { value: stats.lowStock, label: 'LOW', color: 'from-pink-500 to-pink-400' },
              { value: stats.soldOut, label: 'SOLD OUT', color: 'from-white/40 to-white/20' },
            ].map((stat, i) => (
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
                  <div
                    className={`text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br ${stat.color} mb-1`}
                  >
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

      {/* FILTROS STICKY */}
      <section className="sticky top-20 md:top-24 z-30 bg-black/95 backdrop-blur-lg border-y border-purple-500/20 px-4 md:px-6 py-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Categorías */}
            <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
              <div className="flex gap-2 min-w-max lg:min-w-0 lg:flex-wrap">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 md:px-5 py-3 font-black text-xs md:text-sm tracking-wider transition-all whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                        : 'bg-zinc-950 text-white/50 hover:text-white border border-white/10 hover:border-purple-500/50'
                    }`}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {cat.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Search + sort + view */}
            <div className="flex gap-2 md:gap-3 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 lg:w-64">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-zinc-950 border border-white/10 focus:border-purple-500 text-white placeholder:text-white/30 outline-none text-xs md:text-sm transition-colors font-mono"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-lg leading-none"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-zinc-950 border border-white/10 text-white text-xs md:text-sm outline-none cursor-pointer hover:border-purple-500 transition-colors font-mono"
              >
                <option value="newest">CLASIF.</option>
                <option value="price-low">$ BAJO</option>
                <option value="price-high">$ ALTO</option>
                <option value="name">A-Z</option>
              </select>

              {/* View mode */}
              <div className="hidden md:flex gap-1 border border-white/10 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-white/50 hover:text-white'
                  }`}
                  title="Grid"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-white/50 hover:text-white'
                  }`}
                  title="List"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Contador resultados */}
          <div className="flex items-center gap-3 mt-4 text-white/50 text-xs md:text-sm font-mono">
            <span className="text-purple-400 font-black text-base">{filteredProducts.length}</span>
            <span className="uppercase tracking-wider">
              {filteredProducts.length === 1 ? 'PRODUCT' : 'PRODUCTS'}
            </span>
            {selectedCategory !== 'all' && (
              <>
                <span className="text-white/20">·</span>
                <button
                  onClick={resetFilters}
                  className="text-purple-400 hover:text-purple-300 font-bold uppercase tracking-wider"
                >
                  CLEAR
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* GRID DE PRODUCTOS */}
      <section className="px-4 md:px-6 py-12 md:py-16">
        <div className="container mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            {filteredProducts.length === 0 ? (
              <motion.div
                key="empty"
                className="text-center py-20 md:py-32"
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 border-4 border-purple-500/30 flex items-center justify-center"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          scale: [1, 1.05, 1],
                          rotate: [0, 5, -5, 0],
                        }
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg
                    className="w-10 h-10 md:w-12 md:h-12 text-purple-500/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </motion.div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                  NO RESULTS
                </h3>
                <p className="text-white/50 text-base md:text-lg mb-8 max-w-md mx-auto font-mono">
                  Try different keywords or browse all categories
                </p>
                <motion.button
                  onClick={resetFilters}
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm tracking-wider transition-colors relative overflow-hidden group"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10">VIEW ALL</span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'
                    : 'flex flex-col gap-6'
                }
                layout
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    viewMode={viewMode}
                    onFlyToCart={handleFlyToCart}
                    router={router}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Fly to cart */}
      {!prefersReducedMotion && (
        <AnimatePresence>
          {flyingItem && (
            <motion.div
              className="fixed z-[100] pointer-events-none hidden md:block"
              initial={{
                x: flyingItem.startX,
                y: flyingItem.startY,
                scale: 1,
                opacity: 1,
              }}
              animate={{
                x: typeof window !== 'undefined' ? window.innerWidth - 100 : 0,
                y: 20,
                scale: 0.3,
                opacity: 0.5,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.4, 0.0, 0.2, 1],
              }}
            >
              <div className="w-24 h-32 bg-zinc-900 border-2 border-purple-500 relative overflow-hidden shadow-2xl shadow-purple-500/50">
                <Image
                  src={flyingItem.product.image}
                  alt={flyingItem.product.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

/* PRODUCT CARD */

function ProductCard({ product, index, viewMode, onFlyToCart, router, prefersReducedMotion }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleAddToCart = useCallback(
    (e) => {
      e.stopPropagation()

      const rect = e.currentTarget.getBoundingClientRect()
      const startPosition = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      }

      onFlyToCart(product, startPosition)
    },
    [product, onFlyToCart]
  )

  const handleCardClick = useCallback(() => {
    router.push(`/producto/${product.slug}`)
  }, [router, product.slug])

  if (viewMode === 'list') {
    return (
      <motion.div
        className="hidden md:flex group relative cursor-pointer bg-zinc-950 border-2 border-white/10 hover:border-purple-500/50 transition-all overflow-hidden"
        initial={prefersReducedMotion ? false : { opacity: 0, x: -50 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
        transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.4 }}
        whileHover={prefersReducedMotion ? {} : { scale: 1.01, x: 5 }}
        onClick={handleCardClick}
      >
        <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden bg-zinc-900">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="192px"
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 animate-pulse" />
          )}
        </div>

        <div className="flex-1 p-6 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-black text-white mb-2 group-hover:text-purple-400 transition-colors">
              {product.title}
            </h3>
            <p className="text-white/60 text-sm mb-4 line-clamp-2">{product.description}</p>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-black text-white">{formatPrice(product.price)}</div>
              {product.stock < 5 && product.stock > 0 && (
                <span className="px-3 py-1 bg-pink-500/20 border border-pink-500 text-pink-400 text-xs font-bold font-mono">
                  {product.stock} LEFT
                </span>
              )}
            </div>
          </div>

          <motion.button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-black tracking-wider transition-colors"
            whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {product.stock === 0 ? 'SOLD OUT' : 'ADD →'}
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="group relative cursor-pointer"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.05, 0.5),
        duration: 0.5,
      }}
      whileHover={prefersReducedMotion ? {} : { y: -8 }}
      onClick={handleCardClick}
    >
      <div className="relative bg-zinc-950 border-2 border-white/10 overflow-hidden group-hover:border-purple-500 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/20">
        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            loading={index < 8 ? 'eager' : 'lazy'}
            priority={index < 4}
            className={`object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 animate-pulse" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {product.stock < 5 && product.stock > 0 && (
            <motion.div
              className="absolute top-3 right-3 px-3 py-1.5 bg-pink-500 text-white text-xs font-black tracking-wider rotate-3 font-mono"
              initial={{ rotate: 0, scale: 0 }}
              animate={{ rotate: 3, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {product.stock} LEFT
            </motion.div>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/90 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <div className="text-white font-black text-2xl mb-2 rotate-[-5deg] tracking-wider">
                  SOLD OUT
                </div>
                <div className="text-white/50 text-sm font-mono">999/999</div>
              </div>
            </div>
          )}

          <div className="hidden md:block absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-black text-sm tracking-wider transition-colors relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              <span className="relative z-10">
                {product.stock === 0 ? 'SOLD OUT' : 'AÑADIR AL CARRITO →'}
              </span>
            </button>
          </div>
        </div>

        <div className="p-4 md:p-5 space-y-3">
          <h3 className="text-base md:text-lg font-black text-white group-hover:text-purple-400 transition-colors line-clamp-2 leading-tight">
            {product.title}
          </h3>

          <p className="hidden md:block text-white/50 text-xs line-clamp-2">{product.description}</p>

          <div className="flex items-end justify-between pt-3 border-t border-white/10">
            <div>
              <div className="text-2xl md:text-3xl font-black text-white">
                {formatPrice(product.price)}
              </div>
              {product.sizes && (
                <div className="flex gap-1 mt-2">
                  {product.sizes.slice(0, 4).map((size) => (
                    <span
                      key={size}
                      className="text-[10px] text-white/40 px-2 py-0.5 border border-white/10 font-mono"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <motion.div
              className="text-purple-400 text-2xl"
              animate={prefersReducedMotion ? {} : { x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="md:hidden w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold text-xs tracking-wider transition-colors"
          >
            {product.stock === 0 ? 'SOLD OUT' : 'ADD'}
          </button>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      </div>
    </motion.div>
  )
}
