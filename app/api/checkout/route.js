import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    console.log('🔑 Token exists:', !!process.env.MERCADOPAGO_ACCESS_TOKEN)
    console.log('🌐 URL:', process.env.NEXT_PUBLIC_URL)

    const { items, customerEmail } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No hay productos en el carrito' },
        { status: 400 }
      )
    }

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

    console.log('📦 Preference:', JSON.stringify(preference, null, 2))

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
      },
      body: JSON.stringify(preference)
    })

    console.log('📡 MP Response status:', response.status)

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ MP Error:', error)
      return NextResponse.json(
        { error: 'Error de Mercado Pago', details: error },
        { status: 500 }
      )
    }

    const data = await response.json()
    console.log('✅ MP Success:', data)

    return NextResponse.json({
      id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point
    })

  } catch (error) {
    console.error('❌ Error general:', error)
    return NextResponse.json(
      { 
        error: 'Error al crear preferencia de pago',
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    )
  }
}
