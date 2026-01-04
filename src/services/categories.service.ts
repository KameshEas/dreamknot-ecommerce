interface StrapiCategory {
  id: number
  name: string
  createdAt: string
}

export interface Category {
  id: number
  name: string
  created_at: string
}

export interface CategoriesResponse {
  categories: Category[]
}

export class CategoriesService {
  private static readonly STRAPI_URL = process.env.STRAPI_URL || 'https://api.dreamknot.co.in'
  private static readonly STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

  // Fallback categories for development/demo
  private static readonly FALLBACK_CATEGORIES: Category[] = [
    { id: 1, name: 'Birthday', created_at: new Date().toISOString() },
    { id: 2, name: 'For Couples', created_at: new Date().toISOString() },
    { id: 3, name: 'Mugs', created_at: new Date().toISOString() },
    { id: 4, name: 'T-Shirts', created_at: new Date().toISOString() },
    { id: 5, name: 'Home & Garden', created_at: new Date().toISOString() }
  ]

  static async getCategories(): Promise<CategoriesResponse> {
    // Check if we have a valid API token
    if (!this.STRAPI_API_TOKEN) {
      console.warn('STRAPI_API_TOKEN not configured, using fallback categories')
      return { categories: this.FALLBACK_CATEGORIES }
    }

    try {
      // Fetch categories from Strapi
      const response = await fetch(`${this.STRAPI_URL}/api/categories?sort=name:asc`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.STRAPI_API_TOKEN}`
        }
      })

      if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status}`)
      }

      const data = await response.json()

      // Transform Strapi response to match expected format
      const transformedCategories = data.data.map((item: StrapiCategory) => ({
        id: item.id,
        name: item.name,
        created_at: item.createdAt
      }))

      return { categories: transformedCategories }
    } catch (error) {
      console.error('Categories fetch error:', error)
      // Return fallback categories on any error
      return { categories: this.FALLBACK_CATEGORIES }
    }
  }

  static async getCategoryById(id: number): Promise<Category | null> {
    const result = await this.getCategories()
    return result.categories.find(category => category.id === id) || null
  }
}
