import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    
    console.log('Webhook recibido:', body)

    // Filtrar solo notificaciones de pago
    if (body.type === 'payment') {
      const paymentId = body.data.id

      // Obtener detalles del pago usando fetch directo
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })

      const payment = await response.json()

      console.log('Estado del pago:', payment.status)
      console.log('ID de pago:', payment.id)
      console.log('Monto:', payment.transaction_amount)

      // Aquí puedes actualizar tu base de datos según el estado
      if (payment.status === 'approved') {
        // TODO: Actualizar orden en tu base de datos
        console.log('✅ Pago aprobado')
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
