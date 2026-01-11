import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromCookies } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'
import { OrdersService } from '@/services/orders.service'

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromCookies()
    const body = await request.json()
    const { discount_code, discount_amount } = body

    const result = await OrdersService.createPaymentOrder(authUser.id, discount_code, discount_amount)
    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}
