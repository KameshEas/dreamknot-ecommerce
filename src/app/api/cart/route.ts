import { NextRequest, NextResponse } from 'next/server'
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

interface CartItemData {
  id: number
  cart_id: number
  product_id: number
  customization: string | null
  qty: number
}

interface ProcessedCartItem {
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
    console.log('📋 Using cached products for cart')
    return productsCache
  }

  try {
    console.log('🔍 Fetching all products from Strapi for cart')

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

    console.log(`📡 Cart products API response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.log(`❌ Cart products API error: ${errorText}`)
      return []
    }

    const data = await response.json()
    const products = data.data || []

    console.log(`✅ Found ${products.length} products in Strapi for cart`)

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
    console.error('💥 Error fetching products from Strapi for cart:', error)
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

    // Get cart items without including Prisma products (since products come from Strapi)
    const cart = await prisma.cart.findFirst({
      where: { user_id: userId },
      include: {
        cart_items: true // Don't include product relation from Prisma
      }
    })

    if (!cart) {
      return NextResponse.json({
        id: null,
        items: [],
        total: 0
      })
    }

    // Fetch all products from Strapi once
    const allProducts = await fetchAllProductsFromStrapi()

    // Process cart items using Strapi products
    const processedItems = cart.cart_items.map((item: CartItemData) => {
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
        customization: item.customization,
        qty: item.qty,
        price: finalProduct.base_price * item.qty
      }
    })

    const total = processedItems.reduce((sum: number, item: ProcessedCartItem) => sum + item.price, 0)

    return NextResponse.json({
      id: cart.id,
      items: processedItems,
      total
    })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, customization, qty = 1 } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    // Find or create cart
    let cart = await prisma.cart.findFirst({
      where: { user_id: userId }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { user_id: userId }
      })
    }

    // Check if item already exists
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart.id,
        product_id: productId,
        customization: customization ? JSON.stringify(customization) : null
      }
    })

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { qty: existingItem.qty + qty }
      })
    } else {
      // Create new item
      await prisma.cartItem.create({
        data: {
          cart_id: cart.id,
          product_id: productId,
          customization: customization ? JSON.stringify(customization) : null,
          qty
        }
      })
    }

    return NextResponse.json({ message: 'Item added to cart' })
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserFromToken()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId, qty } = await request.json()

    if (!itemId || qty === undefined) {
      return NextResponse.json({ error: 'Item ID and quantity required' }, { status: 400 })
    }

    // Find cart
    const cart = await prisma.cart.findFirst({
      where: { user_id: userId }
    })

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
    }

    // Update item quantity
    if (qty <= 0) {
      // Remove item if quantity is 0 or less
      await prisma.cartItem.delete({
        where: { id: itemId }
      })
    } else {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { qty }
      })
    }

    return NextResponse.json({ message: 'Cart item updated' })
  } catch (error) {
    console.error('Update cart error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserFromToken()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId } = await request.json()

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    // Remove item from cart
    await prisma.cartItem.delete({
      where: { id: itemId }
    })

    return NextResponse.json({ message: 'Item removed from cart' })
  } catch (error) {
    console.error('Remove from cart error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
