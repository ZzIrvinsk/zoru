'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from './CartContext'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'


export default function Navbar() {
  const { items, setOpen } = useCart()
  const prefersReducedMotion = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session } = useSession()

  // ✅ Memoizar cart count para evitar recálculos
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items])

  // ✅ Throttled scroll handler para mejor performance
  useEffect(() => {
    let ticking = false
    
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }
    
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ✅ useCallback para handlers
  const handleCartOpen = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  const handleMobileToggle = useCallback(() => {
    setMobileOpen(prev => !prev)
  }, [])

  const handleMobileClose = useCallback(() => {
    setMobileOpen(false)
  }, [])

  const handleMobileCart = useCallback(() => {
    setOpen(true)
    setMobileOpen(false)
  }, [setOpen])

  // ✅ Memoizar links para evitar recrear en cada render
  const navLinks = useMemo(() => [
    { href: '/tienda', label: 'TIENDA' },
    { href: '/colecciones', label: 'DROPS' },
    { href: '/about', label: 'CREW' },
    { href: '/raffle', label: 'RAFFLE' },
  ], [])

  // Links de auth (desktop)
  const authLinksDesktop = session?.user ? (
    <>
      <Link
        href="/perfil"
        className="group relative px-3 lg:px-4 py-2 text-purple-300 hover:text-white text-xs lg:text-sm font-bold tracking-wider transition-colors"
      >
        Perfil
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="group relative px-3 lg:px-4 py-2 text-xs lg:text-sm font-bold tracking-wider text-white/70 hover:text-red-400 transition-colors"
      >
        CERRAR SESIÓN
      </button>
    </>
  ) : (
    <>
      <Link
        href="/login"
        className="group relative px-3 lg:px-4 py-2 text-white/70 hover:text-white text-xs lg:text-sm font-bold tracking-wider transition-colors"
      >
        INICIAR SESIÓN
      </Link>
      <Link
        href="/register"
        className="rounded-full bg-purple-600 px-3 py-2 text-xs lg:text-sm font-medium text-white hover:bg-purple-500"
      >
        Crear cuenta
      </Link>
    </>
  )

  // Links de auth (mobile)
  const authLinksMobile = session?.user ? (
    <>
      <Link
        href="/perfil"
        onClick={handleMobileClose}
        className="block px-4 py-3 text-purple-300 font-bold text-base border-l-2 border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 transition-all"
      >
        Perfil
      </Link>
      <button
        onClick={() => { handleMobileClose(); signOut({ callbackUrl: '/' }) }}
        className="block w-full text-left px-4 py-3 text-red-400 font-bold text-base border-l-2 border-red-400/40 hover:border-red-500 hover:bg-red-500/10 transition-all"
      >
        CERRAR SESIÓN
      </button>
    </>
  ) : (
    <>
      <Link
        href="/login"
        onClick={handleMobileClose}
        className="block px-4 py-3 text-white font-bold text-base border-l-2 border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 transition-all"
      >
        Iniciar sesión
      </Link>
      <Link
        href="/register"
        onClick={handleMobileClose}
        className="block px-4 py-3 rounded bg-purple-600 text-white font-bold text-base my-2 hover:bg-purple-500 transition-all"
      >
        Crear cuenta
      </Link>
    </>
  )

  return (
    <>
      {/* NAVBAR */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-black/90 backdrop-blur-xl border-b border-purple-500/30 shadow-lg shadow-purple-900/20' 
            : 'bg-black/50 backdrop-blur-sm border-b border-white/5'
        }`}
        initial={prefersReducedMotion ? false : { y: -100 }}
        animate={prefersReducedMotion ? {} : { y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between py-3 md:py-4">
            
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2 md:gap-3 group">
              <motion.div 
                className="relative w-8 md:w-10 h-8 md:h-10"
                whileHover={prefersReducedMotion ? {} : { rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Image 
                  src="/img/logo.png" 
                  alt="Zoru" 
                  width={40} 
                  height={40}
                  className="object-contain"
                  priority
                />
                {/* Glow effect - solo desktop */}
                {!prefersReducedMotion && (
                  <div className="hidden md:block absolute inset-0 bg-purple-600 blur-xl opacity-0 group-hover:opacity-50 transition-opacity pointer-events-none" style={{ willChange: 'auto' }} />
                )}
              </motion.div>
              
              <span className="font-black text-lg md:text-xl text-white tracking-tighter">
                ZORU
              </span>

              {/* Badge "LIVE" - solo desktop sin scroll */}
              {!scrolled && !prefersReducedMotion && (
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
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className="group relative px-3 lg:px-4 py-2 text-white/70 hover:text-white text-xs lg:text-sm font-bold tracking-wider transition-colors"
                >
                  {link.label}
                  {/* Underline animado */}
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}

              {/* AUTH DESKTOP */}
              {authLinksDesktop}

              {/* CART BUTTON */}
              <motion.button
                onClick={handleCartOpen}
                className="relative ml-2 lg:ml-4 px-4 lg:px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs lg:text-sm rounded-sm transition-colors group"
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="hidden sm:inline">CART</span>
                <span className="sm:hidden">🛒</span>
                
                {/* Counter badge */}
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      initial={prefersReducedMotion ? false : { scale: 0 }}
                      animate={prefersReducedMotion ? {} : { scale: 1 }}
                      exit={prefersReducedMotion ? {} : { scale: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute -top-2 -right-2 flex items-center justify-center min-w-[24px] h-6 px-1 bg-pink-500 text-white text-xs font-black rounded-full border-2 border-black"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Glow en hover - solo desktop */}
                {!prefersReducedMotion && (
                  <div className="hidden md:block absolute inset-0 bg-purple-500 blur-lg opacity-0 group-hover:opacity-50 transition-opacity -z-10 pointer-events-none" style={{ willChange: 'auto' }} />
                )}
              </motion.button>
            </nav>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={handleMobileToggle}
              className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 group"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
              animate={prefersReducedMotion ? { height: 'auto' } : { opacity: 1, height: 'auto' }}
              exit={prefersReducedMotion ? { height: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-black/95 backdrop-blur-xl border-t border-purple-500/30"
            >
              <nav className="container mx-auto px-4 py-6 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={handleMobileClose}
                      className="block px-4 py-3 text-white font-bold text-base border-l-2 border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 transition-all"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* AUTH MOBILE */}
                {authLinksMobile}

                <motion.button
                  onClick={handleMobileCart}
                  className="mt-4 w-full px-4 py-3 bg-purple-600 text-white font-bold text-base rounded flex items-center justify-between"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  CART
                  {count > 0 && (
                    <span className="flex items-center justify-center min-w-[32px] h-8 px-2 bg-pink-500 text-white text-sm font-black rounded-full">
                      {count}
                    </span>
                  )}
                </motion.button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* FLOATING SOCIAL BUTTONS - Optimizados */}
      <div className="fixed right-4 md:right-6 bottom-4 md:bottom-6 flex flex-col gap-2 md:gap-3 z-40">
        {/* WhatsApp */}
        {/* ... aquí dejas tal cual tu código de WhatsApp + Instagram + badge ... */}
      </div>
    </>
  )
}
