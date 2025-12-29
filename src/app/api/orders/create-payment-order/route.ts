import { NextResponse } from 'next/server'
import { getAuthUserFromCookies } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'
import { OrdersService } from '@/services/orders.service'

export async function POST() {
  try {
    const authUser = await getAuthUserFromCookies()
    const result = await OrdersService.createPaymentOrder(authUser.id)
    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}
