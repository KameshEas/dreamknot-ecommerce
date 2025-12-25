import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
})

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

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's cart
    const cart = await prisma.cart.findFirst({
      where: { user_id: userId },
      include: {
        cart_items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!cart || cart.cart_items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Calculate total (convert to paise for RazorPay - INR)
    const total_amount = cart.cart_items.reduce((sum, item) => sum + (item.product.base_price * item.qty), 0)
    const amount_in_paise = Math.round(total_amount * 100) // RazorPay expects amount in paise

    // Create RazorPay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount_in_paise,
      currency: 'INR',
      receipt: `order_${Date.now()}_${userId}`
    })

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    })
  } catch (error) {
    console.error('Create payment order error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
