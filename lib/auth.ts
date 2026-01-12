// lib/auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        intent: { label: "intent", type: "text" },
        name: { label: "name", type: "text" },
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = (credentials?.email as string)?.toLowerCase().trim()
        const password = credentials?.password as string
        const intent = credentials?.intent as string

        if (!email || !password) return null

        if (intent === "register") {
          const existing = await prisma.user.findUnique({ where: { email } })
          if (existing) return null

          const hash = await bcrypt.hash(password, 12)
          const user = await prisma.user.create({
            data: {
              email,
              name: (credentials?.name as string) || email.split("@")[0],
              password: hash,
            },
          })

          return { id: user.id, name: user.name, email: user.email }
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user?.password) return null

        const ok = await bcrypt.compare(password, user.password)
        if (!ok) return null

        return { id: user.id, name: user.name, email: user.email }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }: any) {
      if (session.user) session.user.id = token.id
      return session
    },
  },
})
