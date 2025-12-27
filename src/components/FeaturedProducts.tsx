'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products?featured=true&limit=4')

      if (!response.ok) {
        throw new Error('Failed to fetch featured products')
      }

      const data: ProductsResponse = await response.json()
      // Take only first 4 products for featured section
      setProducts(data.products.slice(0, 4))
    } catch (err) {
      console.error('Error fetching featured products:', err)
      // If no featured products available, show empty state
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-gray-100">
            <div className="w-full h-64 bg-gray-200 rounded-xl mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-full"></div>
              <div className="h-5 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Don't render anything if no featured products
  if (products.length === 0) {
    return null
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-playfair text-navy mb-4">
          Popular to Personalize
        </h2>
        <p className="text-lg text-gray-600 font-playfair max-w-2xl mx-auto">
          {"Start with one — we'll guide you through it."}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover-lift transition-all duration-300 cursor-pointer">
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-gray-50">
                <Image
                  src={product.images[0] || '/placeholder-product.jpg'}
                  alt={product.title}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />

                {/* Hover overlay with CTA */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <span className="bg-deep-gold text-white px-6 py-3 rounded-lg font-playfair font-semibold text-sm">
                      Personalize Now
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-3">
                {/* Category */}
                {product.category && (
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {product.category.name}
                  </p>
                )}

                {/* Product Name */}
                <h3 className="text-lg font-playfair text-navy leading-tight line-clamp-2">
                  {product.title}
                </h3>

                {/* Price with microcopy */}
                <div className="space-y-1">
                  <p className="text-xl font-playfair text-navy">
                    ₹{product.base_price.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 font-playfair">
                    Made after design approval
                  </p>
                </div>

                {/* Key benefits */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-600 font-playfair">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Preview before you buy
                  </div>
                  <div className="flex items-center text-xs text-gray-600 font-playfair">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Delivered in 24–48 hrs
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
