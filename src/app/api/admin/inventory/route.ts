import { NextRequest, NextResponse } from 'next/server'
import { handleApiError } from '@/lib/errors'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Check if user is admin or staff
function isAdminOrStaff(user: any): boolean {
  return user.role === 'admin' || user.role === 'staff'
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)

    if (!isAdminOrStaff(authUser)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const stockStatus = searchParams.get('stock_status') || 'all' // all, in_stock, low_stock, out_of_stock

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.category_id = parseInt(category)
    }

    if (stockStatus !== 'all') {
      switch (stockStatus) {
        case 'in_stock':
          where.stock_quantity = { gt: 0 }
          break
        case 'low_stock':
          where.stock_quantity = { lte: 5, gt: 0 }
          break
        case 'out_of_stock':
          where.stock_quantity = 0
          break
      }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true }
          },
          _count: {
            select: {
              order_items: true,
              reviews: true
            }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit
      }) as any,
      prisma.product.count({ where })
    ])

    // Calculate additional stats
    const productsWithStats = products.map((product: any) => ({
      ...product,
      total_sold: product._count.order_items,
      review_count: product._count.reviews,
      stock_status: product.stock_quantity === 0 ? 'out_of_stock' :
                   product.stock_quantity <= product.low_stock_threshold ? 'low_stock' : 'in_stock'
    }))

    // Get low stock alerts
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock_quantity: { lte: 5, gt: 0 }
      } as any,
      select: {
        id: true,
        title: true,
        stock_quantity: true,
        low_stock_threshold: true
      }
    }) as any

    return NextResponse.json({
      products: productsWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      alerts: {
        low_stock_count: lowStockProducts.length,
        low_stock_products: lowStockProducts
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)

    if (!isAdminOrStaff(authUser)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { productId, updates } = await request.json()

    if (!productId || !updates) {
      return NextResponse.json({ error: 'Product ID and updates are required' }, { status: 400 })
    }

    const allowedUpdates = ['stock_quantity', 'is_available', 'sku', 'weight', 'dimensions']
    const updateData: any = {}

    for (const [key, value] of Object.entries(updates)) {
      if (allowedUpdates.includes(key)) {
        updateData[key] = value
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 })
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(productId) },
      data: updateData,
      include: {
        category: {
          select: { id: true, name: true }
        }
      }
    })

    return NextResponse.json({ product: updatedProduct })
  } catch (error) {
    return handleApiError(error)
  }
}
