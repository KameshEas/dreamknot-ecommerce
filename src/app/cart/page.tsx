'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface CartItem {
  id: number
  product: {
    id: number
    title: string
    images: string[]
    discounted_price: number
    original_price: number
  }
  customization: string | null
  qty: number
  price: number
}

interface Cart {
  id: number | null
  items: CartItem[]
  total: number
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart>({ id: null, items: [], total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setCart(data)
      } else if (response.status === 401) {
        toast.error('Please log in to view your cart')
      }
    } catch (error) {
      console.error('Fetch cart error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: number, newQty: number) => {
    if (newQty < 1) return

    try {
      const response = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, qty: newQty })
      })

      if (response.ok) {
        fetchCart() // Refresh cart data
      } else {
        toast.error('Failed to update quantity')
      }
    } catch (error) {
      console.error('Update quantity error:', error)
      toast.error('Failed to update quantity')
    }
  }

  const removeItem = async (itemId: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      })

      if (response.ok) {
        fetchCart() // Refresh cart data
      } else {
        toast.error('Failed to remove item')
      }
    } catch (error) {
      console.error('Remove item error:', error)
      toast.error('Failed to remove item')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-navy font-playfair">Loading your cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <Header />

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-playfair text-navy mb-4">Your Shopping Cart</h1>
          <p className="text-xl text-gray-600 font-playfair max-w-2xl mx-auto">
            {cart.items.length > 0
              ? `${cart.items.length} item${cart.items.length !== 1 ? 's' : ''} in your cart`
              : 'Your cart is waiting for amazing gifts'
            }
          </p>
        </div>

        {cart.items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-playfair text-navy mb-4">Your cart is empty</h2>
            <p className="text-gray-600 font-playfair mb-8 max-w-lg mx-auto leading-relaxed">
              Start creating personalized gifts that will bring joy to your loved ones.
              Browse our collection and add some magic to your cart.
            </p>
            <Link href="/" className="px-8 py-4 bg-navy text-white font-playfair font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-8 mb-16 animate-fade-in" style={{animationDelay: '0.2s'}}>
              {cart.items.map((item, index) => (
                <div key={item.id} className="card-premium group animate-slide-up" style={{animationDelay: `${0.1 * index}s`}}>
                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                      {/* Product Image */}
                      <div className="relative w-full lg:w-40 h-56 lg:h-40 flex-shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner">
                        <Image
                          src={item.product.images[0] || '/placeholder-product.jpg'}
                          alt={item.product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-all duration-500"
                          sizes="(max-width: 1024px) 100vw, 160px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow space-y-4">
                        <div>
                          <h3 className="text-2xl font-playfair font-bold text-navy mb-2 group-hover:text-deep-gold transition-colors duration-300">{item.product.title}</h3>

                          {item.customization && (
                            <div className="mb-4">
                              <p className="text-sm text-deep-gold font-playfair font-medium mb-2">✨ Your Customization:</p>
                              <div className="bg-gradient-subtle px-4 py-3 rounded-xl border border-deep-gold/20">
                                <p className="text-sm text-navy font-playfair italic">
                                  &quot;{JSON.parse(item.customization).text || "Custom design"}&quot;
                                </p>          
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <label className="text-sm font-sans font-semibold text-gray-700">Quantity:</label>
                            <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                              <button
                                onClick={() => updateQuantity(item.id, item.qty - 1)}
                                className="w-10 h-10 rounded-l-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 flex items-center justify-center touch-target"
                                aria-label="Decrease quantity"
                              >
                                <span className="text-lg font-sans font-light">−</span>
                              </button>
                              <span className="w-12 text-center font-sans font-semibold text-gray-900">{item.qty}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.qty + 1)}
                                className="w-10 h-10 rounded-r-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 flex items-center justify-center touch-target"
                                aria-label="Increase quantity"
                              >
                                <span className="text-lg font-sans font-light">+</span>
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 transition-all duration-200 p-3 rounded-xl hover:bg-red-50 transform hover:scale-105"
                            title="Remove item"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right lg:min-w-[150px]">
                        <div className="text-3xl font-playfair font-bold text-navy mb-1">
                          ₹{(item.price || 0).toFixed(2)}
                        </div>
                        <div className="text-sm text-deep-gold font-playfair font-medium">
                          ₹{((item.product?.discounted_price || item.product?.original_price) || 0).toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="card-premium p-8 mb-12 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-gold rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-great-vibes text-navy">Order Summary</h2>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-lg font-playfair text-dark-gray">Subtotal ({cart.items.length} item{cart.items.length !== 1 ? 's' : ''})</span>
                  <span className="text-xl font-playfair font-semibold text-navy">₹{(cart.total || 0).toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-lg font-playfair text-dark-gray">Shipping</span>
                  <span className="text-xl font-playfair font-semibold text-green-600">Free</span>
                </div>

                <div className="bg-gradient-subtle rounded-2xl p-6 border border-deep-gold/20">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-playfair font-bold text-navy">Total</span>
                    <span className="text-4xl font-playfair font-bold text-navy">₹{(cart.total || 0).toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-deep-gold font-playfair mt-2">Inclusive of all taxes</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in" style={{animationDelay: '0.5s'}}>
              <Link
                href="/checkout"
                className="btn-premium text-xl px-16 py-5 transform hover:scale-105 transition-all duration-300 text-center shadow-2xl"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/"
                className="px-16 py-5 border-3 border-navy text-navy font-playfair font-semibold text-xl rounded-2xl hover:bg-navy hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-center"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mt-16 pt-12 border-t border-gray-200 animate-fade-in" style={{animationDelay: '0.6s'}}>
              <div className="flex items-center space-x-3 glass-effect px-6 py-4 rounded-2xl border border-white/30">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-center">
                  <span className="block text-sm font-playfair font-semibold text-navy">Free Shipping</span>
                  <span className="text-xs text-dark-gray font-playfair">On all orders</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 glass-effect px-6 py-4 rounded-2xl border border-white/30">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-center">
                  <span className="block text-sm font-playfair font-semibold text-navy">Quality Guarantee</span>
                  <span className="text-xs text-dark-gray font-playfair">Premium materials</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 glass-effect px-6 py-4 rounded-2xl border border-white/30">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-center">
                  <span className="block text-sm font-playfair font-semibold text-navy">Fast Delivery</span>
                  <span className="text-xs text-dark-gray font-playfair">2-3 business days</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
