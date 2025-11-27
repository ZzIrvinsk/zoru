
'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function useCart(){
  return useContext(CartContext)
}

export default function CartProvider({ children }) {
  const [items, setItems] = useState([]) // {product, qty}
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('zoru_cart')
      if(raw) setItems(JSON.parse(raw))
    } catch(e){}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('zoru_cart', JSON.stringify(items))
    } catch(e){}
  }, [items])

  function add(product, qty = 1){
    setItems(prev => {
      const found = prev.find(p => p.product.id === product.id)
      if(found){
        return prev.map(p => p.product.id === product.id ? { ...p, qty: p.qty + qty } : p)
      }
      return [...prev, { product, qty }]
    })
    setOpen(true)
  }

  function remove(productId){
    setItems(prev => prev.filter(p => p.product.id !== productId))
  }

  function clear(){
    setItems([])
  }

  function checkout(earnFn){
    // simulate checkout: call earnFn(total)
    try{ if(earnFn) earnFn(total()) }catch(e){}
    setItems([])
  }

  function total(){
    return items.reduce((s, it) => s + (it.product.price * it.qty), 0)
  }

  return (
    <CartContext.Provider value={{ items, add, remove, clear, total, open, setOpen }}>
      {children}
    </CartContext.Provider>
  )
}
