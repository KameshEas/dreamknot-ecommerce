import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { validateRequest } from '@/lib/validation'
import { handleApiError } from '@/lib/errors'
import { OrdersService } from '@/services/orders.service'
import { orderSchemas } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    const paymentData = await validateRequest(request, orderSchemas.verifyPayment)
    const result = await OrdersService.verifyPaymentAndCreateOrder(authUser.id, paymentData)
    return NextResponse.json({
      message: 'Order placed successfully',
      order: result
    })
  } catch (error) {
    return handleApiError(error)
  }
}
