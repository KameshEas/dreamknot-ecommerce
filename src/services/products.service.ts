interface StrapiImage {
  url: string
}

interface StrapiProduct {
  id: number
  title: string
  description: string
  discounted_price: number
  original_price: number
  ean?: string
  upc?: string
  createdAt: string
  category?: {
    id: number
    name: string
    createdAt: string
  }
  images?: StrapiImage[]
  averageRating?: number
  reviewCount?: number
  featured?: boolean
  slug?: string
  delivery_option?: 'two_day' | 'standard' | 'express' | null
  stock_quantity?: number
  is_available?: boolean
  sku?: string
  weight?: number
  weight_unit?: 'kg' | 'g' | 'lb' | 'oz' | null
  dimensions?: string
  low_stock_threshold?: number
  allow_backorders?: boolean
  track_inventory?: boolean
  product_type?: 'physical' | 'digital' | 'service'
  requires_shipping?: boolean
  taxable?: boolean
  tags?: string
  meta_description?: string
  meta_keywords?: string
}

export interface Product {
  id: number
  title: string
  description: string
  original_price: number
  discounted_price: number
  ean?: string
  upc?: string
  images: string[]
  category: {
    id: number
    name: string
  } | null
  slug: string
  featured: boolean
  delivery_option: 'two_day' | 'standard' | 'express' | null
  stock_quantity: number
  is_available: boolean
  sku: string
  weight?: number
  weight_unit: 'kg' | 'g' | 'lb' | 'oz' | null
  dimensions?: string
  low_stock_threshold: number
  allow_backorders: boolean
  track_inventory: boolean
  averageRating: number
  reviewCount: number
  product_type: 'physical' | 'digital' | 'service'
  requires_shipping: boolean
  taxable: boolean
  tags?: string
  meta_description?: string
  meta_keywords?: string
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
        params.append('filters[discounted_price][$gte]', minPrice.toString())
      }
      if (maxPrice !== undefined) {
        params.append('filters[discounted_price][$lte]', maxPrice.toString())
      }

      // Sorting
      switch (sortBy) {
        case 'price-low':
          params.append('sort', 'discounted_price:asc')
          break
        case 'price-high':
          params.append('sort', 'discounted_price:desc')
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
        original_price: parseFloat(item.original_price?.toString() || item.discounted_price.toString()),
        discounted_price: parseFloat(item.discounted_price.toString()),
        ean: item.ean,
        upc: item.upc,
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
        category: item.category ? {
          id: item.category.id,
          name: item.category.name
        } : null,
        slug: item.slug || '',
        featured: item.featured || false,
        delivery_option: item.delivery_option || null,
        stock_quantity: item.stock_quantity || 0,
        is_available: item.is_available || true,
        sku: item.sku || '',
        weight: item.weight,
        weight_unit: item.weight_unit || null,
        dimensions: item.dimensions,
        low_stock_threshold: item.low_stock_threshold || 5,
        allow_backorders: item.allow_backorders || false,
        track_inventory: item.track_inventory || true,
        averageRating: item.averageRating || 0,
        reviewCount: item.reviewCount || 0,
        product_type: item.product_type || 'physical',
        requires_shipping: item.requires_shipping || true,
        taxable: item.taxable || true,
        tags: item.tags,
        meta_description: item.meta_description,
        meta_keywords: item.meta_keywords,
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
