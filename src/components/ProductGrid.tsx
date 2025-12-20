'use client'

import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

interface Product {
  id: number
  title: string
  description: string
  base_price: number
  images: string[]
  category: {
    name: string
  }
}

interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

interface ProductGridProps {
  search?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  sortBy?: string
}

export default function ProductGrid({ search, category, minPrice, maxPrice, sortBy }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [search, category, minPrice, maxPrice, sortBy])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (category) params.set('category', category)
      if (minPrice) params.set('minPrice', minPrice)
      if (maxPrice) params.set('maxPrice', maxPrice)
      if (sortBy) params.set('sortBy', sortBy)

      const response = await fetch(`/api/products?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data: ProductsResponse = await response.json()
      setProducts(data.products)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse border border-gray-100">
            <div className="w-full h-80 bg-gray-200 rounded-xl mb-4"></div>
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-10 bg-gray-200 rounded-full w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-playfair text-lg">Error loading products: {error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
