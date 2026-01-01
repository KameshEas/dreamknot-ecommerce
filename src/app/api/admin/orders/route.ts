import { NextRequest, NextResponse } from 'next/server'
import { handleApiError } from '@/lib/errors'
import { getAuthUser } from '@/lib/auth'
import { OrdersService } from '@/services/orders.service'

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

    const allOrders = await OrdersService.getAllOrders()
    return NextResponse.json({ orders: allOrders })
  } catch (error) {
    return handleApiError(error)
  }
}
