import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

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

interface OrderItemData {
  id: number
  order_id: number
  product_id: number
  customization_json: string | null
  qty: number
  price: number
}

interface OrderData {
  id: number
  user_id: number
  discount_code_id: number | null
  discount_amount: number | null
  total_amount: number
  payment_status: string
  order_status: string
  shipping_address: string
  billing_address: string
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  created_at: Date
  order_items: OrderItemData[]
}

interface ProcessedOrderItem {
  id: number
  product: TransformedProduct
  customization: string | null
  qty: number
  price: number
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
    console.log('📋 Using cached products for orders')
    return productsCache
  }

  try {
    console.log('🔍 Fetching all products from Strapi for orders')

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

    console.log(`📡 Orders products API response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.log(`❌ Orders products API error: ${errorText}`)
      return []
    }

    const data = await response.json()
    const products = data.data || []

    console.log(`✅ Found ${products.length} products in Strapi for orders`)

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
    console.error('💥 Error fetching products from Strapi for orders:', error)
    return []
  }
}

function findProductById(products: TransformedProduct[], productId: number): TransformedProduct | null {
  return products.find(product => product.id === productId) || null
}

export async function GET() {
  try {
    const userId = await getUserFromToken()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get orders without including Prisma products (since products come from Strapi)
    const orders = await prisma.order.findMany({
      where: { user_id: userId },
      include: {
        order_items: true // Don't include product relation from Prisma
      },
      orderBy: { created_at: 'desc' }
    })

    // Fetch all products from Strapi once
    const allProducts = await fetchAllProductsFromStrapi()

    const formattedOrders = orders.map((order: OrderData) => {
      // Recalculate total based on current product prices
      const items = order.order_items.map((item: OrderItemData) => {
        const product = findProductById(allProducts, item.product_id)

        // If product not found in Strapi, create a placeholder
        const finalProduct = product || {
          id: item.product_id,
          title: 'Product Unavailable',
          description: 'This product is no longer available.',
          base_price: 0,
          category_id: null,
          images: ['/next.svg'],
          created_at: new Date().toISOString(),
          category: null,
          customizations: []
        }

        return {
          id: item.id,
          product: finalProduct,
          customization: item.customization_json,
          qty: item.qty,
          price: finalProduct.base_price * item.qty
        }
      })

      // Calculate new total based on current prices
      const total_amount = items.reduce((sum: number, item: ProcessedOrderItem) => sum + item.price, 0)

      return {
        id: order.id,
        total_amount: total_amount,
        order_status: order.order_status,
        payment_status: order.payment_status,
        shipping_address: JSON.parse(order.shipping_address),
        billing_address: JSON.parse(order.billing_address),
        created_at: order.created_at,
        items: items
      }
    })

    return NextResponse.json({ orders: formattedOrders })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
