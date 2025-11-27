import { NextResponse } from 'next/server'
// ✅ Cambio: usar require en vez de import
import mercadopago from 'mercadopago'

export async function POST(request) {
  try {
    // ✅ Cambio: mover la configuración DENTRO de la función
    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN || ''
    })

    const body = await request.json()
    
    console.log('Webhook recibido:', body)

    // Filtrar solo notificaciones de pago
    if (body.type === 'payment') {
      const paymentId = body.data.id

      // Obtener detalles del pago
      const payment = await mercadopago.payment.get(paymentId)
      
      console.log('Detalles del pago:', {
        id: payment.body.id,
        status: payment.body.status,
        status_detail: payment.body.status_detail,
        transaction_amount: payment.body.transaction_amount,
        payer_email: payment.body.payer.email,
        external_reference: payment.body.external_reference
      })

      // Si el pago fue aprobado
      if (payment.body.status === 'approved') {
        
        // AQUÍ GUARDARÍAS EL PEDIDO EN TU BASE DE DATOS
        // Por ahora solo lo logueamos
        console.log('✅ PAGO APROBADO:', paymentId)
        
        // TODO: Guardar en base de datos
        // await saveOrder({
        //   paymentId: payment.body.id,
        //   amount: payment.body.transaction_amount,
        //   email: payment.body.payer.email,
        //   reference: payment.body.external_reference,
        //   items: ... // extraer de metadata
        // })

        // TODO: Enviar email de confirmación
        // await sendConfirmationEmail(payment.body.payer.email, ...)
      }
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Error en webhook:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
