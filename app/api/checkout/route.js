import { NextResponse } from 'next/server'
import mercadopago from 'mercadopago'

// Configurar Mercado Pago
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
})

export async function POST(request) {
  try {
    const { items, customerEmail } = await request.json()

    // Validar que haya items
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No hay productos en el carrito' },
        { status: 400 }
      )
    }

    // Crear preferencia de pago
    const preference = {
      items: items.map(item => ({
        id: item.product.id,
        title: item.product.title,
        description: item.product.description || '',
        picture_url: item.product.image,
        category_id: 'fashion',
        quantity: item.qty,
        unit_price: Number(item.product.price),
        currency_id: 'PEN' // Soles peruanos
      })),
      
      payer: {
        email: customerEmail || 'customer@zoru.pe',
      },

      back_urls: {
        success: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_URL}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_URL}/checkout/pending`
      },
      
      auto_return: 'approved',
      
      payment_methods: {
        installments: 1, // Sin cuotas
        excluded_payment_types: [
          // { id: 'ticket' } // Descomentar para deshabilitar efectivo
        ]
      },

      notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhook/mercadopago`,

      statement_descriptor: 'ZORU', // Aparece en el estado de cuenta
      
      external_reference: `ZORU-${Date.now()}`, // Tu referencia interna
      
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
    }

    const response = await mercadopago.preferences.create(preference)

    return NextResponse.json({
      id: response.body.id,
      init_point: response.body.init_point, // URL de pago
      sandbox_init_point: response.body.sandbox_init_point
    })

  } catch (error) {
    console.error('Error en checkout:', error)
    return NextResponse.json(
      { error: 'Error al crear preferencia de pago', details: error.message },
      { status: 500 }
    )
  }
}
