import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'
import { OrdersService } from '@/services/orders.service'

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request)
    const orders = await OrdersService.getUserOrders(authUser.id)
    return NextResponse.json({ orders })
  } catch (error) {
    return handleApiError(error)
  }
}
