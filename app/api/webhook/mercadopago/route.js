import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    
    console.log('Webhook recibido:', body)

    // Filtrar solo notificaciones de pago
    if (body.type === 'payment') {
      const paymentId = body.data.id

      // ✅ Obtener detalles del pago con FETCH (sin SDK)
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })

      const payment = await response.json()
      
      console.log('Detalles del pago:', {
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        transaction_amount: payment.transaction_amount,
        payer_email: payment.payer.email,
        external_reference: payment.external_reference
      })

      // Si el pago fue aprobado
      if (payment.status === 'approved') {
        
        // AQUÍ GUARDARÍAS EL PEDIDO EN TU BASE DE DATOS
        // Por ahora solo lo logueamos
        console.log('✅ PAGO APROBADO:', paymentId)
        
        // TODO: Guardar en base de datos
        // await saveOrder({
        //   paymentId: payment.id,
        //   amount: payment.transaction_amount,
        //   email: payment.payer.email,
        //   reference: payment.external_reference,
        //   items: ... // extraer de metadata
        // })

        // TODO: Enviar email de confirmación
        // await sendConfirmationEmail(payment.payer.email, ...)
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
