import { NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL || 'http://api.dreamknot.co.in'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

interface StrapiCategory {
  id: number
  name: string
  createdAt: string
}

export async function GET() {
  try {
    // Check if we have a valid API token
    if (!STRAPI_API_TOKEN) {
      console.warn('STRAPI_API_TOKEN not configured, using fallback categories')

      // Fallback categories for development/demo
      const fallbackCategories = [
        { id: 1, name: 'Birthday', created_at: new Date().toISOString() },
        { id: 2, name: 'For Couples', created_at: new Date().toISOString() },
        { id: 3, name: 'Mugs', created_at: new Date().toISOString() },
        { id: 4, name: 'T-Shirts', created_at: new Date().toISOString() },
        { id: 5, name: 'Home & Garden', created_at: new Date().toISOString() }
      ]

      return NextResponse.json({ categories: fallbackCategories })
    }

    // Fetch categories from Strapi
    const response = await fetch(`${STRAPI_URL}/api/categories?sort=name:asc`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
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

    return NextResponse.json({ categories: transformedCategories })
  } catch (error) {
    console.error('Categories fetch error:', error)

    // Return fallback categories on any error
    const fallbackCategories = [
      { id: 1, name: 'Birthday', created_at: new Date().toISOString() },
      { id: 2, name: 'For Couples', created_at: new Date().toISOString() },
      { id: 3, name: 'Mugs', created_at: new Date().toISOString() },
      { id: 4, name: 'T-Shirts', created_at: new Date().toISOString() },
      { id: 5, name: 'Home & Garden', created_at: new Date().toISOString() }
    ]

    return NextResponse.json({ categories: fallbackCategories })
  }
}
