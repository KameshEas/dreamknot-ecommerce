import { NextResponse } from 'next/server'
import { handleApiError } from '@/lib/errors'
import { OrdersService } from '@/services/orders.service'

// For simplicity, we'll skip admin authentication for now
// In production, you'd check for admin role using getAuthUser and verify admin status

export async function GET() {
  try {
    // TODO: Add admin authentication check here
    // const authUser = getAuthUser(request)
    // if (!isAdmin(authUser.id)) throw new ForbiddenError()

    // For now, return all orders (this should be restricted to admins only)
    const allOrders = await OrdersService.getAllOrders()
    return NextResponse.json({ orders: allOrders })
  } catch (error) {
    return handleApiError(error)
  }
}
