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
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    fetchProducts()
  }, [search, category, minPrice, maxPrice, sortBy]) // eslint-disable-line react-hooks/exhaustive-deps

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
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse border border-gray-100" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="w-full h-96 bg-gray-200 rounded-xl mb-4"></div>
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
      <div className="text-center py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-playfair text-navy mb-2">Products Temporarily Unavailable</h3>
          <p className="text-gray-600 font-playfair text-sm mb-6">
            {"We're working on getting your personalized products ready. Please check back soon!"}
          </p>
          <button
            onClick={() => {
              setError(null)
              setRetryCount(prev => prev + 1)
              fetchProducts()
            }}
            className="bg-navy text-white px-6 py-3 rounded-lg font-playfair text-sm hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
