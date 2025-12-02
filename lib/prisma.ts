// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Evita múltiples instancias en desarrollo (hot reload)
export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    log: ['warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
