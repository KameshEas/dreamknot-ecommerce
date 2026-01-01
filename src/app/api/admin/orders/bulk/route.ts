import { NextRequest, NextResponse } from 'next/server'
import { handleApiError } from '@/lib/errors'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendOrderStatusUpdateEmail } from '@/lib/email'

// Check if user is admin or staff
function isAdminOrStaff(user: any): boolean {
  return user.role === 'admin' || user.role === 'staff'
}

export async function PATCH(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)

    if (!isAdminOrStaff(authUser)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { orderIds, action, status } = await request.json()

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: 'Order IDs array is required' }, { status: 400 })
    }

    if (action !== 'update_status') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    if (!status) {
      return NextResponse.json({ error: 'Status is required for status update action' }, { status: 400 })
    }

    const validStatuses = ['pending', 'processing', 'in_production', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 })
    }

    // Update all orders in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const updatedOrders = await tx.order.updateMany({
        where: {
          id: { in: orderIds.map((id: any) => parseInt(id)) }
        },
        data: { order_status: status }
      })

      // Get updated orders with user information for email notifications
      const ordersWithUsers = await tx.order.findMany({
        where: {
          id: { in: orderIds.map((id: any) => parseInt(id)) }
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })

      return {
        updatedCount: updatedOrders.count,
        orders: ordersWithUsers
      }
    })

    // Send email notifications asynchronously
    result.orders.forEach(order => {
      sendOrderStatusUpdateEmail(
        order.id,
        order.user.email,
        order.user.name,
        status
      ).catch(err =>
        console.error(`Failed to send status update email for order ${order.id}:`, err)
      )
    })

    return NextResponse.json({
      message: `Successfully updated ${result.updatedCount} orders`,
      updated_count: result.updatedCount,
      status: status
    })
  } catch (error) {
    return handleApiError(error)
  }
}
