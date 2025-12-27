import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import Razorpay from 'razorpay'

interface StrapiProduct {
  id: number
  title: string
  description: string
  base_price: string
  category?: {
    id: number
    name: string
    createdAt: string
  }
  images?: Array<{
    url: string
  }>
  createdAt: string
}

interface TransformedProduct {
  id: number
  title: string
  description: string
  base_price: number
  category_id: number | null
  images: string[]
  created_at: string
  category: {
    id: number
    name: string
    created_at: string
  } | null
  customizations: unknown[]
}

interface CartItemData {
  id: number
  cart_id: number
  product_id: number
  customization: string | null
  qty: number
}

async function getUserFromToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    return decoded.userId
  } catch {
    return null
  }
}

const STRAPI_URL = process.env.STRAPI_URL || 'http://api.dreamknot.co.in'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

// Cache for products to avoid repeated API calls
let productsCache: TransformedProduct[] = []
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function fetchAllProductsFromStrapi() {
  const now = Date.now()
  if (productsCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('📋 Using cached products for payment')
    return productsCache
  }

  try {
    console.log('🔍 Fetching all products from Strapi for payment')

    const params = new URLSearchParams()
    params.append('populate[category]', 'true')
    params.append('populate[images]', 'true')
    params.append('pagination[pageSize]', '100') // Get up to 100 products

    const response = await fetch(`${STRAPI_URL}/api/products?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` })
      },
      signal: AbortSignal.timeout(10000)
    })

    console.log(`📡 Payment products API response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.log(`❌ Payment products API error: ${errorText}`)
      return []
    }

    const data = await response.json()
    const products = data.data || []

    console.log(`✅ Found ${products.length} products in Strapi for payment`)

    // Transform products to match expected format
    const transformedProducts = products.map((item: StrapiProduct) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      base_price: parseFloat(item.base_price || '0'),
      category_id: item.category?.id || null,
      images: item.images?.map((img: { url: string }) => {
        if (!img.url) return '/next.svg'
        if (img.url.startsWith('http://') || img.url.startsWith('https://')) {
          return img.url
        } else if (img.url.startsWith('/uploads/')) {
          return `${STRAPI_URL}${img.url}`
        } else {
          return `${STRAPI_URL}/uploads/${img.url}`
        }
      }) || ['/next.svg'],
      created_at: item.createdAt,
      category: item.category ? {
        id: item.category.id,
        name: item.category.name,
        created_at: item.category.createdAt
      } : null,
      customizations: []
    }))

    // Cache the results
    productsCache = transformedProducts
    cacheTimestamp = now

    return transformedProducts
  } catch (error) {
    console.error('💥 Error fetching products from Strapi for payment:', error)
    return []
  }
}

function findProductById(products: TransformedProduct[], productId: number): TransformedProduct | null {
  return products.find(product => product.id === productId) || null
}

export async function POST() {
  try {
    const userId = await getUserFromToken()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's cart items (without Prisma products since we use Strapi)
    const cart = await prisma.cart.findFirst({
      where: { user_id: userId },
      include: {
        cart_items: true // Don't include product relation from Prisma
      }
    })

    if (!cart || cart.cart_items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Fetch all products from Strapi once
    const allProducts = await fetchAllProductsFromStrapi()

    // Calculate total using Strapi product prices
    const total_amount = cart.cart_items.reduce((sum: number, item: CartItemData) => {
      const product = findProductById(allProducts, item.product_id)
      const price = product ? product.base_price : 0
      return sum + (price * item.qty)
    }, 0)

    console.log(`💰 Payment total calculation: ₹${total_amount.toFixed(2)}`)

    const amount_in_paise = Math.round(total_amount * 100) // RazorPay expects amount in paise

    // Initialize RazorPay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!
    })

    // Create RazorPay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount_in_paise,
      currency: 'INR',
      receipt: `order_${Date.now()}_${userId}`
    })

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    })
  } catch (error) {
    console.error('Create payment order error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
