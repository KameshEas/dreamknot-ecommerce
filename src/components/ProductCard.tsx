'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useWishlistStore } from '@/lib/wishlist-store'

interface Product {
  id: number
  title: string
  description: string
  base_price: number
  images: string[]
  category: {
    name: string
  } | null
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
        <div className="relative h-96 overflow-hidden bg-gray-50">
          <Image
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.title}
            fill
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
              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
              isWishlisted
                ? 'bg-deep-gold text-white shadow-lg'
                : 'bg-white/90 text-deep-gold border border-deep-gold/30 hover:bg-deep-gold hover:text-white'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>

          {/* Action Overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
            <div className="p-6 text-center">
              <button className="text-white font-playfair text-sm underline hover:no-underline transition-all duration-200">
                Quick Add
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-3">
          {/* Brand Name - Small, Uppercase */}
          {product.category && (
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {product.category.name}
            </p>
          )}

          {/* Product Name - Serif, Calm */}
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

          {/* Key benefits - 3 questions answered instantly */}
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
  )
}
