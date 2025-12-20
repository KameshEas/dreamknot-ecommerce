import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// Get reviews for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = parseInt(id)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get reviews with user info
    const reviews = await prisma.review.findMany({
      where: { product_id: productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    // Get review stats
    const stats = await prisma.review.aggregate({
      where: { product_id: productId },
      _count: { id: true },
      _avg: { rating: true }
    })

    // Get rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { product_id: productId },
      _count: { rating: true }
    })

    return NextResponse.json({
      reviews,
      stats: {
        total: stats._count.id,
        average: stats._avg.rating || 0,
        distribution: ratingDistribution.reduce((acc, curr) => {
          acc[curr.rating] = curr._count.rating
          return acc
        }, {} as Record<number, number>)
      },
      pagination: {
        page,
        limit,
        total: stats._count.id,
        pages: Math.ceil(stats._count.id / limit)
      }
    })
  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Create a new review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const { id } = await params
    const productId = parseInt(id)
    const { rating, title, comment } = await request.json()

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        user_id: decoded.userId,
        product_id: productId
      }
    })

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 })
    }

    // Check if user has purchased this product (for verified reviews)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        product_id: productId,
        order: {
          user_id: decoded.userId,
          order_status: {
            in: ['delivered', 'shipped']
          }
        }
      }
    })

    const review = await prisma.review.create({
      data: {
        user_id: decoded.userId,
        product_id: productId,
        rating,
        title,
        comment,
        is_verified: !!hasPurchased
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json({ review })
  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
