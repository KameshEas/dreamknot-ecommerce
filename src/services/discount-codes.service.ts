interface StrapiDiscountCode {
  id: number
  documentId: string
  code: string
  name: string | null
  description: string | null
  discount_type: string
  discount_value: number
  minimum_order_value: number | null
  maximum_discount: number | null
  usage_limit: number | null
  usage_count: number
  valid_from: string | null
  valid_until: string | null
  is_active: boolean
  applies_to: string
  customer_limit: number | null
  customer_usage_count: Record<string, any>
  exclude_sale_items: boolean
  free_shipping: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  applies_to_products?: { count: number }
  applies_to_categories?: { count: number }
}

export interface DiscountCode {
  id: number
  code: string
  name: string | null
  description: string | null
  discount_type: string
  discount_value: number
  minimum_order_value: number | null
  maximum_discount: number | null
  usage_limit: number | null
  usage_count: number
  is_active: boolean
  valid_from: Date | null
  valid_until: Date | null
  applies_to: string
  customer_limit: number | null
  customer_usage_count: Record<string, any>
  exclude_sale_items: boolean
  free_shipping: boolean
  created_at: Date
  updated_at: Date
}

export interface CreateDiscountCodeData {
  code: string
  name?: string
  description?: string
  discount_type: string
  discount_value: number
  minimum_order_value?: number
  maximum_discount?: number
  usage_limit?: number
  valid_from?: string
  valid_until?: string
  applies_to?: string
  customer_limit?: number
  exclude_sale_items?: boolean
  free_shipping?: boolean
}

export interface UpdateDiscountCodeData {
  name?: string
  description?: string
  discount_type?: string
  discount_value?: number
  minimum_order_value?: number
  maximum_discount?: number
  usage_limit?: number
  usage_count?: number
  valid_from?: string
  valid_until?: string
  applies_to?: string
  customer_limit?: number
  exclude_sale_items?: boolean
  free_shipping?: boolean
  is_active?: boolean
}

export interface DiscountCodesQuery {
  activeOnly?: boolean
}

export class DiscountCodesService {
  private static readonly STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
  private static readonly STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN


  static async getDiscountCodes(query: DiscountCodesQuery = {}): Promise<DiscountCode[]> {
    const { activeOnly = false } = query

    try {
      const params = new URLSearchParams()
      if (activeOnly) {
        params.append('filters[is_active][$eq]', 'true')
      }
      params.append('sort', 'created_at:desc')

      const response = await fetch(`${this.STRAPI_URL}/api/discount-codes?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(this.STRAPI_API_TOKEN && { 'Authorization': `Bearer ${this.STRAPI_API_TOKEN}` })
        }
      })

      if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status}`)
      }

      const data = await response.json()

      return data.data.map((item: StrapiDiscountCode) => this.transformStrapiDiscountCode(item))
    } catch (error) {
      console.error('Strapi discount codes error:', error)
      return []
    }
  }

  static async getDiscountCodeById(id: number): Promise<DiscountCode | null> {
    try {
      const response = await fetch(`${this.STRAPI_URL}/api/discount-codes/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(this.STRAPI_API_TOKEN && { 'Authorization': `Bearer ${this.STRAPI_API_TOKEN}` })
        }
      })

      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`Strapi API error: ${response.status}`)
      }

      const data = await response.json()
      return this.transformStrapiDiscountCode(data.data)
    } catch (error) {
      console.error('Strapi discount code error:', error)
      return null
    }
  }

  static async getDiscountCodeByCode(code: string): Promise<DiscountCode | null> {
    // Try multiple API endpoints and authentication methods
    const endpoints = ['discount-codes', 'discount-code'] // Try both plural and singular

    for (const endpoint of endpoints) {
      try {
        const params = new URLSearchParams()
        params.append('filters[code][$eqi]', code.toUpperCase())
        params.append('filters[is_active][$eq]', 'true')

        console.log(`Trying ${endpoint} endpoint for:`, code, 'URL:', `${this.STRAPI_URL}/api/${endpoint}?${params.toString()}`)

        // Try without auth first
        const response = await fetch(`${this.STRAPI_URL}/api/${endpoint}?${params.toString()}`, {
          headers: {
            'Content-Type': 'application/json',
          }
        })

        console.log(`${endpoint} response status:`, response.status)

        if (response.ok) {
          const data = await response.json()
          if (data.data && data.data.length > 0) {
            console.log(`Found discount code in Strapi using ${endpoint}:`, data.data[0])
            return this.transformStrapiDiscountCode(data.data[0])
          }
        }

        // Try with auth token
        console.log(`Trying ${endpoint} with auth token...`)
        const authResponse = await fetch(`${this.STRAPI_URL}/api/${endpoint}?${params.toString()}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(this.STRAPI_API_TOKEN && { 'Authorization': `Bearer ${this.STRAPI_API_TOKEN}` })
          }
        })

        console.log(`${endpoint} auth response status:`, authResponse.status)

        if (authResponse.ok) {
          const authData = await authResponse.json()
          if (authData.data && authData.data.length > 0) {
            console.log(`Found discount code in Strapi using ${endpoint} with auth:`, authData.data[0])
            return this.transformStrapiDiscountCode(authData.data[0])
          }
        }
      } catch (error) {
        console.error(`Error trying ${endpoint} endpoint:`, error)
      }
    }

    // No fallback - return null if Strapi API fails
    console.log('All Strapi API calls failed, no discount code found for:', code)
    return null
  }

  static async createDiscountCode(data: CreateDiscountCodeData): Promise<DiscountCode> {
    try {
      const strapiData = {
        data: {
          code: data.code.toUpperCase(),
          name: data.name,
          description: data.description,
          discount_type: data.discount_type,
          discount_value: data.discount_value,
          minimum_order_value: data.minimum_order_value,
          maximum_discount: data.maximum_discount,
          usage_limit: data.usage_limit,
          usage_count: 0,
          valid_from: data.valid_from,
          valid_until: data.valid_until,
          is_active: true,
          applies_to: data.applies_to || 'all_products',
          customer_limit: data.customer_limit,
          customer_usage_count: {},
          exclude_sale_items: data.exclude_sale_items || false,
          free_shipping: data.free_shipping || false
        }
      }

      const response = await fetch(`${this.STRAPI_URL}/api/discount-codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.STRAPI_API_TOKEN && { 'Authorization': `Bearer ${this.STRAPI_API_TOKEN}` })
        },
        body: JSON.stringify(strapiData)
      })

      if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status}`)
      }

      const result = await response.json()
      return this.transformStrapiDiscountCode(result.data)
    } catch (error) {
      console.error('Strapi create discount code error:', error)
      throw error
    }
  }

  static async updateDiscountCode(id: number, data: UpdateDiscountCodeData): Promise<DiscountCode> {
    try {
      const strapiData = { data }

      const response = await fetch(`${this.STRAPI_URL}/api/discount-codes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(this.STRAPI_API_TOKEN && { 'Authorization': `Bearer ${this.STRAPI_API_TOKEN}` })
        },
        body: JSON.stringify(strapiData)
      })

      if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status}`)
      }

      const result = await response.json()
      return this.transformStrapiDiscountCode(result.data)
    } catch (error) {
      console.error('Strapi update discount code error:', error)
      throw error
    }
  }

  static async deleteDiscountCode(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.STRAPI_URL}/api/discount-codes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(this.STRAPI_API_TOKEN && { 'Authorization': `Bearer ${this.STRAPI_API_TOKEN}` })
        }
      })

      if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status}`)
      }
    } catch (error) {
      console.error('Strapi delete discount code error:', error)
      throw error
    }
  }

  static async validateDiscountCode(code: string, orderTotal: number): Promise<{ valid: boolean; discount: number; discountCode?: DiscountCode }> {
    console.log('Validating discount code:', { code, orderTotal })

    const discountCode = await this.getDiscountCodeByCode(code)
    console.log('Discount code lookup result:', { found: !!discountCode, discountCode })

    if (!discountCode || !discountCode.is_active) {
      console.log('Discount code not found or inactive:', { code, found: !!discountCode, active: discountCode?.is_active })
      return { valid: false, discount: 0 }
    }

    // Check date validity
    const now = new Date()
    console.log('Date validation:', { now, valid_from: discountCode.valid_from, valid_until: discountCode.valid_until })

    if (discountCode.valid_from && now < discountCode.valid_from) {
      console.log('Discount code not yet valid:', { code, now, valid_from: discountCode.valid_from })
      return { valid: false, discount: 0 }
    }
    if (discountCode.valid_until && now > discountCode.valid_until) {
      console.log('Discount code expired:', { code, now, valid_until: discountCode.valid_until })
      return { valid: false, discount: 0 }
    }

    // Check minimum order
    console.log('Minimum order check:', { orderTotal, minimum_order_value: discountCode.minimum_order_value })
    if (discountCode.minimum_order_value && orderTotal < discountCode.minimum_order_value) {
      console.log('Order total below minimum:', { code, orderTotal, minimum_order_value: discountCode.minimum_order_value })
      return { valid: false, discount: 0 }
    }

    // Check usage limit
    if (discountCode.usage_limit && discountCode.usage_count >= discountCode.usage_limit) {
      console.log('Discount code usage limit reached:', { code, usage_count: discountCode.usage_count, usage_limit: discountCode.usage_limit })
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

    console.log('Discount code valid:', { code, orderTotal, discount, discountCode })
    return { valid: true, discount, discountCode }
  }

  static async incrementUsage(code: string): Promise<void> {
    const discountCode = await this.getDiscountCodeByCode(code)
    if (!discountCode) return

    await this.updateDiscountCode(discountCode.id, {
      usage_count: discountCode.usage_count + 1
    })
  }

  static async toggleDiscountCode(id: number): Promise<DiscountCode> {
    const discountCode = await this.getDiscountCodeById(id)
    if (!discountCode) throw new Error('Discount code not found')

    return this.updateDiscountCode(id, { is_active: !discountCode.is_active })
  }

  private static transformStrapiDiscountCode(strapiItem: StrapiDiscountCode): DiscountCode {
    return {
      id: strapiItem.id,
      code: strapiItem.code,
      name: strapiItem.name,
      description: strapiItem.description,
      discount_type: strapiItem.discount_type,
      discount_value: strapiItem.discount_value,
      minimum_order_value: strapiItem.minimum_order_value,
      maximum_discount: strapiItem.maximum_discount,
      usage_limit: strapiItem.usage_limit,
      usage_count: strapiItem.usage_count,
      is_active: strapiItem.is_active,
      valid_from: strapiItem.valid_from ? new Date(strapiItem.valid_from) : null,
      valid_until: strapiItem.valid_until ? new Date(strapiItem.valid_until) : null,
      applies_to: strapiItem.applies_to,
      customer_limit: strapiItem.customer_limit,
      customer_usage_count: strapiItem.customer_usage_count,
      exclude_sale_items: strapiItem.exclude_sale_items,
      free_shipping: strapiItem.free_shipping,
      created_at: new Date(strapiItem.createdAt),
      updated_at: new Date(strapiItem.updatedAt)
    }
  }
}
