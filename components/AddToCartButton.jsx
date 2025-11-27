'use client'
import { useCart } from './CartContext'
import { usePoints } from './PointsContext'
import { useState } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'

function FlyingImage({ src, rect, onComplete }) {
  if(!rect) return null
  const style = {
    position: 'fixed',
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    pointerEvents: 'none',
    zIndex: 9999
  }
  return createPortal(
    <motion.div initial={{ x:0,y:0, scale:1, opacity:1 }} animate={{ x: window.innerWidth - 80 - rect.left, y: -rect.top + 20, scale:0.2, opacity:0.8 }} transition={{ duration: 0.9 }} style={style} onAnimationComplete={onComplete}>
      <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
    </motion.div>,
    document.body
  )
}

export default function AddToCartButton({ product }) {
  const { add, setOpen } = useCart()
  const { earn } = usePoints()
  const [flying, setFlying] = useState(null)
  const [rect, setRect] = useState(null)

  function handleAdd(e){
    // find image element in product page or card
    const img = document.querySelector('img[src="'+product.image+'"]')
    let r = null
    if(img) r = img.getBoundingClientRect()
    setRect(r)
    setFlying(product.image)
    add(product,1)
    setTimeout(()=> setOpen(true), 900)
    // simulate earn only on checkout, but we can add small points for add
    // earn(product.price * 0)
  }

  return (
    <div className="flex gap-3">
      <button onClick={handleAdd} className="px-5 py-3 bg-black text-white rounded">Añadir al carrito</button>
      <button className="px-5 py-3 border rounded">Comprar ahora</button>
      {flying && <FlyingImage src={flying} rect={rect} onComplete={()=> setFlying(null)} />}
    </div>
  )
}
