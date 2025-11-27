import { NextResponse } from 'next/server'
import mercadopago from 'mercadopago'

export async function POST(request) {
  try {
    // Configurar Mercado Pago
    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
    })

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
        currency_id: 'PEN'
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
        installments: 1
      },

      notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhook/mercadopago`,
      statement_descriptor: 'ZORU',
      external_reference: `ZORU-${Date.now()}`,
      
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    }

    const response = await mercadopago.preferences.create(preference)

    return NextResponse.json({
      id: response.body.id,
      init_point: response.body.init_point,
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
