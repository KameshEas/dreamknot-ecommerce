import { notFound } from 'next/navigation'
import ProductDetail from '@/components/ProductDetail'

interface Product {
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
  customizations: {
    id: number
    customization_type: string
    metadata: string
  }[]
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://api.dreamknot.co.in'
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
      original_price: parseFloat(item.original_price || item.discounted_price || 0),
      discounted_price: parseFloat(item.discounted_price || item.original_price || 0),
      ean: item.ean,
      upc: item.upc,
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
