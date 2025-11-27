'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
const WishlistContext = createContext()
export function useWishlist(){ return useContext(WishlistContext) }

export default function WishlistProvider({ children }){
  const [items, setItems] = useState([])
  useEffect(()=>{
    try{
      const raw = localStorage.getItem('zoru_wishlist')
      if(raw) setItems(JSON.parse(raw))
    }catch(e){}
  },[])
  useEffect(()=> {
    try{ localStorage.setItem('zoru_wishlist', JSON.stringify(items)) }catch(e){}
  },[items])

  function toggle(product){
    setItems(prev => {
      const found = prev.find(p=>p.id===product.id)
      if(found) return prev.filter(p=>p.id!==product.id)
      return [...prev, product]
    })
  }
  function remove(id){ setItems(prev=>prev.filter(p=>p.id!==id)) }
  function clear(){ setItems([]) }

  return (
    <WishlistContext.Provider value={{ items, toggle, remove, clear }}>
      {children}
    </WishlistContext.Provider>
  )
}
