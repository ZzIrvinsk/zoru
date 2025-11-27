import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { items, customerEmail } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No hay productos en el carrito' },
        { status: 400 }
      )
    }

    // Crear preferencia usando API REST directa
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

    // Llamar a la API de Mercado Pago directamente
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
      },
      body: JSON.stringify(preference)
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Error de MP:', error)
      throw new Error(`Mercado Pago error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point
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
