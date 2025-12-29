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

interface WishlistItemData {
  id: number
  user_id: number
  product_id: number
  created_at?: Date
}



async function getUserFromToken() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      console.log('No token found in cookies')
      return null
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set')
      return null
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: number }
    return decoded.userId
  } catch (error) {
    console.error('Error verifying JWT token:', error)
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
    console.log('📋 Using cached products')
    return productsCache
  }

  try {
    console.log('🔍 Fetching all products from Strapi for wishlist')

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

    console.log(`📡 Products API response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.log(`❌ Products API error: ${errorText}`)
      return []
    }

    const data = await response.json()
    const products = data.data || []

    console.log(`✅ Found ${products.length} products in Strapi`)

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
    console.error('💥 Error fetching products from Strapi:', error)
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

    // Get wishlist items without including Prisma products (since products come from Strapi)
    const wishlistItems = await prisma.wishlist.findMany({
      where: { user_id: userId }
    })

    // Fetch all products from Strapi once
    const allProducts = await fetchAllProductsFromStrapi()

    // Process wishlist items using the cached products
    const processedWishlist = await Promise.all(
      wishlistItems.map(async (item: WishlistItemData) => {
        // Find product in the cached products
        const product = findProductById(allProducts, item.product_id)

        // If product not found in Strapi, remove it from wishlist automatically
        if (!product) {
          console.log(`🗑️ Removing unavailable product ${item.product_id} from wishlist`)
          await prisma.wishlist.delete({
            where: { id: item.id }
          })
          return null // This will be filtered out
        }

        return {
          id: item.id,
          product: product,
          added_at: item.created_at || item.id
        }
      })
    )

    // Filter out null items (removed unavailable products)
    const validWishlist = processedWishlist.filter(item => item !== null)

    return NextResponse.json({
      wishlist: validWishlist
    })
  } catch (error) {
    console.error('Get wishlist error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromToken()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId } = await request.json()
    console.log(`➕ User ${userId} trying to add product ${productId} to wishlist`)

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    // Check if product exists (skip validation if no API token configured)
    if (STRAPI_API_TOKEN) {
      const allProducts = await fetchAllProductsFromStrapi()
      const strapiProduct = findProductById(allProducts, productId)
      if (!strapiProduct) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
    }
    // If no token configured, trust the frontend (products are validated on display)

    // Check if already in wishlist
    const existing = await prisma.wishlist.findFirst({
      where: {
        user_id: userId,
        product_id: productId
      }
    })

    if (existing) {
      return NextResponse.json({ error: 'Product already in wishlist' }, { status: 400 })
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        user_id: userId,
        product_id: productId
      }
    })

    return NextResponse.json({
      message: 'Added to wishlist',
      wishlistItem
    })
  } catch (error) {
    console.error('Add to wishlist error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserFromToken()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    // Remove from wishlist
    await prisma.wishlist.deleteMany({
      where: {
        user_id: userId,
        product_id: productId
      }
    })

    return NextResponse.json({ message: 'Removed from wishlist' })
  } catch (error) {
    console.error('Remove from wishlist error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
