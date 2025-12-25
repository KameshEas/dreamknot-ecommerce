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
  }
  customizations: {
    id: number
    customization_type: string
    metadata: string
  }[]
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

    const res = await fetch(
      `${baseUrl}/api/products/${id}?populate=*`,
      { cache: 'no-store' }
    )

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data.product
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
