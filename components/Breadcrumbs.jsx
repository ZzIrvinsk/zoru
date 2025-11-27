'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Breadcrumbs(){
  const path = usePathname() || '/'
  const parts = path.split('/').filter(Boolean)
  return (
    <nav className="text-sm text-gray-500 mb-4" aria-label="breadcrumbs">
      <ol className="flex items-center gap-2">
        <li><Link href="/">Inicio</Link></li>
        {parts.map((p, i) => {
          const to = '/' + parts.slice(0,i+1).join('/')
          const label = decodeURIComponent(p)
          return (
            <li key={to} className="flex items-center gap-2">
              <span>/</span>
              <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href={to}>{label}</Link>
              </motion.span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
