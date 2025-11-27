import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Webhook recibido:', body)

    if (body.type === 'payment') {
      const paymentId = body.data.id

      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })

      const payment = await response.json()
      console.log('✅ Pago recibido:', payment.status)

      if (payment.status === 'approved') {
        console.log('✅ Pago aprobado - ID:', payment.id)
      }
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Error webhook:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
