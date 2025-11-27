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
        id: String(item.product.id),
        title: item.product.title,
        description: item.product.description || 'Producto ZORU',
        picture_url: item.product.image,
        category_id: 'fashion',
        quantity: Number(item.qty),
        unit_price: Number(item.product.price),
        currency_id: 'PEN'
      })),
      
      payer: {
        email: customerEmail || 'customer@zoru.pe'
      },

      back_urls: {
        success: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_URL}/cart`,
        pending: `${process.env.NEXT_PUBLIC_URL}/cart`
      },
      
      auto_return: 'approved',
      
      statement_descriptor: 'ZORU',
      external_reference: `ZORU-${Date.now()}`
    }

    const response = await mercadopago.preferences.create(preference)

    return NextResponse.json({
      id: response.body.id,
      init_point: response.body.init_point,
      sandbox_init_point: response.body.sandbox_init_point
    })

  } catch (error) {
    console.error('❌ Error en checkout:', error)
    return NextResponse.json(
      { 
        error: 'Error al crear preferencia de pago', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}
