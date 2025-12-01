'use client'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'

export default function Footer() {
  const prefersReducedMotion = useReducedMotion()

  // ✅ Memoizar arrays estáticos
  const shopLinks = useMemo(() => [
    { href: '/tienda', label: 'Todos los productos' },
    { href: '/colecciones', label: 'Nuevos drops' },
    { href: '/wishlist', label: 'Wishlist' },
    { href: '/raffle', label: 'Raffles' },
  ], [])

  const infoLinks = useMemo(() => [
    { href: '/about', label: 'Sobre nosotros' },
    { href: '/about#faq', label: 'FAQ' },
    { href: '/envios', label: 'Envíos' },
    { href: '/contacto', label: 'Contacto' },
  ], [])

  const legalLinks = useMemo(() => [
    { href: '/terminos', label: 'Términos' },
    { href: '/privacidad', label: 'Privacidad' },
    { href: '/devoluciones', label: 'Devoluciones' },
    { href: '/libro-reclamaciones', label: 'Libro de Reclamaciones' },
  ], [])

  const paymentMethods = useMemo(() => ['VISA', 'MASTERCARD', 'YAPE', 'PLIN'], [])

  const socialLinks = useMemo(() => [
    {
      href: 'https://instagram.com/zoru.peru',
      label: 'Instagram',
      hoverClass: 'hover:from-purple-600 hover:to-pink-600',
      icon: (
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      )
    },
    {
      href: 'https://wa.me/51934569960',
      label: 'WhatsApp',
      hoverClass: 'hover:bg-green-500',
      icon: (
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      )
    },
    {
      href: 'https://tiktok.com/@zoru.peru',
      label: 'TikTok',
      hoverClass: 'hover:bg-white',
      icon: (
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
      ),
      iconColorClass: 'group-hover:text-black'
    }
  ], [])

  return (
    <footer className="relative bg-black border-t border-purple-500/20 overflow-hidden">
      
      {/* Decoración de fondo optimizada */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(#8B5CF6 1px, transparent 1px), linear-gradient(90deg, #8B5CF6 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          willChange: 'auto'
        }} 
      />

      {/* Glow circles - solo desktop */}
      {!prefersReducedMotion && (
        <>
          <div className="hidden md:block absolute -top-64 -left-64 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" style={{ willChange: 'auto' }} />
          <div className="hidden md:block absolute -bottom-64 -right-64 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" style={{ willChange: 'auto' }} />
        </>
      )}

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 md:py-12">
        
        {/* Top Section - MÁS COMPACTO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-10">
          
          {/* Brand Column */}
          <motion.div 
            className="md:col-span-2 lg:col-span-1"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
          >
            {/* Logo más compacto */}
            <div className="mb-4">
              <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-2">
                ZORU
              </h3>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            </div>

            <p className="text-white/60 text-xs leading-relaxed mb-4 max-w-sm">
              Streetwear exclusivo que redefine tu estilo. Drops limitados, 
              autenticidad garantizada, sin restock.
            </p>

            {/* Badges más compactos */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold">
                LIMITED EDITION
              </div>
              <div className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] font-bold">
                999 UNITS
              </div>
            </div>

            {/* Social Icons más compactos */}
            <div className="flex gap-2">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group w-9 h-9 flex items-center justify-center bg-white/5 ${social.hoverClass} border border-white/10 transition-all`}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.1, rotate: i % 2 === 0 ? 5 : -5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <svg className={`w-4 h-4 text-white transition-colors ${social.iconColorClass || ''}`} fill="currentColor" viewBox="0 0 24 24">
                    {social.icon}
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Shop Links - MÁS COMPACTO */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <h4 className="text-white font-black text-xs tracking-wider mb-3 uppercase">
              Shop
            </h4>
            <ul className="space-y-1.5">
              {shopLinks.map(link => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-white/50 hover:text-purple-400 text-xs transition-colors inline-block group"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-purple-400 group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Info Links - MÁS COMPACTO */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <h4 className="text-white font-black text-xs tracking-wider mb-3 uppercase">
              Info
            </h4>
            <ul className="space-y-1.5">
              {infoLinks.map(link => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-white/50 hover:text-purple-400 text-xs transition-colors inline-block group"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-purple-400 group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links - MÁS COMPACTO */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <h4 className="text-white font-black text-xs tracking-wider mb-3 uppercase">
              Legal
            </h4>
            <ul className="space-y-1.5">
              {legalLinks.map(link => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-white/50 hover:text-purple-400 text-xs transition-colors inline-block group"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-purple-400 group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Divider más sutil */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-6" />

        {/* Bottom Section - MÁS COMPACTO */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          
          {/* Copyright */}
          <motion.div
            className="text-white/40 text-[10px] text-center md:text-left order-2 md:order-1"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            © {new Date().getFullYear()} ZORU. Todos los derechos reservados. 
            <span className="hidden sm:inline mx-2 text-purple-500/50">|</span>
            <span className="block sm:inline mt-1 sm:mt-0">
              Made with <span className="text-pink-500">♥</span> in Lima, Perú
            </span>
          </motion.div>

          {/* Payment methods badges - MÁS COMPACTO */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-2 order-1 md:order-2"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-white/30 text-[10px]">Aceptamos:</span>
            {paymentMethods.map(method => (
              <div 
                key={method}
                className="px-1.5 py-0.5 bg-white/5 border border-white/10 text-white/40 text-[9px] font-bold"
              >
                {method}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Decorative number - solo desktop */}
        <div 
          className="hidden lg:block absolute bottom-2 right-4 text-[80px] font-black text-purple-500/5 pointer-events-none select-none leading-none"
          aria-hidden="true"
        >
          999
        </div>
      </div>
    </footer>
  )
}
