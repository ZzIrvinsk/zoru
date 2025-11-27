import { NextResponse } from 'next/server'
import mercadopago from 'mercadopago'

export async function POST(request) {
  try {
    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
    })

    const body = await request.json()
    
    console.log('Webhook recibido:', body)

    if (body.type === 'payment') {
      const paymentId = body.data.id
      const payment = await mercadopago.payment.get(paymentId)
      
      console.log('Detalles del pago:', {
        id: payment.body.id,
        status: payment.body.status,
        transaction_amount: payment.body.transaction_amount,
        payer_email: payment.body.payer.email
      })

      if (payment.body.status === 'approved') {
        console.log('✅ PAGO APROBADO:', paymentId)
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
