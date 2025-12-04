import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'Email inválido' },
        { status: 400 }
      )
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Siempre respondemos igual aunque no exista el usuario (seguridad)
    if (!user) {
      return NextResponse.json(
        {
          message:
            'Si el correo existe en ZORU, te enviaremos un enlace para restablecer tu contraseña.',
        },
        { status: 200 }
      )
    }

    // Borrar tokens anteriores de ese email (opcional pero limpio)
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    })

    // Generar token random un poco más corto y expiración (1 hora)
    const token = crypto.randomBytes(16).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    })

    // Enviar email real con Resend
    await sendPasswordResetEmail({ to: email, token })

    return NextResponse.json(
      {
        message:
          'Si el correo existe en ZORU, te enviaremos un enlace para restablecer tu contraseña.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in forgot-password API:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
