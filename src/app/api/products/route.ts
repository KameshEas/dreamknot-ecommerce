import { NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const categoryId = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Build Strapi query parameters
    const params = new URLSearchParams()

    // Populate relations
    params.append('populate[category]', 'true')
    params.append('populate[images]', 'true')

    // Search functionality
    if (search) {
      params.append('filters[$or][0][title][$containsi]', search)
      params.append('filters[$or][1][description][$containsi]', search)
    }

    // Category filter
    if (categoryId) {
      params.append('filters[category][id][$eq]', categoryId)
    }

    // Price range filter
    if (minPrice) {
      params.append('filters[base_price][$gte]', minPrice)
    }
    if (maxPrice) {
      params.append('filters[base_price][$lte]', maxPrice)
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        params.append('sort', 'base_price:asc')
        break
      case 'price-high':
        params.append('sort', 'base_price:desc')
        break
      case 'name':
        params.append('sort', 'title:asc')
        break
      case 'newest':
      default:
        params.append('sort', 'createdAt:desc')
        break
    }

    // Pagination
    params.append('pagination[page]', page.toString())
    params.append('pagination[pageSize]', limit.toString())

    // Fetch from Strapi
    const response = await fetch(`${STRAPI_URL}/api/products?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` })
      }
    })

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform Strapi response to match expected format
    const transformedProducts = data.data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      base_price: parseFloat(item.base_price),
      category_id: item.category?.id || null,
      images: item.images?.map((img: any) => `${STRAPI_URL}${img.url}`) || [],
      created_at: item.createdAt,
      category: item.category ? {
        id: item.category.id,
        name: item.category.name,
        created_at: item.category.createdAt
      } : null,
      customizations: [] // Will be handled separately if needed
    }))

    const pagination = data.meta.pagination

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page: pagination.page,
        limit: pagination.pageSize,
        total: pagination.total,
        pages: pagination.pageCount
      }
    })
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
