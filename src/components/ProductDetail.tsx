'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ProductReviews from './ProductReviews'
import Header from './Header'
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
  customizations: {
    id: number
    customization_type: string
    metadata: string
  }[]
}

type CustomizationValue = string | File | undefined

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist, addLoading, removeLoading } = useWishlistStore()
  const [selectedImage, setSelectedImage] = useState(0)
  const [customizations, setCustomizations] = useState<Record<string, CustomizationValue>>({})
  const [quantity, setQuantity] = useState(1)
  const isWishlisted = isInWishlist(product.id)
  const isLoading = addLoading[product.id] || removeLoading[product.id]

  const handleCustomizationChange = (type: string, value: CustomizationValue) => {
    setCustomizations(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isWishlisted) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product.id)
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
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="text-sm text-gray-500 font-playfair">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-navy transition-colors">Products</Link>
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
                unoptimized={(product.images[selectedImage] || '').startsWith('http')}
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
                      unoptimized={image.startsWith('http')}
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
              <h1 className="text-4xl font-playfair text-navy mb-4 leading-tight">
                {product.title}
              </h1>
              <p className="text-lg text-gray-600 font-playfair leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-4xl font-playfair font-bold text-navy">
                    ₹{product.base_price.toFixed(2)}
                  </span>
                  <div className="space-y-1 mt-1">
                    <p className="text-sm text-gray-500 font-playfair">Made to order</p>
                    <p className="text-sm text-gray-500 font-playfair">Printed after approval</p>
                    <p className="text-sm text-gray-500 font-playfair">Handled with care</p>
                  </div>
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
            </div>

            {/* Live Preview */}
            <div className="space-y-6">
              <div className="bg-off-white rounded-2xl p-6">
                <h3 className="text-2xl font-playfair text-navy mb-4">Live Preview</h3>
                <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300 min-h-32 flex items-center justify-center">
                  <div className="text-center text-gray-500 font-playfair">
                    <p className="text-lg mb-2">{"Your text here"}</p>
                    <p className="text-sm">This is how your personalization will appear</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customizations */}
            {product.customizations.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-playfair text-navy">Customize Your Item</h3>
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
                              Maximum {metadata.maxLength || 100} characters • Preview updates automatically
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

            {/* Share Preview Hook - Hidden until design and preview feature is implemented */}
            <div className="space-y-6 hidden">
              <div className="bg-deep-gold/10 rounded-2xl p-6 text-center">
                <h3 className="text-2xl font-playfair text-navy mb-4">This looks great — want to share a preview?</h3>
                <p className="text-gray-600 font-playfair mb-6">
                  {"Show friends and family exactly what you're planning to gift them"}
                </p>
                <div className="flex justify-center space-x-4">
                  <button className="bg-navy text-white font-playfair px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    📱 Share Preview
                  </button>
                  <button className="bg-white border border-navy text-navy font-playfair px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                    💬 Send via WhatsApp
                  </button>
                </div>
              </div>
            </div>

            {/* Why This Gift Works */}
            <div className="space-y-6">
              <h3 className="text-2xl font-playfair text-navy">Why This {product.title} Makes a Great Gift</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-playfair text-gray-700">Soft, premium fabric</p>
                    <p className="text-sm text-gray-500 font-playfair">Feels great and lasts wash after wash</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-playfair text-gray-700">{"Design doesn't fade after washing"}</p>
                    <p className="text-sm text-gray-500 font-playfair">High-quality printing that stays vibrant</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-playfair text-gray-700">Looks good even without customization</p>
                    <p className="text-sm text-gray-500 font-playfair">Beautiful on its own or personalized</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-800 font-playfair">
                  <strong>Note:</strong> {"Personalized items can't be returned — so we make sure you love it before it's made."}
                </p>
              </div>
            </div>

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
      <footer className="bg-navy text-white py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/logo.svg"
                  alt="DreamKnot Logo"
                  width={32}
                  height={32}
                />
                <span className="text-xl font-playfair">DreamKnot</span>
              </div>
              <p className="text-gray-300 font-playfair text-sm leading-relaxed">
                Making personalized gifts simple, beautiful, and meaningful.
              </p>
            </div>

            <div>
              <h3 className="font-playfair font-semibold text-white mb-4">Products</h3>
              <ul className="space-y-2 text-gray-300 font-playfair text-sm">
                <li><Link href="/products" className="hover:text-white transition-colors">Mugs</Link></li>
                <li><Link href="/products" className="hover:text-white transition-colors">T-Shirts</Link></li>
                <li><Link href="/products" className="hover:text-white transition-colors">Pillows</Link></li>
                <li><Link href="/products" className="hover:text-white transition-colors">Custom Items</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-playfair font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300 font-playfair text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-playfair font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300 font-playfair text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-300 font-playfair text-sm">
              &copy; 2025 DreamKnot. Made with love for personalized gifting.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
