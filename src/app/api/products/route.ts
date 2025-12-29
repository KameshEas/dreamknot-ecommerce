import { NextRequest, NextResponse } from 'next/server'
import { validateQueryParams } from '@/lib/validation'
import { handleApiError } from '@/lib/errors'
import { ProductsService } from '@/services/products.service'
import { productSchemas } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    const query = validateQueryParams(request, productSchemas.query)
    const result = await ProductsService.getProducts(query)
    return NextResponse.json(result)
  } catch (error) {
    return handleApiError(error)
  }
}
