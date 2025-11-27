import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    
    console.log('Webhook recibido:', body)

    // Filtrar solo notificaciones de pago
    if (body.type === 'payment') {
      const paymentId = body.data.id

      // Obtener detalles del pago usando fetch
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
        }
      })

      if (response.ok) {
        const payment = await response.json()
        
        console.log('Detalles del pago:', {
          id: payment.id,
          status: payment.status,
          status_detail: payment.status_detail,
          transaction_amount: payment.transaction_amount,
          payer_email: payment.payer.email,
          external_reference: payment.external_reference
        })

        if (payment.status === 'approved') {
          console.log('✅ PAGO APROBADO:', paymentId)
          
          // TODO: Guardar en base de datos
          // TODO: Enviar email de confirmación
        }
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
