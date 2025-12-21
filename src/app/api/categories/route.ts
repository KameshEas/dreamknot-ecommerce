import { NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

export async function GET() {
  try {
    // Fetch categories from Strapi
    const response = await fetch(`${STRAPI_URL}/api/categories?sort=name:asc`, {
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
    const transformedCategories = data.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      created_at: item.createdAt
    }))

    return NextResponse.json({ categories: transformedCategories })
  } catch (error) {
    console.error('Categories fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
