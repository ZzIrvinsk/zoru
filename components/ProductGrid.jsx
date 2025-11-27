
'use client'
import ProductCard from './ProductCard'
import products from '../data/products.json'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductGrid(){
  const PER_PAGE = 6
  const [visible, setVisible] = useState(PER_PAGE)
  const [loadingMore, setLoadingMore] = useState(false)

  const visibleProducts = products.slice(0, visible)

  function loadMore(){
    setLoadingMore(true)
    setTimeout(() => {
      setVisible(v => Math.min(products.length, v + PER_PAGE))
      setLoadingMore(false)
      // smooth scroll to newly loaded items
      const el = document.getElementById('product-grid-end')
      if(el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 400)
  }

  return (
    <>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Destacados</h3>
        <div className="flex gap-4 overflow-x-auto py-2">
          {products.slice(0, Math.min(8, products.length)).map(p => (
            <div key={p.id} className="min-w-[220px] flex-shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {visibleProducts.map(p => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} layout>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div id="product-grid-end" className="mt-8 flex justify-center">
        {visible < products.length ? (
          <button onClick={loadMore} className="px-6 py-3 bg-black text-white rounded" disabled={loadingMore}>
            {loadingMore ? 'Cargando...' : 'Cargar más'}
          </button>
        ) : (
          <div className="text-sm text-gray-500">Has llegado al final de la colección.</div>
        )}
      </div>
    </>
  )
}
