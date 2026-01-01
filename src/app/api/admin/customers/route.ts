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
    const role = searchParams.get('role') || 'all'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } }
      ]
    }

    if (role !== 'all') {
      where.role = role
    }

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          email_notifications: true,
          sms_notifications: true,
          created_at: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
              addresses: true
            }
          },
          orders: {
            select: {
              total_amount: true,
              created_at: true
            },
            orderBy: { created_at: 'desc' },
            take: 1
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit
      }) as any,
      prisma.user.count({ where })
    ])

    // Calculate total spent and last order date for each customer
    const customersWithStats = customers.map((customer: any) => {
      const totalSpent = customer.orders.reduce((sum: number, order: any) => sum + order.total_amount, 0)
      const lastOrderDate = customer.orders.length > 0 ? customer.orders[0].created_at : null

      return {
        ...customer,
        total_spent: totalSpent,
        last_order_date: lastOrderDate,
        order_count: customer._count.orders,
        review_count: customer._count.reviews,
        address_count: customer._count.addresses
      }
    })

    return NextResponse.json({
      customers: customersWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)

    if (authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can modify user roles' }, { status: 403 })
    }

    const { userId, role } = await request.json()

    if (!userId || !role) {
      return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 })
    }

    if (!['customer', 'staff', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    return handleApiError(error)
  }
}
