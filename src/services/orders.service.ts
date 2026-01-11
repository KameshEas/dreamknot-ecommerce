import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email'
import Razorpay from 'razorpay'
import { createHmac } from 'crypto'
import { ProductsService } from './products.service'
import { NotFoundError, ConflictError } from '@/lib/errors'

export interface ShippingAddress {
  name: string
  phone: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

export interface BillingAddress {
  name: string
  phone: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

export interface OrderItem {
  product_id: number
  qty: number
  customization?: any
}

export interface CreateOrderData {
  shipping_address: ShippingAddress
  billing_address: BillingAddress
  payment_method?: string
  discount_code?: string
}

export interface PaymentVerificationData {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  shipping_address: ShippingAddress
  billing_address: BillingAddress
}

export interface OrderResult {
  id: number
  total_amount: number
  order_status: string
  payment_status: string
  created_at: Date
}

export interface PaymentOrderResult {
  orderId: string
  amount: number | string
  currency: string
  key: string
}

export interface UserOrder {
  id: number
  total_amount: number
  order_status: string
  payment_status: string
  shipping_address: ShippingAddress
  billing_address: BillingAddress
  created_at: Date
  items: Array<{
    id: number
    product: any
    customization: string | null
    qty: number
    price: number
  }>
}

export class OrdersService {
  private static razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
  })

  static async createPaymentOrder(userId: number, discountCode?: string, discountAmount?: number): Promise<PaymentOrderResult> {
    console.log('Creating payment order:', { userId, discountCode, discountAmount })

    // Get user's cart
    const cart = await prisma.cart.findFirst({
      where: { user_id: userId },
      include: {
        cart_items: true
      }
    })

    if (!cart || cart.cart_items.length === 0) {
      throw new ConflictError('Cart is empty')
    }

    // Get all products to calculate total
    const productsResult = await ProductsService.getProducts({ limit: 1000 })
    const products = productsResult.products

    // Calculate total
    const subtotal = cart.cart_items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.product_id)
      const price = product ? product.discounted_price : 0
      return sum + (price * item.qty)
    }, 0)

    console.log('Payment order calculation:', { subtotal, discountCode, discountAmount })

    // Apply discount if provided
    const total_amount = discountAmount ? Math.max(0, subtotal - discountAmount) : subtotal

    console.log('Final payment amount:', { subtotal, discountAmount, total_amount })

    const amount_in_paise = Math.round(total_amount * 100) // RazorPay expects amount in paise

    // Create RazorPay order
    const razorpayOrder = await this.razorpay.orders.create({
      amount: amount_in_paise,
      currency: 'INR',
      receipt: `order_${Date.now()}_${userId}`
    })

    return {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID!
    }
  }

  static async verifyPaymentAndCreateOrder(
    userId: number,
    data: PaymentVerificationData,
    discountCode?: string,
    discountAmount?: number
  ): Promise<OrderResult> {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, shipping_address, billing_address } = data

    // Verify payment signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex')

    if (razorpay_signature !== expectedSign) {
      throw new ConflictError('Payment verification failed')
    }

    // Get order details from RazorPay
    const payment = await this.razorpay.payments.fetch(razorpay_payment_id)
    if (payment.status !== 'captured') {
      throw new ConflictError('Payment not captured')
    }

    return this.createOrderFromCart(userId, shipping_address, billing_address, {
      razorpay_order_id,
      razorpay_payment_id
    }, discountCode, discountAmount)
  }

  static async createOrder(userId: number, data: CreateOrderData): Promise<OrderResult> {
    return this.createOrderFromCart(userId, data.shipping_address, data.billing_address)
  }

  private static async createOrderFromCart(
    userId: number,
    shipping_address: ShippingAddress,
    billing_address: BillingAddress,
    paymentData?: { razorpay_order_id: string; razorpay_payment_id: string },
    discountCode?: string,
    discountAmount?: number
  ): Promise<OrderResult> {
    // Get user's cart
    const cart = await prisma.cart.findFirst({
      where: { user_id: userId },
      include: {
        cart_items: true
      }
    })

    if (!cart || cart.cart_items.length === 0) {
      throw new ConflictError('Cart is empty')
    }

    // Get all products to calculate total
    const productsResult = await ProductsService.getProducts({ limit: 1000 })
    const products = productsResult.products

    // Calculate subtotal
    const subtotal = cart.cart_items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.product_id)
      const price = product ? product.discounted_price : 0
      return sum + (price * item.qty)
    }, 0)

    // Apply discount if provided
    const total_amount = discountAmount ? Math.max(0, subtotal - discountAmount) : subtotal

    // Create order
    const order = await prisma.order.create({
      data: {
        user_id: userId,
        total_amount,
        shipping_address: JSON.stringify(shipping_address),
        billing_address: JSON.stringify(billing_address),
        payment_status: paymentData ? 'paid' : 'pending',
        order_status: 'processing',
        ...(paymentData && {
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id
        })
      }
    })

    // Create order items
    await prisma.orderItem.createMany({
      data: cart.cart_items.map((item) => {
        const product = products.find(p => p.id === item.product_id)
        const price = product ? product.discounted_price : 0
        return {
          order_id: order.id,
          product_id: item.product_id,
          customization_json: item.customization,
          qty: item.qty,
          price: price
        }
      })
    })

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cart_id: cart.id }
    })

    // Send emails asynchronously
    this.sendOrderEmails(order.id, userId, shipping_address, billing_address, cart.cart_items, total_amount, discountCode, discountAmount)

    return {
      id: order.id,
      total_amount: order.total_amount,
      order_status: order.order_status,
      payment_status: order.payment_status,
      created_at: order.created_at
    }
  }

  static async getUserOrders(userId: number): Promise<UserOrder[]> {
    // Get orders from database
    const orders = await prisma.order.findMany({
      where: { user_id: userId },
      include: {
        order_items: true
      },
      orderBy: { created_at: 'desc' }
    })

    // Get all products to enrich order items
    const productsResult = await ProductsService.getProducts({ limit: 1000 })
    const products = productsResult.products

    return orders.map((order) => {
      const items = order.order_items.map((item) => {
        const product = products.find(p => p.id === item.product_id)

        // If product not found, create a placeholder
        const finalProduct = product || {
          id: item.product_id,
          title: 'Product Unavailable',
          description: 'This product is no longer available.',
          original_price: 0,
          discounted_price: 0,
          ean: undefined,
          upc: undefined,
          images: ['/placeholder-product.jpg'],
          category: null,
          slug: '',
          featured: false,
          delivery_option: null,
          stock_quantity: 0,
          is_available: true,
          sku: '',
          weight: undefined,
          weight_unit: null,
          dimensions: undefined,
          low_stock_threshold: 5,
          allow_backorders: false,
          track_inventory: true,
          averageRating: 0,
          reviewCount: 0,
          product_type: 'physical',
          requires_shipping: true,
          taxable: true,
          tags: undefined,
          meta_description: undefined,
          meta_keywords: undefined,
          customizations: []
        }

        return {
          id: item.id,
          product: finalProduct,
          customization: item.customization_json,
          qty: item.qty,
          price: finalProduct.discounted_price * item.qty
        }
      })

      return {
        id: order.id,
        total_amount: order.total_amount, // Use stored discounted total
        order_status: order.order_status,
        payment_status: order.payment_status,
        shipping_address: JSON.parse(order.shipping_address),
        billing_address: JSON.parse(order.billing_address),
        created_at: order.created_at,
        items
      }
    })
  }

  static async getAllOrders(): Promise<any[]> {
    // Get all orders with user information for admin view
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        order_items: true
      },
      orderBy: { created_at: 'desc' }
    })

    // Get all products to enrich order items
    const productsResult = await ProductsService.getProducts({ limit: 1000 })
    const products = productsResult.products

    return orders.map((order) => {
      const items = order.order_items.map((item) => {
        const product = products.find(p => p.id === item.product_id)
        return {
          ...item,
          product_title: product?.title || 'Product Unavailable'
        }
      })

      return {
        ...order,
        items
      }
    })
  }

  private static async sendOrderEmails(
    orderId: number,
    userId: number,
    shipping_address: ShippingAddress,
    billing_address: BillingAddress,
    cartItems: any[],
    totalAmount: number,
    discountCode?: string,
    discountAmount?: number
  ): Promise<void> {
    try {
      // Get user info
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true }
      })

      if (!user) return

      // Get all products for email data
      const productsResult = await ProductsService.getProducts({ limit: 1000 })
      const products = productsResult.products

      const emailData = {
        orderId,
        customerName: user.name,
        customerEmail: user.email,
        totalAmount,
        discountCode,
        discountAmount,
        shippingAddress: {
          name: shipping_address.name,
          address_line: shipping_address.address_line_1 + (shipping_address.address_line_2 ? '\n' + shipping_address.address_line_2 : ''),
          city: shipping_address.city,
          state: shipping_address.state,
          zip: shipping_address.postal_code,
          country: shipping_address.country
        },
        billingAddress: {
          name: billing_address.name,
          address_line: billing_address.address_line_1 + (billing_address.address_line_2 ? '\n' + billing_address.address_line_2 : ''),
          city: billing_address.city,
          state: billing_address.state,
          zip: billing_address.postal_code,
          country: billing_address.country
        },
        items: cartItems.map((item) => {
          const product = products.find(p => p.id === item.product_id)
          return {
            product: product || {
              title: 'Product Unavailable'
            },
            customization_json: item.customization,
            qty: item.qty,
            price: product?.discounted_price || 0
          }
        })
      }

      // Send emails in background
      sendOrderConfirmationEmail(emailData).catch(err =>
        console.error('Failed to send order confirmation email:', err)
      )

      sendAdminOrderNotification(emailData).catch(err =>
        console.error('Failed to send admin notification email:', err)
      )
    } catch (error) {
      console.error('Error sending order emails:', error)
    }
  }
}
