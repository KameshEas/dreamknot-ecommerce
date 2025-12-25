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

export async function GET() {
  try {
    const userId = await getUserFromToken()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { user_id: userId },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    })

    return NextResponse.json({
      wishlist: wishlist.map((item: any) => ({
        id: item.id,
        product: item.product,
        added_at: item.id // Using id as timestamp for simplicity
      }))
    })
  } catch (error) {
    console.error('Get wishlist error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if already in wishlist
    const existing = await prisma.wishlist.findFirst({
      where: {
        user_id: userId,
        product_id: productId
      }
    })

    if (existing) {
      return NextResponse.json({ error: 'Product already in wishlist' }, { status: 400 })
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        user_id: userId,
        product_id: productId
      }
    })

    return NextResponse.json({
      message: 'Added to wishlist',
      wishlistItem
    })
  } catch (error) {
    console.error('Add to wishlist error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserFromToken()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    // Remove from wishlist
    await prisma.wishlist.deleteMany({
      where: {
        user_id: userId,
        product_id: productId
      }
    })

    return NextResponse.json({ message: 'Removed from wishlist' })
  } catch (error) {
    console.error('Remove from wishlist error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
