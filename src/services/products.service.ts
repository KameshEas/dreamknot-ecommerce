interface StrapiImage {
  url: string
}

interface StrapiProduct {
  id: number
  title: string
  description: string
  base_price: string
  createdAt: string
  category?: {
    id: number
    name: string
    createdAt: string
  }
  images?: StrapiImage[]
}

export interface Product {
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
  customizations: any[]
}

export interface ProductQuery {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'newest' | 'price-low' | 'price-high' | 'name'
  page?: number
  limit?: number
  featured?: boolean
}

export interface ProductResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export class ProductsService {
  private static readonly STRAPI_URL = process.env.STRAPI_URL || 'https://api.dreamknot.co.in'
  private static readonly STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

  static async getProducts(query: ProductQuery): Promise<ProductResponse> {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = 'newest',
      page = 1,
      limit = 12,
      featured
    } = query

    try {
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

      // Featured filter
      if (featured) {
        params.append('filters[featured][$eq]', 'true')
      }

      // Price range filter
      if (minPrice !== undefined) {
        params.append('filters[base_price][$gte]', minPrice.toString())
      }
      if (maxPrice !== undefined) {
        params.append('filters[base_price][$lte]', maxPrice.toString())
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
      const response = await fetch(`${this.STRAPI_URL}/api/products?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(this.STRAPI_API_TOKEN && { 'Authorization': `Bearer ${this.STRAPI_API_TOKEN}` })
        }
      })

      if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status}`)
      }

      const data = await response.json()

      // Transform Strapi response to match expected format
      const transformedProducts = data.data.map((item: StrapiProduct) => ({
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
            return `${this.STRAPI_URL}${img.url}`
          } else if (img.url.startsWith('/')) {
            // Local URL (mock data)
            return img.url
          } else {
            // Any other relative URL from Strapi
            return `${this.STRAPI_URL}/uploads/${img.url}`
          }
        }) || ['/placeholder-product.jpg'],
        created_at: item.createdAt,
        category: item.category ? {
          id: item.category.id,
          name: item.category.name,
          created_at: item.category.createdAt
        } : null,
        customizations: [] // Will be handled separately if needed
      }))

      const pagination = data.meta.pagination

      return {
        products: transformedProducts,
        pagination: {
          page: pagination.page,
          limit: pagination.pageSize,
          total: pagination.total,
          pages: pagination.pageCount
        }
      }
    } catch (error) {
      console.error('Strapi API error:', error)
      // Return fallback empty response when Strapi is unavailable
      return {
        products: [],
        pagination: {
          page: 1,
          limit: limit,
          total: 0,
          pages: 0
        }
      }
    }
  }

  static async getProductById(id: number): Promise<Product | null> {
    // This would need to be implemented based on how individual products are fetched
    // For now, we'll get all products and filter, but ideally Strapi has a single product endpoint
    const result = await this.getProducts({ limit: 1000 })
    return result.products.find(product => product.id === id) || null
  }
}
