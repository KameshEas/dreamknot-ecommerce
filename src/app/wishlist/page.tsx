'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import EmptyState from '@/components/EmptyState'

interface WishlistItem {
  id: number
  product: {
    id: number
    title: string
    description: string
    base_price: number
    images: string[]
    category: {
      name: string
    } | null
  }
  added_at: number
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist')
      if (response.ok) {
        const data = await response.json()
        setWishlist(data.wishlist)
      } else if (response.status === 401) {
        toast.error('Please log in to view your wishlist')
      }
    } catch (error) {
      console.error('Fetch wishlist error:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: number) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      if (response.ok) {
        setWishlist(wishlist.filter(item => item.product.id !== productId))
      } else {
        toast.error('Failed to remove from wishlist')
      }
    } catch (error) {
      console.error('Remove from wishlist error:', error)
      toast.error('Failed to remove from wishlist')
    }
  }

  const addToCart = async (product: WishlistItem['product']) => {
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
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-navy font-playfair">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <Header />

      {/* Hero Section - Landing Page Style */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-playfair font-bold text-navy mb-6 leading-tight">
            Your Saved Treasures
          </h1>
          <p className="text-lg text-gray-600 font-playfair leading-relaxed mb-8">
            {wishlist.length > 0
              ? `You have ${wishlist.length} cherished item${wishlist.length !== 1 ? 's' : ''} saved for the perfect moment`
              : 'Save items you love for easy access later. Your personalized collection awaits.'
            }
          </p>
          {wishlist.length > 0 && (
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 font-playfair">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>All items saved securely</span>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {wishlist.length === 0 ? (
          <EmptyState type="wishlist" />
        ) : (
          <>
            {/* Clean Product Grid - Landing Page Style */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {wishlist.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    {/* Product Image */}
                    <div className="relative h-64 bg-gray-50">
                      <Image
                        src={item.product.images[0] || '/next.svg'}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />

                      {/* Category Badge */}
                      {item.product.category && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-navy font-playfair text-xs font-semibold rounded-full border border-white/20">
                            {item.product.category.name}
                          </span>
                        </div>
                      )}

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromWishlist(item.product.id)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg"
                        title="Remove from wishlist"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-playfair font-semibold text-navy mb-3 line-clamp-2">
                        {item.product.title}
                      </h3>
                      <p className="text-gray-600 font-playfair text-sm mb-4 line-clamp-2 leading-relaxed">
                        {item.product.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-playfair font-bold text-navy">
                            ₹{(item.product.base_price || 0).toFixed(2)}
                          </span>
                          <p className="text-xs text-gray-500 font-playfair">Starting price</p>
                        </div>

                        <Link href={`/products/${item.product.id}`}>
                          <button className="px-4 py-2 bg-navy text-white font-playfair text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                            View Details
                          </button>
                        </Link>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <Link href={`/products/${item.product.id}`}>
                          <button className="w-full py-3 bg-gradient-to-r from-deep-gold to-navy text-white font-playfair font-semibold rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]">
                            Customize Now
                          </button>
                        </Link>
                        <button
                          onClick={() => addToCart(item.product)}
                          className="w-full py-3 border-2 border-navy text-navy font-playfair font-semibold rounded-lg hover:bg-navy hover:text-white transition-all duration-300"
                        >
                          Add to Cart
                        </button>
                      </div>

                      {/* Trust Message */}
                      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-500 font-playfair">
                          Preview before you buy • Easy edits • Fast delivery
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action Section */}
            <div className="mt-16 text-center">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-4xl mx-auto">
                <h3 className="text-3xl lg:text-4xl font-playfair text-navy mb-6">
                  Ready to Turn These Into Gifts?
                </h3>
                <p className="text-lg text-gray-600 font-playfair mb-8 leading-relaxed">
                  {"Personalize your saved items in minutes. You'll see exactly how they look before checkout."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/products" className="px-8 py-4 bg-navy text-white font-playfair font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    Browse All Products
                  </Link>
                  <Link href="/gift-finder" className="px-8 py-4 border-2 border-navy text-navy font-playfair font-semibold rounded-lg hover:bg-navy hover:text-white transition-colors">
                    Find a Gift They Love
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Premium Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 mt-24 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-deep-gold rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-light-gold rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border-2 border-white/30 rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center shadow-xl">
                    <span className="text-navy font-great-vibes text-lg">D</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-gold rounded-full animate-float"></div>
                </div>
                <span className="text-2xl font-great-vibes text-white">DreamKnot</span>
              </div>
              <p className="text-gray-300 font-playfair text-base leading-relaxed mb-6">
                Making personalized gifts simple, beautiful, and meaningful for every special moment.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.84-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.012.017z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.84-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.012.017z"/>
                  </svg>
                </div>
              </div>
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
              <h3 className="font-playfair font-semibold text-white mb-4 text-sm">Support</h3>
              <ul className="space-y-2 text-gray-300 font-playfair text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-playfair font-semibold text-white mb-4 text-sm">Company</h3>
              <ul className="space-y-2 text-gray-300 font-playfair text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 font-playfair text-base">
              &copy; 2025 DreamKnot. Made with <span className="text-red-400 animate-pulse">♥</span> for personalized gifting.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
