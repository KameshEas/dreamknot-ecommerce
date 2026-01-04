import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL || 'https://api.dreamknot.co.in'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

interface StrapiImage {
  url: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = parseInt(id)

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    // Fetch from Strapi
    const response = await fetch(`${STRAPI_URL}/api/products?filters[id]=${productId}&populate[category]=true&populate[images]=true`, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` })
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      throw new Error(`Strapi API error: ${response.status}`)
    }

    const data = await response.json()

    // Check if product exists
    if (!data.data || data.data.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Transform Strapi response to match expected format
    const item = data.data[0]
    const product = {
      id: item.id,
      title: item.title,
      description: item.description,
      base_price: parseFloat(item.base_price),
      category_id: item.category?.id || null,
      images: item.images?.map((img: StrapiImage) => {
        // Handle different URL formats from Strapi
        if (!img.url) return '/placeholder-product.jpg'

        if (img.url.startsWith('http://') || img.url.startsWith('https://')) {
          // Already a full URL
          return img.url
        } else if (img.url.startsWith('/uploads/')) {
          // Strapi relative URL - convert to full URL
          return `${STRAPI_URL}${img.url}`
        } else if (img.url.startsWith('/')) {
          // Local URL (mock data)
          return img.url
        } else {
          // Any other relative URL from Strapi
          return `${STRAPI_URL}/uploads/${img.url}`
        }
      }) || ['/placeholder-product.jpg'],
      created_at: item.createdAt,
      category: item.category ? {
        id: item.category.id,
        name: item.category.name,
        created_at: item.category.createdAt
      } : null,
      customizations: [] // Will be handled separately if needed
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
