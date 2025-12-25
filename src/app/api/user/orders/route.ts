import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

async function getUserFromToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    return decoded.userId
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { user_id: userId },
      include: {
        order_items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })

    const formattedOrders = orders.map(order => ({
      id: order.id,
      total_amount: order.total_amount,
      order_status: order.order_status,
      payment_status: order.payment_status,
      shipping_address: JSON.parse(order.shipping_address),
      billing_address: JSON.parse(order.billing_address),
      created_at: order.created_at,
      items: order.order_items.map(item => ({
        id: item.id,
        product: item.product,
        customization: item.customization_json,
        qty: item.qty,
        price: item.price
      }))
    }))

    return NextResponse.json({ orders: formattedOrders })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
