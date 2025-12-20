import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Get all discount codes (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    const discountCodes = await prisma.discountCode.findMany({
      where: activeOnly ? { is_active: true } : {},
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json({ discount_codes: discountCodes })
  } catch (error) {
    console.error('Get discount codes error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Create new discount code
export async function POST(request: NextRequest) {
  try {
    const {
      code,
      description,
      discount_type,
      discount_value,
      minimum_order,
      maximum_discount,
      usage_limit,
      valid_from,
      valid_until,
      applicable_products,
      applicable_categories
    } = await request.json()

    if (!code || !discount_type || discount_value === undefined) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }

    const discountCode = await prisma.discountCode.create({
      data: {
        code: code.toUpperCase(),
        description,
        discount_type,
        discount_value,
        minimum_order: minimum_order || 0,
        maximum_discount,
        usage_limit,
        valid_from: valid_from ? new Date(valid_from) : null,
        valid_until: valid_until ? new Date(valid_until) : null,
        applicable_products: applicable_products ? JSON.stringify(applicable_products) : null,
        applicable_categories: applicable_categories ? JSON.stringify(applicable_categories) : null
      }
    })

    return NextResponse.json({ discount_code: discountCode })
  } catch (error) {
    console.error('Create discount code error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
