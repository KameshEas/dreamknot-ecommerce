'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      if (isWishlisted) {
        // Remove from wishlist
        const response = await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: product.id })
        })

        if (response.ok) {
          setIsWishlisted(false)
        } else if (response.status === 401) {
          alert('Please log in to manage your wishlist')
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: product.id })
        })

        if (response.ok) {
          setIsWishlisted(true)
        } else if (response.status === 401) {
          alert('Please log in to add items to your wishlist')
        } else {
          const error = await response.json()
          if (error.error !== 'Product already in wishlist') {
            alert(error.error || 'Failed to add to wishlist')
          } else {
            setIsWishlisted(true)
          }
        }
      }
    } catch (error) {
      console.error('Wishlist error:', error)
      alert('Failed to update wishlist')
    }
  }

  return (
    <div className="group card-premium transform transition-all duration-700 hover:scale-105 hover:-translate-y-2 animate-fade-in touch-target relative overflow-hidden">
      {/* Premium background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-light-gold/20 via-transparent to-deep-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"></div>

      <div className="relative h-80 overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-50 to-white">
        <Image
          src={product.images[0] || '/placeholder-product.jpg'}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-110 transition-all duration-700 ease-out filter group-hover:brightness-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-product.jpg';
          }}
        />

        {/* Enhanced Category Badge with glassmorphism */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-navy font-playfair text-xs font-semibold rounded-full shadow-lg border border-white/20 group-hover:bg-white/95 transition-all duration-300">
            {product.category.name}
          </span>
        </div>

        {/* Premium Wishlist Button with enhanced effects */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={toggleWishlist}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl transform hover:scale-110 touch-target backdrop-blur-sm border border-white/30 group ${
              isWishlisted
                ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-red-200 hover:shadow-red-300'
                : 'bg-white/80 text-gray-700 hover:text-red-500 hover:bg-white/90 hover:shadow-2xl'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              className={`w-6 h-6 ${isWishlisted ? 'fill-current animate-pulse' : 'fill-none'} transition-all duration-300 group-hover:scale-110`}
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Enhanced Hover Overlay with premium styling */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-10">
          <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <Link href={`/products/${product.id}`} className="inline-block">
              <button className="px-8 py-4 bg-white/95 backdrop-blur-md text-navy font-playfair font-bold rounded-2xl hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-xl border border-white/20 hover:shadow-2xl">
                Customize Now
                <svg className="w-5 h-5 inline-block ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H7" />
                </svg>
              </button>
            </Link>
          </div>
        </div>

        {/* Premium shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmer"></div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-sans font-semibold text-gray-900 group-hover:text-navy transition-colors duration-300 line-clamp-2 leading-snug">
            {product.title}
          </h3>
          <p className="text-gray-600 font-sans text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-sans font-bold text-gray-900">
                ₹{product.base_price.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-sans">Starting from</p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600 font-sans font-medium">(4.9)</span>
          </div>
        </div>

        {/* Simplified Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-3 text-xs text-gray-600 font-sans">
            <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 rounded">
              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Custom</span>
            </div>
          </div>

          <Link href={`/products/${product.id}`}>
            <button className="px-4 py-2 bg-navy text-white font-sans text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 touch-target">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
