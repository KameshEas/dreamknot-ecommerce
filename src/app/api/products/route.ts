import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const categoryId = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Build where clause
    const where: any = {}

    // Search functionality
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Category filter
    if (categoryId) {
      where.category_id = parseInt(categoryId)
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.base_price = {}
      if (minPrice) where.base_price.gte = parseFloat(minPrice)
      if (maxPrice) where.base_price.lte = parseFloat(maxPrice)
    }

    // Build orderBy clause
    let orderBy: any = { created_at: 'desc' }

    switch (sortBy) {
      case 'price-low':
        orderBy = { base_price: 'asc' }
        break
      case 'price-high':
        orderBy = { base_price: 'desc' }
        break
      case 'name':
        orderBy = { title: 'asc' }
        break
      case 'newest':
      default:
        orderBy = { created_at: 'desc' }
        break
    }

    // Get total count for pagination
    const total = await prisma.product.count({ where })

    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        customizations: true
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    })

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
