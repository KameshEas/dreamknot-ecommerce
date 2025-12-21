'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ProductReviews from './ProductReviews'
import Header from './Header'

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

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [customizations, setCustomizations] = useState<Record<string, any>>({})
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleCustomizationChange = (type: string, value: any) => {
    setCustomizations(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      if (isWishlisted) {
        const response = await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        })
        if (response.ok) setIsWishlisted(false)
      } else {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        })
        if (response.ok) setIsWishlisted(true)
      }
    } catch (error) {
      console.error('Wishlist error:', error)
    }
  }

  const handleAddToCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customization: customizations,
          qty: quantity
        })
      })

      if (response.ok) {
        alert('Added to cart successfully!')
      } else if (response.status === 401) {
        alert('Please log in to add items to cart')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      alert('Failed to add to cart')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="text-sm text-gray-500 font-playfair">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="#products" className="hover:text-navy transition-colors">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
              <Image
                src={product.images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-navy' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              {product.category && (
                <div className="flex items-center space-x-3 mb-3">
                  <span className="px-3 py-1 bg-gray-100 text-navy font-playfair text-xs font-medium rounded-full">
                    {product.category.name}
                  </span>
                </div>
              )}
              <h1 className="text-4xl font-great-vibes text-navy mb-4 leading-tight">
                {product.title}
              </h1>
              <p className="text-lg text-gray-600 font-playfair leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-4xl font-playfair font-bold text-navy">
                  ₹{product.base_price.toFixed(2)}
                </span>
                <p className="text-sm text-gray-500 font-playfair mt-1">Starting price</p>
              </div>

              <button
                onClick={toggleWishlist}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isWishlisted
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            </div>

            {/* Customizations */}
            {product.customizations.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-great-vibes text-navy">Customize Your Item</h3>
                <div className="space-y-5">
                  {product.customizations.map((customization) => {
                    const metadata = JSON.parse(customization.metadata)
                    return (
                      <div key={customization.id} className="space-y-2">
                        <label className="block text-sm font-playfair font-semibold text-navy capitalize">
                          {customization.customization_type === 'text' ? 'Add Your Text' : 'Upload Your Image'}
                        </label>

                        {customization.customization_type === 'text' && (
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Enter your custom text here..."
                              maxLength={metadata.maxLength || 100}
                              onChange={(e) => handleCustomizationChange(customization.customization_type, e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                            />
                            <p className="text-xs text-gray-500 font-playfair">
                              Maximum {metadata.maxLength || 100} characters
                            </p>
                          </div>
                        )}

                        {customization.customization_type === 'image' && (
                          <div className="space-y-2">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-navy transition-colors">
                              <input
                                type="file"
                                accept={metadata.supportedFormats?.join(',') || 'image/*'}
                                onChange={(e) => handleCustomizationChange(customization.customization_type, e.target.files?.[0])}
                                className="hidden"
                                id={`file-${customization.id}`}
                              />
                              <label
                                htmlFor={`file-${customization.id}`}
                                className="cursor-pointer block"
                              >
                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span className="text-sm font-playfair text-gray-600">Click to upload your image</span>
                                <p className="text-xs text-gray-500 font-playfair mt-1">
                                  {metadata.supportedFormats ? `Supports: ${metadata.supportedFormats.join(', ')}` : 'JPG, PNG, SVG supported'}
                                </p>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <label className="block text-sm font-playfair font-semibold text-navy">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-playfair">-</span>
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg font-playfair text-center focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-playfair">+</span>
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-t border-gray-200">
                <span className="text-lg font-playfair text-gray-600">Total:</span>
                <span className="text-2xl font-playfair font-bold text-navy">
                  ₹{(product.base_price * quantity).toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-navy text-white font-playfair font-semibold text-lg rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add to Cart
              </button>

              <div className="text-center">
                <Link href="/cart" className="text-navy hover:text-blue-600 font-playfair text-sm transition-colors">
                  View Cart →
                </Link>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex justify-center items-center space-x-6 pt-8 border-t border-gray-100">
              <div className="text-center">
                <svg className="w-6 h-6 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs text-gray-500 font-playfair">Free Shipping</span>
              </div>
              <div className="text-center">
                <svg className="w-6 h-6 text-blue-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-gray-500 font-playfair">Quality Guarantee</span>
              </div>
              <div className="text-center">
                <svg className="w-6 h-6 text-purple-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-gray-500 font-playfair">Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 border-t border-gray-100">
        <ProductReviews productId={product.id} />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-navy font-great-vibes text-sm">D</span>
                </div>
                <span className="text-xl font-great-vibes">DreamKnot</span>
              </div>
              <p className="text-gray-400 font-playfair text-sm leading-relaxed">
                Making personalized gifts simple, beautiful, and meaningful.
              </p>
            </div>

            <div>
              <h3 className="font-playfair font-semibold text-white mb-4">Products</h3>
              <ul className="space-y-2 text-gray-400 font-playfair text-sm">
                <li><a href="#products" className="hover:text-white transition-colors">Mugs</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">T-Shirts</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">Pillows</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">Custom Items</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-playfair font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 font-playfair text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-playfair font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 font-playfair text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 font-playfair text-sm">
              &copy; 2025 DreamKnot. Made with love for personalized gifting.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
