import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email'

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

    const { shipping_address, billing_address } = await request.json()

    if (!shipping_address || !billing_address) {
      return NextResponse.json({ error: 'Shipping and billing addresses required' }, { status: 400 })
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
    const total_amount = cart.cart_items.reduce((sum: number, item: { product: { base_price: number }, qty: number }) => sum + (item.product.base_price * item.qty), 0)

    // Create order
    const order = await prisma.order.create({
      data: {
        user_id: userId,
        total_amount,
        shipping_address: JSON.stringify(shipping_address),
        billing_address: JSON.stringify(billing_address),
        payment_status: 'paid', // Simulated for now
        order_status: 'processing'
      }
    })

    // Create order items
    await prisma.orderItem.createMany({
      data: cart.cart_items.map((item: { product_id: number, customization: string | null, qty: number, product: { base_price: number } }) => ({
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
        items: cart.cart_items.map((item: { product: { base_price: number, title: string, images: string[] }, customization: string | null, qty: number }) => ({
          product: {
            title: item.product.title,
            images: item.product.images
          },
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
    console.error('Create order error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
