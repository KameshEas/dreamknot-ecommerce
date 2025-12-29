import { NextRequest, NextResponse } from 'next/server'
import { validateRequest, validateQueryParams } from '@/lib/validation'
import { handleApiError } from '@/lib/errors'
import { DiscountCodesService } from '@/services/discount-codes.service'
import { discountCodeSchemas } from '@/lib/validation'

// Get all discount codes
export async function GET(request: NextRequest) {
  try {
    const query = validateQueryParams(request, discountCodeSchemas.query)
    const discountCodes = await DiscountCodesService.getDiscountCodes({ activeOnly: query.active })
    return NextResponse.json({ discount_codes: discountCodes })
  } catch (error) {
    return handleApiError(error)
  }
}

// Create new discount code
export async function POST(request: NextRequest) {
  try {
    const data = await validateRequest(request, discountCodeSchemas.create)
    const discountCode = await DiscountCodesService.createDiscountCode(data)
    return NextResponse.json({ discount_code: discountCode })
  } catch (error) {
    return handleApiError(error)
  }
}
