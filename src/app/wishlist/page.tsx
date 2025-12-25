'use client'

import { useEffect, useState } from 'react'
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
    }
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
        alert('Please log in to view your wishlist')
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
        alert('Failed to remove from wishlist')
      }
    } catch (error) {
      console.error('Remove from wishlist error:', error)
      alert('Failed to remove from wishlist')
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
    <div className="min-h-screen bg-gradient-to-br from-off-white via-white to-light-gold/5">
      {/* Header */}
      <Header />

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Premium Page Header */}
        <div className="text-center mb-16 relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-1/4 w-20 h-20 border-2 border-red-400 rounded-full"></div>
            <div className="absolute bottom-10 right-1/4 w-16 h-16 border-2 border-deep-gold rounded-full"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-4 mb-6 animate-fade-in">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 via-pink-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl animate-float">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-gold rounded-full animate-glow"></div>
              </div>
              <h1 className="text-5xl md:text-6xl font-great-vibes text-navy">My Wishlist</h1>
            </div>
            <p className="text-xl text-gray-600 font-playfair max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {wishlist.length > 0
                ? `${wishlist.length} cherished item${wishlist.length !== 1 ? 's' : ''} saved for your perfect gift`
                : 'Save items you love for easy access later - your personalized collection awaits'
              }
            </p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <EmptyState type="wishlist" />
        ) : (
          <>
            {/* Premium Wishlist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {wishlist.map((item, index) => (
                <div key={item.id} className="group card-premium hover-lift animate-slide-up relative overflow-hidden" style={{ animationDelay: `${0.1 * index}s` }}>
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-pink-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                  <div className="relative h-64 overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-50 to-white">
                    <Image
                      src={item.product.images[0] || '/placeholder-product.jpg'}
                      alt={item.product.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-all duration-700 ease-out filter group-hover:brightness-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Enhanced Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-navy font-playfair text-xs font-semibold rounded-full shadow-lg border border-white/20 group-hover:bg-white/95 transition-all duration-300">
                        {item.product.category.name}
                      </span>
                    </div>

                    {/* Premium Remove Button */}
                    <div className="absolute top-4 right-4 z-20">
                      <button
                        onClick={() => removeFromWishlist(item.product.id)}
                        className="w-12 h-12 bg-white/80 backdrop-blur-sm text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 shadow-xl transform hover:scale-110 touch-target"
                        title="Remove from wishlist"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Enhanced Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/90 via-red-500/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-10">
                      <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex flex-col space-y-4">
                          <Link href={`/products/${item.product.id}`}>
                            <button className="px-8 py-4 bg-white/95 backdrop-blur-md text-navy font-playfair font-bold rounded-2xl hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-xl border border-white/20 hover:shadow-2xl">
                              Customize Now
                              <svg className="w-5 h-5 inline-block ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H7" />
                              </svg>
                            </button>
                          </Link>
                          <button
                            onClick={() => addToCart(item.product)}
                            className="px-8 py-4 border-2 border-white/90 text-white font-playfair font-semibold rounded-2xl hover:bg-white/20 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer"></div>
                    </div>
                  </div>

                  <div className="p-6 relative">
                    <h3 className="text-xl font-playfair font-bold text-navy mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                      {item.product.title}
                    </h3>
                    <p className="text-gray-600 font-playfair text-base mb-4 line-clamp-2 leading-relaxed">
                      {item.product.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-3xl font-playfair font-bold text-navy">
                          ₹{item.product.base_price.toFixed(2)}
                        </span>
                        <p className="text-sm text-deep-gold font-playfair font-medium">Starting price</p>
                      </div>

                      <Link href={`/products/${item.product.id}`}>
                        <button className="px-6 py-3 bg-gradient-to-br from-navy to-blue-700 text-white font-playfair text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                          View Details
                        </button>
                      </Link>
                    </div>

                    {/* Enhanced Added Date */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-gray-500 font-playfair">
                          Saved {new Date(item.added_at * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium Call to Action */}
            <div className="relative mt-16 mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-transparent to-pink-50/20 rounded-3xl"></div>

              <div className="relative z-10 text-center py-16 bg-gradient-to-br from-off-white to-white rounded-3xl shadow-xl border border-red-100/50">
                {/* Decorative elements */}
                <div className="absolute top-6 left-6 w-12 h-12 border-2 border-red-300/40 rounded-full"></div>
                <div className="absolute bottom-6 right-6 w-8 h-8 border-2 border-deep-gold/40 rounded-full"></div>

                <div className="max-w-2xl mx-auto px-8">
                  <h3 className="text-4xl md:text-5xl font-great-vibes text-navy mb-6">
                    Ready to <span className="text-transparent bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text">Customize?</span>
                  </h3>
                  <p className="text-lg text-gray-600 font-playfair mb-8 leading-relaxed">
                    Turn these cherished items into personalized gifts that will be treasured forever. Each piece tells a unique story.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/cart" className="btn-premium text-lg px-8 py-4 shadow-2xl hover:shadow-glow transform hover:scale-105 transition-all duration-500">
                      View Cart
                      <svg className="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </Link>
                    <Link href="/products" className="px-8 py-4 border-3 border-navy text-navy font-playfair font-semibold text-lg rounded-2xl hover:bg-navy hover:text-white transition-all duration-500 transform hover:scale-105 hover:shadow-xl">
                      Browse More Products
                    </Link>
                  </div>
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
              <h3 className="font-playfair font-bold text-white mb-6 text-lg">Products</h3>
              <ul className="space-y-3 text-gray-300 font-playfair">
                <li><Link href="/products" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Mugs</Link></li>
                <li><Link href="/products" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">T-Shirts</Link></li>
                <li><Link href="/products" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Pillows</Link></li>
                <li><Link href="/products" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Custom Items</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-playfair font-bold text-white mb-6 text-lg">Support</h3>
              <ul className="space-y-3 text-gray-300 font-playfair">
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Help Center</a></li>
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Shipping</a></li>
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Returns</a></li>
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-playfair font-bold text-white mb-6 text-lg">Company</h3>
              <ul className="space-y-3 text-gray-300 font-playfair">
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">About Us</a></li>
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Blog</a></li>
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Careers</a></li>
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Press</a></li>
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
