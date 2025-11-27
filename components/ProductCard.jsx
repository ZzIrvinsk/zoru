
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useCart } from './CartContext'
import { motion } from 'framer-motion'

export default function ProductCard({product}) {
  const [hover, setHover] = useState(false)
  const { add } = useCart()

  return (
    <article className="border rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3] bg-gray-100">
        <Image src={product.image} alt={product.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        <div className="absolute top-3 right-3 bg-black text-white text-xs px-2 py-1 rounded">Nuevo</div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{product.title}</h3>
        <p className="text-sm text-gray-500">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold">${product.price}</div>
            <div className="text-sm text-gray-500">Stock: Disponible</div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 border rounded" onClick={() => add(product,1)}>Añadir</button>
            <Link href={`/producto/${product.slug}`} className="px-3 py-2 bg-black text-white rounded">Ver</Link>
          </div>
        </div>
      </div>
    </article>
  )
}
