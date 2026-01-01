import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderStatusUpdateEmail } from '@/lib/email'
import { getAuthUser } from '@/lib/auth'

// Check if user is admin or staff
function isAdminOrStaff(user: any): boolean {
  return user.role === 'admin' || user.role === 'staff'
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(request)

    if (!isAdminOrStaff(authUser)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    const orderId = parseInt(id)
    const { order_status } = await request.json()

    if (!order_status) {
      return NextResponse.json({ error: 'Order status required' }, { status: 400 })
    }

    const validStatuses = ['pending', 'processing', 'in_production', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(order_status)) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { order_status }
    })

    // Send email notification to customer about status update
    const orderWithUser = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (orderWithUser?.user) {
      // Send status update email asynchronously
      sendOrderStatusUpdateEmail(
        orderId,
        orderWithUser.user.email,
        orderWithUser.user.name,
        order_status
      ).catch(err =>
        console.error('Failed to send order status update email:', err)
      )
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
