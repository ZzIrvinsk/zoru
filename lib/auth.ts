// lib/auth.ts
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
// import Google from 'next-auth/providers/google'  // 👈 lo dejamos comentado por ahora
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  trustHost: true,

  // Usa NEXTAUTH_SECRET (definido en Vercel y en .env.local)
  secret: process.env.NEXTAUTH_SECRET,

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
        const intent = (credentials as any)?.intent ?? 'login'

        const rawEmail = (credentials as any)?.email
        const email =
          typeof rawEmail === 'string' ? rawEmail.toLowerCase().trim() : ''

        const password = (credentials as any)?.password as
          | string
          | undefined

        if (!email || !password) return null

        // REGISTRO
        if (intent === 'register') {
          const existing = await prisma.user.findUnique({ where: { email } })
          if (existing) {
            // Este mensaje llega a res.error y tu frontend muestra "Ese correo ya está registrado."
            throw new Error('EMAIL_TAKEN')
          }

          const hash = await bcrypt.hash(password, 12)

          const user = await prisma.user.create({
            data: {
              email,
              name:
                (credentials as any)?.name ||
                email.split('@')[0],
              password: hash,
            },
          })

          return {
            id: user.id,
            name: user.name ?? '',
            email: user.email ?? '',
          }
        }

        // LOGIN NORMAL
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.password) return null

        const ok = await bcrypt.compare(password, user.password)
        if (!ok) return null

        return {
          id: user.id,
          name: user.name ?? '',
          email: user.email ?? '',
        }
      },
    }),

    // Google desactivado temporalmente para evitar errores de PKCE/InvalidCheck
    // Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
  ],

  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        // @ts-ignore agregamos id manualmente al usuario de sesión
        session.user.id = user?.id ?? token?.sub ?? ''
      }
      return session
    },
  },
})
