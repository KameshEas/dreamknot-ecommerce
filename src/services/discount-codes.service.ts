import { prisma } from '@/lib/prisma'
import { ConflictError, NotFoundError } from '@/lib/errors'

export interface DiscountCode {
  id: number
  code: string
  description: string | null
  discount_type: string
  discount_value: number
  minimum_order: number | null
  maximum_discount: number | null
  usage_limit: number | null
  usage_count: number
  is_active: boolean
  valid_from: Date | null
  valid_until: Date | null
  applicable_products: string | null
  applicable_categories: string | null
  created_at: Date
  updated_at?: Date
}

export interface CreateDiscountCodeData {
  code: string
  description?: string
  discount_type: string
  discount_value: number
  minimum_order?: number
  maximum_discount?: number
  usage_limit?: number
  valid_from?: string
  valid_until?: string
  applicable_products?: any[]
  applicable_categories?: any[]
}

export interface UpdateDiscountCodeData {
  description?: string
  discount_type?: string
  discount_value?: number
  minimum_order?: number
  maximum_discount?: number
  usage_limit?: number
  valid_from?: string
  valid_until?: string
  applicable_products?: any[]
  applicable_categories?: any[]
  is_active?: boolean
}

export interface DiscountCodesQuery {
  activeOnly?: boolean
}

export class DiscountCodesService {
  static async getDiscountCodes(query: DiscountCodesQuery = {}): Promise<DiscountCode[]> {
    const { activeOnly = false } = query

    const discountCodes = await prisma.discountCode.findMany({
      where: activeOnly ? { is_active: true } : {},
      orderBy: { created_at: 'desc' }
    })

    return discountCodes
  }

  static async getDiscountCodeById(id: number): Promise<DiscountCode | null> {
    const discountCode = await prisma.discountCode.findUnique({
      where: { id }
    })

    return discountCode
  }

  static async getDiscountCodeByCode(code: string): Promise<DiscountCode | null> {
    const discountCode = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() }
    })

    return discountCode
  }

  static async createDiscountCode(data: CreateDiscountCodeData): Promise<DiscountCode> {
    const {
      code,
      description,
      discount_type,
      discount_value,
      minimum_order = 0,
      maximum_discount,
      usage_limit,
      valid_from,
      valid_until,
      applicable_products,
      applicable_categories
    } = data

    // Check if code already exists
    const existingCode = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (existingCode) {
      throw new ConflictError('Discount code already exists')
    }

    const discountCode = await prisma.discountCode.create({
      data: {
        code: code.toUpperCase(),
        description,
        discount_type,
        discount_value,
        minimum_order,
        maximum_discount,
        usage_limit,
        valid_from: valid_from ? new Date(valid_from) : null,
        valid_until: valid_until ? new Date(valid_until) : null,
        applicable_products: applicable_products ? JSON.stringify(applicable_products) : null,
        applicable_categories: applicable_categories ? JSON.stringify(applicable_categories) : null
      }
    })

    return discountCode
  }

  static async updateDiscountCode(id: number, data: UpdateDiscountCodeData): Promise<DiscountCode> {
    const updateData: any = {}

    if (data.description !== undefined) updateData.description = data.description
    if (data.discount_type !== undefined) updateData.discount_type = data.discount_type
    if (data.discount_value !== undefined) updateData.discount_value = data.discount_value
    if (data.minimum_order !== undefined) updateData.minimum_order = data.minimum_order
    if (data.maximum_discount !== undefined) updateData.maximum_discount = data.maximum_discount
    if (data.usage_limit !== undefined) updateData.usage_limit = data.usage_limit
    if (data.valid_from !== undefined) updateData.valid_from = data.valid_from ? new Date(data.valid_from) : null
    if (data.valid_until !== undefined) updateData.valid_until = data.valid_until ? new Date(data.valid_until) : null
    if (data.applicable_products !== undefined) updateData.applicable_products = data.applicable_products ? JSON.stringify(data.applicable_products) : null
    if (data.applicable_categories !== undefined) updateData.applicable_categories = data.applicable_categories ? JSON.stringify(data.applicable_categories) : null
    if (data.is_active !== undefined) updateData.is_active = data.is_active

    const discountCode = await prisma.discountCode.update({
      where: { id },
      data: updateData
    })

    return discountCode
  }

  static async deleteDiscountCode(id: number): Promise<void> {
    await prisma.discountCode.delete({
      where: { id }
    })
  }

  static async validateDiscountCode(code: string, orderTotal: number): Promise<{ valid: boolean; discount: number; discountCode?: DiscountCode }> {
    const discountCode = await this.getDiscountCodeByCode(code)

    if (!discountCode || !discountCode.is_active) {
      return { valid: false, discount: 0 }
    }

    // Check date validity
    const now = new Date()
    if (discountCode.valid_from && now < discountCode.valid_from) {
      return { valid: false, discount: 0 }
    }
    if (discountCode.valid_until && now > discountCode.valid_until) {
      return { valid: false, discount: 0 }
    }

    // Check minimum order
    if (discountCode.minimum_order && orderTotal < discountCode.minimum_order) {
      return { valid: false, discount: 0 }
    }

    // Check usage limit
    if (discountCode.usage_limit && discountCode.usage_count >= discountCode.usage_limit) {
      return { valid: false, discount: 0 }
    }

    // Calculate discount
    let discount = 0
    if (discountCode.discount_type === 'percentage') {
      discount = (orderTotal * discountCode.discount_value) / 100
      if (discountCode.maximum_discount && discount > discountCode.maximum_discount) {
        discount = discountCode.maximum_discount
      }
    } else if (discountCode.discount_type === 'fixed') {
      discount = discountCode.discount_value
    }

    return { valid: true, discount, discountCode }
  }

  static async incrementUsage(code: string): Promise<void> {
    await prisma.discountCode.updateMany({
      where: { code: code.toUpperCase() },
      data: {
        usage_count: {
          increment: 1
        }
      }
    })
  }

  static async toggleDiscountCode(id: number): Promise<DiscountCode> {
    const discountCode = await this.getDiscountCodeById(id)
    if (!discountCode) {
      throw new NotFoundError('Discount code')
    }

    return this.updateDiscountCode(id, { is_active: !discountCode.is_active })
  }
}
