'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'
import { useWishlistStore } from '@/lib/wishlist-store'

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
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist, addLoading, removeLoading } = useWishlistStore()
  const [imageLoaded, setImageLoaded] = useState(false)
  const isWishlisted = isInWishlist(product.id)
  const isLoading = addLoading[product.id] || removeLoading[product.id]

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isWishlisted) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product.id)
    }
  }

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover-lift transition-all duration-300 cursor-pointer">
        {/* Image Container - Hero First */}
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden bg-gray-50">
          <Image
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.title}
            fill
            unoptimized={product.images[0]?.startsWith('http') ?? false}
            className="object-cover transition-all duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.jpg';
            }}
          />

          {/* Secondary image fade in on hover */}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={product.title}
              fill
                unoptimized={product.images[1]?.startsWith('http') ?? false}
              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-11 h-11 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 ${
              isWishlisted
                ? 'bg-deep-gold text-white shadow-lg'
                : 'bg-white/90 text-deep-gold border border-deep-gold/30 hover:bg-deep-gold hover:text-white'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              className="w-5 h-5 sm:w-5 sm:h-5 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>

          {/* Action Overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
            <div className="p-4 sm:p-6 text-center">
              <button
                onClick={async (e) => {
                  e.preventDefault()
                  e.stopPropagation()

                  try {
                    const response = await fetch('/api/cart', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        productId: product.id,
                        qty: 1
                      })
                    })

                    if (response.ok) {
                      toast.success('Added to cart successfully!')
                    } else if (response.status === 401) {
                      toast.error('Please log in to add items to cart')
                    } else {
                      const error = await response.json()
                      toast.error(`Error: ${error.error}`)
                    }
                  } catch (error) {
                    console.error('Add to cart error:', error)
                    toast.error('Failed to add to cart')
                  }
                }}
                className="text-white font-playfair text-sm underline hover:no-underline transition-all duration-200"
              >
                Quick Add
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
          {/* Brand Name - Small, Uppercase */}
          {product.category && (
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {product.category.name}
            </p>
          )}

          {/* Product Name */}
          <h3 className="text-lg font-playfair font-semibold text-navy leading-tight line-clamp-2">
            {product.title}
          </h3>

          {/* Price with microcopy */}
          <div className="space-y-1">
            {product.original_price && product.discounted_price && product.discounted_price < product.original_price && (
              <div className="flex items-center space-x-2">
                <span className="text-lg font-playfair text-gray-500 line-through">
                  ₹{product.original_price.toFixed(2)}
                </span>
                <span className="bg-deep-gold text-white px-2 py-1 text-xs font-playfair rounded">
                  {Math.round(((product.original_price - product.discounted_price) / product.original_price) * 100)}% OFF
                </span>
              </div>
            )}
            <p className="text-xl font-playfair font-semibold text-navy">
              ₹{(product.discounted_price || product.original_price || 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 font-playfair">
              {product.product_type === 'digital' ? 'Instant delivery' : 'Made after design approval'}
            </p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              {product.track_inventory && (
                <span className={`px-2 py-1 text-xs font-playfair rounded-full ${
                  product.stock_quantity <= product.low_stock_threshold 
                    ? 'bg-red-100 text-red-700' 
                    : product.stock_quantity === 0 && !product.allow_backorders
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {product.stock_quantity === 0 
                    ? (product.allow_backorders ? 'Backorder Available' : 'Out of Stock')
                    : product.stock_quantity <= product.low_stock_threshold
                    ? `${product.stock_quantity} in stock`
                    : 'In Stock'
                  }
                </span>
              )}
              {product.featured && (
                <span className="px-2 py-1 text-xs font-playfair bg-blue-100 text-blue-700 rounded-full">
                  Featured
                </span>
              )}
            </div>
            {product.delivery_option && (
              <span className="text-xs text-gray-500 font-playfair">
                {product.delivery_option === 'two_day' && '2-day delivery'}
                {product.delivery_option === 'standard' && 'Standard delivery'}
                {product.delivery_option === 'express' && 'Express delivery'}
              </span>
            )}
          </div>

          {/* Key benefits */}
          <div className="space-y-2 pt-3 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-600 font-playfair">
              <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Preview before you buy
            </div>
            <div className="flex items-center text-xs text-gray-600 font-playfair">
              <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Delivered in 24–48 hrs
            </div>
            {product.requires_shipping && (
              <div className="flex items-center text-xs text-gray-600 font-playfair">
                <svg className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Ships worldwide
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
