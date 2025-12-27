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
    const res = await fetch(`${strapiUrl}/api/products/${id}?populate[category]=true&populate[images]=true`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()

    // Transform Strapi response to match expected format
    const item = data.data
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      base_price: parseFloat(item.base_price || '0'),
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
      } : { name: 'General' },
      customizations: []
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
