'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'

export default function PerfilPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()
  const [memberSince, setMemberSince] = useState('')

  // Proteger ruta: si no está logueado, mandar a login
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/perfil')
    }
  }, [status, router])

  // Cargar fecha de registro del usuario
  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/user/info')
        .then((res) => res.json())
        .then((data) => {
          if (data.createdAt) {
            const date = new Date(data.createdAt)
            setMemberSince(
              date.toLocaleDateString('es-PE', {
                year: 'numeric',
                month: 'long',
              })
            )
          }
        })
        .catch(() => {
          // Si falla, dejamos vacío
        })
    }
  }, [session?.user?.email])

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs sm:text-sm text-white/60 font-mono tracking-[0.2em]">
            CARGANDO PERFIL...
          </p>
        </div>
      </div>
    )
  }

  // Si aún no hay sesión (mientras redirige), no renderes nada
  if (!session?.user) return null

  const user = session.user

  return (
    <div className="bg-black min-h-[calc(100vh-4rem)] text-white overflow-x-hidden px-4 py-24 md:py-28">
      {/* Fondo grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#8B5CF6 1px, transparent 1px), linear-gradient(90deg, #8B5CF6 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Glows suaves */}
      {!prefersReducedMotion && (
        <>
          <div className="fixed top-0 left-1/4 w-64 md:w-80 h-64 md:h-80 bg-purple-600/25 rounded-full blur-3xl" />
          <div className="fixed bottom-0 right-1/4 w-64 md:w-80 h-64 md:h-80 bg-pink-600/25 rounded-full blur-3xl" />
        </>
      )}

      {/* Contenido */}
      <div className="relative z-10 container mx-auto max-w-5xl">
        {/* Breadcrumbs */}
        <motion.div
          className="flex items-center gap-2 text-[10px] sm:text-xs text-white/40 font-mono tracking-[0.15em] mb-4"
          initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/" className="hover:text-purple-400 transition-colors">
            INICIO
          </Link>
          <span>/</span>
          <span className="text-white/60">PERFIL</span>
        </motion.div>

        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-3 px-5 py-2 bg-purple-600/20 border-2 border-purple-500/60 text-purple-300 text-[10px] sm:text-xs font-black tracking-[0.3em] mb-6"
          initial={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          ZORU PROFILE
        </motion.div>

        {/* Header perfil */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-10 mb-10 md:mb-14"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-purple-600/40 to-pink-500/40 flex items-center justify-center border border-purple-500/60 overflow-hidden">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name || 'Avatar'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl md:text-3xl font-black text-white/80">
                  {user.name?.charAt(0)?.toUpperCase() || 'Z'}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
                {user.name || 'MI PERFIL'}
              </h1>
              <p className="text-xs sm:text-sm text-white/60 font-mono mt-2">
                {user.email}
              </p>
              {memberSince && (
                <p className="text-[10px] sm:text-xs text-white/40 font-mono mt-1">
                  MIEMBRO DESDE {memberSince.toUpperCase()}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <span className="text-[10px] sm:text-xs text-white/50 font-mono tracking-[0.25em]">
              ESTADO
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-600/20 border border-emerald-500/60 text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ACTIVO
            </span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-3 md:gap-4 mb-10 md:mb-14"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {[
            { label: 'ORDENES', value: '0', hint: 'Pronto verás tus compras' },
            { label: 'RAFFLES', value: '0', hint: 'Entradas próximas' },
            { label: 'ROL', value: 'USER', hint: 'Rol estándar' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-zinc-950/90 border border-white/10 p-3 md:p-4 hover:border-purple-500/30 transition-colors"
            >
              <div className="text-2xl md:text-3xl font-black">
                {stat.value}
              </div>
              <div className="text-[9px] md:text-xs text-white/40 tracking-[0.25em] mt-1">
                {stat.label}
              </div>
              <div className="text-[10px] md:text-xs text-white/30 mt-2">
                {stat.hint}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Sección: datos de cuenta */}
        <motion.section
          className="bg-zinc-950/90 border border-white/10 p-5 md:p-6 mb-6 md:mb-8 hover:border-purple-500/20 transition-colors"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-lg md:text-xl font-black">DATOS DE CUENTA</h2>
            {/* <button className="text-[10px] md:text-xs text-purple-400 hover:text-purple-300 font-mono tracking-[0.2em] transition-colors">
              EDITAR →
            </button> */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
            <div>
              <div className="text-[10px] md:text-xs text-white/40 font-mono tracking-[0.2em] mb-1">
                NOMBRE
              </div>
              <div className="text-white">
                {user.name || 'Sin nombre configurado'}
              </div>
            </div>
            <div>
              <div className="text-[10px] md:text-xs text-white/40 font-mono tracking-[0.2em] mb-1">
                EMAIL
              </div>
              <div className="text-white break-all">
                {user.email || 'Sin email'}
              </div>
            </div>
          </div>
          <p className="mt-4 text-[11px] md:text-xs text-white/40 font-mono">
            Más adelante podrás editar estos datos y ver tu historial de compras directamente desde aquí.
          </p>
        </motion.section>

        {/* Sección: seguridad */}
        <motion.section
          className="bg-zinc-950/90 border border-white/10 p-5 md:p-6 mb-6 md:mb-8 hover:border-purple-500/20 transition-colors"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
        >
          <h2 className="text-lg md:text-xl font-black mb-3 md:mb-4">
            SEGURIDAD
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-sm md:text-base text-white/80">
                Contraseña
              </div>
              <div className="text-[10px] md:text-xs text-white/40 mt-1">
                Última actualización: hace poco
              </div>
            </div>
            <button
              disabled
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-xs md:text-sm font-mono tracking-[0.15em] uppercase text-white/40 cursor-not-allowed"
            >
              CAMBIAR CONTRASEÑA
            </button>
          </div>
          <p className="mt-4 text-[11px] md:text-xs text-white/40 font-mono">
            Pronto podrás actualizar tu contraseña y gestionar opciones de seguridad adicionales.
          </p>
        </motion.section>

        {/* Sección: actividad reciente */}
        <motion.section
          className="bg-zinc-950/90 border border-white/10 p-5 md:p-6 mb-6 md:mb-8 hover:border-purple-500/20 transition-colors"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-lg md:text-xl font-black mb-3 md:mb-4">
            ACTIVIDAD RECIENTE
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-xs md:text-sm">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5" />
              <div className="flex-1">
                <div className="text-white/70">Iniciaste sesión</div>
                <div className="text-white/40 text-[10px] md:text-xs mt-0.5">
                  Hace unos momentos
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 text-xs md:text-sm opacity-50">
              <div className="w-2 h-2 rounded-full bg-white/20 mt-1.5" />
              <div className="flex-1">
                <div className="text-white/50">
                  Próximas acciones aparecerán aquí
                </div>
                <div className="text-white/30 text-[10px] md:text-xs mt-0.5">
                  Compras, raffles, etc.
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Sección: accesos rápidos */}
        <motion.section
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
        >
          <div className="bg-zinc-950/90 border border-white/10 p-5 md:p-6 flex flex-col gap-3 hover:border-purple-500/30 transition-colors group">
            <h3 className="text-base md:text-lg font-black">
              PEDIDOS Y DROPS
            </h3>
            <p className="text-xs md:text-sm text-white/60">
              Aquí verás tus órdenes confirmadas, estados de envío y acceso rápido
              a los productos que ya compraste.
            </p>
            <Link href="/tienda">
              <button className="mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-xs md:text-sm font-black tracking-[0.15em] uppercase transition-all group-hover:gap-3">
                IR A LA TIENDA →
              </button>
            </Link>
          </div>

          <div className="bg-zinc-950/90 border border-white/10 p-5 md:p-6 flex flex-col gap-3 hover:border-purple-500/30 transition-colors group">
            <h3 className="text-base md:text-lg font-black">
              RAFFLES Y ACCESO EARLY
            </h3>
            <p className="text-xs md:text-sm text-white/60">
              Muy pronto podrás ver aquí en qué raffles estás participando y si
              ganaste acceso anticipado a un drop.
            </p>
            <Link href="/raffle">
              <button className="mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-500/60 text-xs md:text-sm font-black tracking-[0.15em] uppercase hover:bg-purple-600/10 transition-all group-hover:gap-3">
                VER RAFFLES →
              </button>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
