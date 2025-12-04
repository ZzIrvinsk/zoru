import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPasswordResetEmail({ to, token }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const resetLink = `${appUrl}/reset-password/${token}`

  const { error } = await resend.emails.send({
    from: 'ZORU <no-reply@resend.dev>', // luego lo cambias a tu dominio verificado
    to,
    subject: 'Restablece tu contraseña de ZORU',
    html: `
      <div style="background-color:#050509;padding:32px;font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;color:#ffffff;">
        <div style="max-width:480px;margin:0 auto;border:1px solid #7c3aed33;border-radius:24px;padding:24px 24px 28px;background:radial-gradient(circle at top,#1f2937,#020617);">
          <p style="font-size:11px;letter-spacing:0.25em;color:#a855f7;text-transform:uppercase;margin:0 0 16px;">SECURITY • ZORU</p>
          <h1 style="font-size:24px;line-height:1.2;margin:0 0 12px;">Restablecer contraseña</h1>
          <p style="font-size:14px;color:#d1d5db;margin:0 0 20px;">
            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta ZORU.
          </p>
          <p style="font-size:14px;color:#e5e7eb;margin:0 0 20px;">
            Haz clic en el siguiente botón para crear una nueva contraseña. Este enlace es válido por 1 hora y solo puede usarse una vez.
          </p>
          <div style="text-align:center;margin-bottom:24px;">
            <a href="${resetLink}" style="display:inline-block;padding:12px 24px;border-radius:9999px;background:#8b5cf6;color:#ffffff;font-size:12px;letter-spacing:0.25em;text-transform:uppercase;text-decoration:none;font-weight:700;">
              RESTABLECER CONTRASEÑA
            </a>
          </div>
          <p style="font-size:12px;color:#9ca3af;margin:0 0 8px;">
            Si el botón no funciona, copia y pega este enlace en tu navegador:
          </p>
          <p style="font-size:11px;color:#6b7280;word-break:break-all;margin:0 0 16px;">
            ${resetLink}
          </p>
          <p style="font-size:11px;color:#4b5563;margin:0;">
            Si no fuiste tú quien solicitó este cambio, puedes ignorar este correo. Tu contraseña actual seguirá siendo válida.
          </p>
        </div>
      </div>
    `,
  })

  if (error) {
    console.error('Error sending reset email:', error)
    throw new Error('No se pudo enviar el correo de recuperación.')
  }
}
