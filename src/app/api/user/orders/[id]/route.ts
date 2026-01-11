import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'
import { OrdersService } from '@/services/orders.service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = getAuthUser(request)
    const resolvedParams = await params
    const orderId = parseInt(resolvedParams.id)

    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    // Get all user orders and find the specific one
    const ordersResult = await OrdersService.getUserOrders(authUser.id)
    const order = ordersResult.find(o => o.id === orderId)

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    return handleApiError(error)
  }
}
