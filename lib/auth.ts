// lib/auth.ts
// lib/auth.ts
export {}

import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  trustHost: true,
  secret: process.env.AUTH_SECRET,

  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        intent: { label: 'intent', type: 'text' }, // 'login' | 'register'
        name: { label: 'name', type: 'text' },
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },
      authorize: async (credentials) => {
        const intent = credentials?.intent ?? 'login'
        const email = credentials?.email?.toLowerCase().trim()
        const password = credentials?.password
        if (!email || !password) return null

        if (intent === 'register') {
          // 1) Ver si ya existe
          const existing = await prisma.user.findUnique({
            where: { email },
          })
          if (existing) {
            // Se puede mapear este error en el cliente
            throw new Error('EMAIL_TAKEN')
          }

          // 2) Hashear contraseña y crear usuario
          const hash = await bcrypt.hash(password, 12)
          const user = await prisma.user.create({
            data: {
              email,
              name: credentials?.name || email.split('@')[0],
              password: hash,
            },
          })

          return { id: user.id, name: user.name ?? '', email: user.email ?? '' }
        }

        // LOGIN NORMAL
        const user = await prisma.user.findUnique({
          where: { email },
        })
        if (!user || !user.password) return null

        const ok = await bcrypt.compare(password, user.password)
        if (!ok) return null

        return { id: user.id, name: user.name ?? '', email: user.email ?? '' }
      },
    }),
    // Futuro: aquí puedes agregar Google/GitHub sin tocar nada más
  ],

  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        // @ts-expect-error extendemos a mano
        session.user.id = user.id
      }
      return session
    },
  },
})
