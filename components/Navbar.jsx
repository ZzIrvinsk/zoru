'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from './CartContext'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar(){
  const { items, setOpen } = useCart()
  const count = items.reduce((s,i)=>s+i.qty,0)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(()=> {
    function onScroll(){ setScrolled(window.scrollY > 20) }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])

  return (
    <>
    {/* NAVBAR */}
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/90 backdrop-blur-xl border-b border-purple-500/30 shadow-lg shadow-purple-900/20' 
          : 'bg-black/50 backdrop-blur-sm border-b border-white/5'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between py-4">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              className="relative w-10 h-10"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Image 
                src="/img/logo.png" 
                alt="Zoru" 
                width={40} 
                height={40}
                className="object-contain"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 bg-purple-600 blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
            </motion.div>
            
            <span className="font-black text-xl text-white tracking-tighter">
              ZORU
            </span>

            {/* Badge "LIVE" */}
            {!scrolled && (
              <motion.div 
                className="hidden md:flex items-center gap-1 px-2 py-1 bg-pink-500 text-white text-[10px] font-bold rounded"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                LIVE
              </motion.div>
            )}
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: '/tienda', label: 'TIENDA' },
              { href: '/colecciones', label: 'DROPS' },
              { href: '/about', label: 'CREW' },
              { href: '/raffle', label: 'RAFFLE' },
            ].map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className="group relative px-4 py-2 text-white/70 hover:text-white text-sm font-bold tracking-wider transition-colors"
              >
                {link.label}
                {/* Underline animado */}
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}

            {/* CART BUTTON */}
            <motion.button
              onClick={() => setOpen(true)}
              className="relative ml-4 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-sm transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              CART
              
              {/* Counter badge */}
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-pink-500 text-white text-xs font-black rounded-full border-2 border-black"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Glow en hover */}
              <div className="absolute inset-0 bg-purple-500 blur-lg opacity-0 group-hover:opacity-50 transition-opacity -z-10" />
            </motion.button>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 group"
          >
            <span className={`w-6 h-0.5 bg-white transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-white transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-white transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-purple-500/30"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-1">
              {[
                { href: '/tienda', label: 'TIENDA' },
                { href: '/colecciones', label: 'DROPS' },
                { href: '/about', label: 'CREW' },
                { href: '/raffle', label: 'RAFFLE' },
              ].map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-white font-bold text-lg border-l-2 border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 transition-all"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.button
                onClick={() => {
                  setOpen(true)
                  setMobileOpen(false)
                }}
                className="mt-4 w-full px-4 py-3 bg-purple-600 text-white font-bold text-lg rounded flex items-center justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                CART
                {count > 0 && (
                  <span className="flex items-center justify-center w-8 h-8 bg-pink-500 text-white text-sm font-black rounded-full">
                    {count}
                  </span>
                )}
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>

    {/* FLOATING SOCIAL BUTTONS - Estilo retro */}
    <div className="fixed right-6 bottom-6 flex flex-col gap-3 z-40">
      
      {/* WhatsApp */}
      <motion.a
        href="https://wa.me/51934569960?text=Hola%20Zoru"
        target="_blank"
        rel="noreferrer"
        className="group relative"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-green-500 blur-xl opacity-0 group-hover:opacity-60 transition-opacity" />
        
        <div className="relative flex items-center gap-2 px-4 py-3 bg-green-500 text-white font-bold text-sm rounded shadow-lg border-2 border-green-400 overflow-hidden">
          {/* Hover scan effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          
          <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          
          <span className="relative z-10 hidden lg:inline">WhatsApp</span>
        </div>
      </motion.a>

      {/* Instagram */}
      <motion.a
        href="https://instagram.com/zoru.peru"
        target="_blank"
        rel="noreferrer"
        className="group relative"
        whileHover={{ scale: 1.1, rotate: -5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {/* Glow gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-500 blur-xl opacity-0 group-hover:opacity-60 transition-opacity" />
        
        <div className="relative flex items-center gap-2 px-4 py-3 bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-500 text-white font-bold text-sm rounded shadow-lg border-2 border-pink-400 overflow-hidden">
          {/* Hover scan effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          
          <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          
          <span className="relative z-10 hidden lg:inline">Instagram</span>
        </div>
      </motion.a>

      {/* Badge pequeño decorativo */}
      <motion.div
        className="hidden lg:flex items-center justify-center w-12 h-12 bg-black border-2 border-purple-500/50 text-purple-400 font-black text-xs rounded rotate-12"
        animate={{ rotate: [12, 18, 12] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        999
      </motion.div>
    </div>
    </>
  )
}
