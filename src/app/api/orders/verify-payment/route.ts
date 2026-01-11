import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { validateRequest } from '@/lib/validation'
import { handleApiError } from '@/lib/errors'
import { OrdersService } from '@/services/orders.service'
import { orderSchemas } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request)
    const body = await request.json()
    const { discount_code, discount_amount, ...paymentData } = body

    const result = await OrdersService.verifyPaymentAndCreateOrder(authUser.id, paymentData, discount_code, discount_amount)
    return NextResponse.json({
      message: 'Order placed successfully',
      order: result
    })
  } catch (error) {
    return handleApiError(error)
  }
}
