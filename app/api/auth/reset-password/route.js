import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const { token, password } = await request.json()

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { message: 'Token inválido.' },
        { status: 400 }
      )
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { message: 'La contraseña debe tener al menos 8 caracteres.' },
        { status: 400 }
      )
    }

    // Buscar el token en la tabla
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token,
      },
    })

    if (!resetToken) {
      return NextResponse.json(
        { message: 'El enlace para restablecer la contraseña no es válido.' },
        { status: 400 }
      )
    }

    // Verificar expiración
    if (resetToken.expires < new Date()) {
      // borrar token expirado
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      })

      return NextResponse.json(
        { message: 'El enlace para restablecer la contraseña ha expirado.' },
        { status: 400 }
      )
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
    })

    if (!user) {
      // limpiar token huérfano
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      })

      return NextResponse.json(
        { message: 'No se encontró el usuario asociado a este enlace.' },
        { status: 400 }
      )
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10) // saltRounds = 10 [web:79][web:149]

    // Actualizar user.password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    })

    // Borrar el token para que no pueda reutilizarse
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    })

    return NextResponse.json(
      { message: 'Tu contraseña fue actualizada correctamente.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in reset-password API:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
