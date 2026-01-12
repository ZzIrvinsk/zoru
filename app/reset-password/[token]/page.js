'use client'

import { useState, useTransition } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { token } = useParams()
  const prefersReducedMotion = useReducedMotion()
  const [isPending, startTransition] = useTransition()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            password,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.message || 'No se pudo restablecer la contraseña.')
          return
        }

        setSuccess(
          data.message || 'Tu contraseña fue actualizada correctamente.'
        )

        // Opcional: redirigir al login después de unos segundos
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } catch (err) {
        console.error(err)
        setError('Ocurrió un error. Intenta nuevamente.')
      }
    })
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black text-white flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Grid retro */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#8B5CF6 1px, transparent 1px), linear-gradient(90deg, #8B5CF6 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Glows solo desktop */}
      {!prefersReducedMotion && (
        <>
          <div className="hidden md:block absolute top-1/4 left-1/4 w-64 md:w-80 h-64 md:h-80 bg-purple-600/25 rounded-full blur-3xl" />
          <div className="hidden md:block absolute bottom-1/4 right-1/4 w-64 md:w-80 h-64 md:h-80 bg-pink-600/25 rounded-full blur-3xl" />
        </>
      )}

      {/* Esquinas decorativas */}
      <div className="absolute top-4 md:top-8 left-4 md:left-8 w-14 md:w-24 h-14 md:h-24 border-l-2 md:border-l-4 border-t-2 md:border-t-4 border-purple-500/30" />
      <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 w-14 md:w-24 h-14 md:h-24 border-r-2 md:border-r-4 border-b-2 md:border-b-4 border-pink-500/30" />

      {/* Número decorativo */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[180px] sm:text-[220px] md:text-[260px] font-black text-purple-500/5 pointer-events-none select-none leading-none"
        aria-hidden="true"
      >
        111
      </div>

      {/* Card principal */}
      <motion.div
        className="relative w-full max-w-md bg-zinc-950/90 border border-purple-500/40 rounded-3xl p-6 xs:p-7 sm:p-8 shadow-[0_0_60px_rgba(139,92,246,0.35)] backdrop-blur-xl"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 30, scale: 0.96 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-3 px-5 py-2 bg-purple-600/20 border-2 border-purple-500/60 text-purple-300 text-[10px] sm:text-xs font-black tracking-[0.3em] mb-5"
          initial={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="w-2.5 h-2.5 bg-purple-400 rounded-full"
            animate={
              prefersReducedMotion
                ? {}
                : { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }
            }
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          RESET • ZORU
        </motion.div>

        {/* Título */}
        <div className="mb-4">
          <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight">
            <span className="block text-white">NUEVA</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 -mt-1">
              CONTRASEÑA
            </span>
          </h1>
        </div>

        <p className="text-xs sm:text-sm text-white/60 font-mono mb-6">
          Define una nueva contraseña segura para tu cuenta ZORU. Este enlace es temporal y solo funciona una vez.
        </p>

        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 rounded-lg border border-red-500/80 bg-red-950/40 px-3 py-2 text-xs sm:text-sm text-red-200 font-mono"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 rounded-lg border border-emerald-500/80 bg-emerald-950/40 px-3 py-2 text-xs sm:text-sm text-emerald-200 font-mono"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] sm:text-xs font-mono tracking-[0.25em] text-white/60 uppercase">
              NUEVA CONTRASEÑA
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-zinc-950 border border-white/15 px-3.5 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/70 transition-colors placeholder:text-zinc-500 font-mono"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] sm:text-xs font-mono tracking-[0.25em] text-white/60 uppercase">
              CONFIRMAR CONTRASEÑA
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl bg-zinc-950 border border-white/15 px-3.5 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/70 transition-colors placeholder:text-zinc-500 font-mono"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 inline-flex items-center justify-center rounded-xl bg-purple-600 px-4 py-3 text-[11px] sm:text-xs md:text-sm font-black tracking-[0.25em] hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors uppercase"
          >
            {isPending ? 'ACTUALIZANDO...' : 'CAMBIAR CONTRASEÑA'}
          </button>
        </form>

        {/* Volver al login */}
        <p className="mt-6 text-center text-[11px] sm:text-xs text-zinc-400 font-mono">
          ¿Recordaste tu contraseña?{' '}
          <Link
            href="/login"
            className="text-purple-400 hover:text-purple-300 underline underline-offset-4 font-bold"
          >
            VOLVER A INICIAR SESIÓN
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
