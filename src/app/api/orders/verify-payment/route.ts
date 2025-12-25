import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email'
import Razorpay from 'razorpay'
import { createHmac } from 'crypto'

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

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shipping_address,
      billing_address
    } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Payment verification data missing' }, { status: 400 })
    }

    if (!shipping_address || !billing_address) {
      return NextResponse.json({ error: 'Shipping and billing addresses required' }, { status: 400 })
    }

    // Verify payment signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex')

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // Get order details from RazorPay
    const payment = await razorpay.payments.fetch(razorpay_payment_id)
    if (payment.status !== 'captured') {
      return NextResponse.json({ error: 'Payment not captured' }, { status: 400 })
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

    // Calculate total
    const total_amount = cart.cart_items.reduce((sum, item) => sum + (item.product.base_price * item.qty), 0)

    // Create order
    const order = await prisma.order.create({
      data: {
        user_id: userId,
        total_amount,
        shipping_address: JSON.stringify(shipping_address),
        billing_address: JSON.stringify(billing_address),
        payment_status: 'paid',
        order_status: 'processing',
        razorpay_order_id,
        razorpay_payment_id
      }
    })

    // Create order items
    await prisma.orderItem.createMany({
      data: cart.cart_items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        customization_json: item.customization,
        qty: item.qty,
        price: item.product.base_price
      }))
    })

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cart_id: cart.id }
    })

    // Get user info for emails
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true }
    })

    // Send emails asynchronously (don't block order creation)
    if (user) {
      const emailData = {
        orderId: order.id,
        customerName: user.name,
        customerEmail: user.email,
        totalAmount: order.total_amount,
        shippingAddress: shipping_address,
        billingAddress: billing_address,
        items: cart.cart_items.map(item => ({
          product: item.product,
          customization_json: item.customization,
          qty: item.qty,
          price: item.product.base_price
        }))
      }

      // Send emails in background
      sendOrderConfirmationEmail(emailData).catch(err =>
        console.error('Failed to send order confirmation email:', err)
      )

      sendAdminOrderNotification(emailData).catch(err =>
        console.error('Failed to send admin notification email:', err)
      )
    }

    return NextResponse.json({
      message: 'Order placed successfully',
      order: {
        id: order.id,
        total_amount: order.total_amount,
        order_status: order.order_status
      }
    })
  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
