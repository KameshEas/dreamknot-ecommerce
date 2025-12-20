import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

async function getUserFromToken(request: NextRequest) {
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
    const userId = await getUserFromToken(request)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    if (!cart) {
      return NextResponse.json({
        id: null,
        items: [],
        total: 0
      })
    }

    const total = cart.cart_items.reduce((sum, item) => sum + (item.product.base_price * item.qty), 0)

    return NextResponse.json({
      id: cart.id,
      items: cart.cart_items.map(item => ({
        id: item.id,
        product: item.product,
        customization: item.customization,
        qty: item.qty,
        price: item.product.base_price * item.qty
      })),
      total
    })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, customization, qty = 1 } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    // Find or create cart
    let cart = await prisma.cart.findFirst({
      where: { user_id: userId }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { user_id: userId }
      })
    }

    // Check if item already exists
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart.id,
        product_id: productId,
        customization: customization ? JSON.stringify(customization) : null
      }
    })

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { qty: existingItem.qty + qty }
      })
    } else {
      // Create new item
      await prisma.cartItem.create({
        data: {
          cart_id: cart.id,
          product_id: productId,
          customization: customization ? JSON.stringify(customization) : null,
          qty
        }
      })
    }

    return NextResponse.json({ message: 'Item added to cart' })
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
