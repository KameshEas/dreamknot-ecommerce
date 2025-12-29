import { notFound } from 'next/navigation'
import ProductDetail from '@/components/ProductDetail'

interface Product {
  id: number
  title: string
  description: string
  base_price: number
  images: string[]
  category: {
    name: string
  } | null
  customizations: {
    id: number
    customization_type: string
    metadata: string
  }[]
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://api.dreamknot.co.in'
    const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

    // Fetch from Strapi using filters like the API route does
    const response = await fetch(`${strapiUrl}/api/products?filters[id]=${id}&populate[category]=true&populate[images]=true`, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` })
      }
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    // Check if product exists
    if (!data.data || data.data.length === 0) {
      return null
    }

    // Transform Strapi response to match expected format
    const item = data.data[0]
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      base_price: parseFloat(item.base_price),
      images: item.images?.map((img: { url: string }) => {
        if (!img.url) return '/placeholder-product.jpg'
        if (img.url.startsWith('http://') || img.url.startsWith('https://')) {
          return img.url
        } else if (img.url.startsWith('/uploads/')) {
          return `${strapiUrl}${img.url}`
        } else {
          return `${strapiUrl}/uploads/${img.url}`
        }
      }) || ['/placeholder-product.jpg'],
      category: item.category ? {
        name: item.category.name
      } : null,
      customizations: [] // Will be handled separately if needed
    }
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return null
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  return {
    title: product ? `${product.title} - DreamKnot` : 'Product Not Found',
    description: product?.description || 'Personalized gifts and custom products'
  }
}
