import { z } from 'zod'
import { NextRequest } from 'next/server'

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public statusCode: number = 400
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

export function validateRequest<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<T> {
  return request.json().then(data => {
    const result = schema.safeParse(data)
    if (!result.success) {
      const firstError = result.error.issues[0]
      throw new ValidationError(
        firstError.message,
        firstError.path.join('.'),
        400
      )
    }
    return result.data
  })
}

export function validateQueryParams<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): T {
  const url = new URL(request.url)
  const params = Object.fromEntries(url.searchParams.entries())

  const result = schema.safeParse(params)
  if (!result.success) {
    const firstError = result.error.issues[0]
    throw new ValidationError(
      firstError.message,
      firstError.path.join('.'),
      400
    )
  }
  return result.data
}

// Common validation schemas
export const authSchemas = {
  login: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters')
  }),

  signup: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters')
  }),

  changePassword: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters')
  })
}

export const userSchemas = {
  updateProfile: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().optional(),
    avatar: z.string().url('Invalid avatar URL').optional(),
    date_of_birth: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    preferences: z.any().optional(),
    email_notifications: z.boolean().optional(),
    sms_notifications: z.boolean().optional()
  })
}

export const productSchemas = {
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    minPrice: z.string().transform((val) => Number(val)).optional(),
    maxPrice: z.string().transform((val) => Number(val)).optional(),
    sortBy: z.enum(['newest', 'price-low', 'price-high', 'name']).optional(),
    page: z.string().transform((val) => parseInt(val) || 1).optional(),
    limit: z.string().transform((val) => parseInt(val) || 12).optional(),
    featured: z.string().transform((val) => val === 'true').optional()
  })
}

export const orderSchemas = {
  create: z.object({
    shipping_address: z.object({
      name: z.string().min(2),
      phone: z.string().min(10),
      address_line_1: z.string().min(5),
      address_line_2: z.string().optional(),
      city: z.string().min(2),
      state: z.string().min(2),
      postal_code: z.string().min(5),
      country: z.string().min(2)
    }),
    billing_address: z.object({
      name: z.string().min(2),
      phone: z.string().min(10),
      address_line_1: z.string().min(5),
      address_line_2: z.string().optional(),
      city: z.string().min(2),
      state: z.string().min(2),
      postal_code: z.string().min(5),
      country: z.string().min(2)
    }),
    payment_method: z.string().optional(),
    discount_code: z.string().optional()
  }),

  verifyPayment: z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string(),
    shipping_address: z.object({
      name: z.string().min(2),
      phone: z.string().min(10),
      address_line_1: z.string().min(5),
      address_line_2: z.string().optional(),
      city: z.string().min(2),
      state: z.string().min(2),
      postal_code: z.string().min(5),
      country: z.string().min(2)
    }),
    billing_address: z.object({
      name: z.string().min(2),
      phone: z.string().min(10),
      address_line_1: z.string().min(5),
      address_line_2: z.string().optional(),
      city: z.string().min(2),
      state: z.string().min(2),
      postal_code: z.string().min(5),
      country: z.string().min(2)
    })
  })
}

export const cartSchemas = {
  addItem: z.object({
    productId: z.number(),
    customization: z.any().optional(),
    qty: z.number().min(1).optional()
  }),

  updateItem: z.object({
    itemId: z.number(),
    qty: z.number().min(0)
  }),

  removeItem: z.object({
    itemId: z.number()
  })
}

export const wishlistSchemas = {
  addItem: z.object({
    productId: z.number()
  }),

  removeItem: z.object({
    productId: z.number()
  })
}

export const discountCodeSchemas = {
  create: z.object({
    code: z.string().min(1, 'Code is required'),
    description: z.string().optional(),
    discount_type: z.enum(['percentage', 'fixed']),
    discount_value: z.number().min(0, 'Discount value must be positive'),
    minimum_order: z.number().min(0).optional(),
    maximum_discount: z.number().min(0).optional(),
    usage_limit: z.number().min(1).optional(),
    valid_from: z.string().optional(),
    valid_until: z.string().optional(),
    applicable_products: z.array(z.any()).optional(),
    applicable_categories: z.array(z.any()).optional()
  }),

  update: z.object({
    description: z.string().optional(),
    discount_type: z.enum(['percentage', 'fixed']).optional(),
    discount_value: z.number().min(0, 'Discount value must be positive').optional(),
    minimum_order: z.number().min(0).optional(),
    maximum_discount: z.number().min(0).optional(),
    usage_limit: z.number().min(1).optional(),
    valid_from: z.string().optional(),
    valid_until: z.string().optional(),
    applicable_products: z.array(z.any()).optional(),
    applicable_categories: z.array(z.any()).optional(),
    is_active: z.boolean().optional()
  }),

  query: z.object({
    active: z.string().transform(val => val === 'true').optional()
  }),

  validate: z.object({
    code: z.string().min(1, 'Discount code is required'),
    orderTotal: z.number().min(0, 'Order total must be positive')
  })
}

export const addressSchemas = {
  create: z.object({
    type: z.enum(['shipping', 'billing']),
    name: z.string().min(2),
    phone: z.string().min(10),
    address_line_1: z.string().min(5),
    address_line_2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    postal_code: z.string().min(5),
    country: z.string().min(2),
    is_default: z.boolean().optional()
  }),

  update: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().min(10).optional(),
    address_line_1: z.string().min(5).optional(),
    address_line_2: z.string().optional(),
    city: z.string().min(2).optional(),
    state: z.string().min(2).optional(),
    postal_code: z.string().min(5).optional(),
    country: z.string().min(2).optional(),
    is_default: z.boolean().optional()
  })
}
