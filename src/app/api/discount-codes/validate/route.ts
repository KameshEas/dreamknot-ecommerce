import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { validateRequest } from '@/lib/validation'
import { handleApiError } from '@/lib/errors'
import { DiscountCodesService } from '@/services/discount-codes.service'
import { discountCodeSchemas } from '@/lib/validation'

interface ValidateDiscountCodeRequest {
  code: string
  orderTotal: number
}

export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request)
    const { code, orderTotal } = await validateRequest(request, discountCodeSchemas.validate)

    const result = await DiscountCodesService.validateDiscountCode(code, orderTotal)

    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}
