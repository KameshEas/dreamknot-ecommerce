'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Image from 'next/image'
import Link from 'next/link'
import SkeletonLoader from '@/components/SkeletonLoader'

interface OrderItem {
  id: number
  product: {
    id: number
    title: string
    images: string[]
  }
  customization: string | null
  qty: number
  price: number
}

interface Address {
  name: string
  address_line: string
  city: string
  state: string
  zip: string
  country: string
}

interface Order {
  id: number
  total_amount: number
  order_status: string
  payment_status: string
  shipping_address: Address
  billing_address: Address
  created_at: string
  items: OrderItem[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/user/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      } else if (response.status === 401) {
        alert('Please log in to view your orders')
      }
    } catch (error) {
      console.error('Fetch orders error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in_production': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'shipped': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '⏳'
      case 'processing': return '⚙️'
      case 'in_production': return '🎨'
      case 'shipped': return '🚚'
      case 'delivered': return '✅'
      case 'cancelled': return '❌'
      default: return '📋'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <SkeletonLoader type="list" count={3} className="max-w-2xl mx-auto" />
          <p className="text-navy font-sans mt-4">Loading your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Page Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <svg className="w-8 h-8 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h1 className="text-4xl font-great-vibes text-navy">Your Orders</h1>
          </div>
          <p className="text-lg text-gray-600 font-playfair">
            {orders.length > 0
              ? `Track and manage your ${orders.length} order${orders.length !== 1 ? 's' : ''}`
              : 'Your order history will appear here'
            }
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-3xl font-great-vibes text-navy mb-4">No orders yet</h2>
            <p className="text-gray-600 font-playfair mb-8 max-w-lg mx-auto leading-relaxed">
              Start your personalized gifting journey. Browse our collection and create
              meaningful gifts that will be cherished forever.
            </p>
            <Link href="/" className="px-8 py-4 bg-navy text-white font-playfair font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Orders List */}
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-xl font-playfair font-bold text-navy">
                            Order #{order.id.toString().padStart(6, '0')}
                          </h3>
                          <p className="text-gray-600 font-playfair text-sm mt-1">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.order_status)}`}>
                            <span className="mr-2">{getStatusIcon(order.order_status)}</span>
                            {order.order_status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-playfair font-bold text-navy">
                            ₹{order.total_amount.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500 font-playfair">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Content */}
                  <div className="p-6">
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="flex items-center justify-between w-full text-left font-playfair font-semibold text-navy hover:text-blue-600 transition-colors p-3 rounded-lg hover:bg-gray-50"
                    >
                      <span>
                        {expandedOrder === order.id ? 'Hide' : 'View'} Order Details
                      </span>
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${
                          expandedOrder === order.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {expandedOrder === order.id && (
                      <div className="mt-6 space-y-6">
                        {/* Order Items */}
                        <div>
                          <h4 className="text-lg font-great-vibes text-navy mb-4">Items Ordered</h4>
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                                  <Image
                                    src={item.product.images[0] || '/placeholder-product.jpg'}
                                    alt={item.product.title}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                  />
                                </div>
                                <div className="flex-grow">
                                  <h5 className="font-playfair font-semibold text-navy">{item.product.title}</h5>
                                  <p className="text-sm text-gray-600 font-playfair">Quantity: {item.qty}</p>
                                  {item.customization && (
                                    <div className="mt-2">
                                      <p className="text-xs text-gray-500 font-playfair mb-1">Customization:</p>
                                      <div className="bg-white px-3 py-1 rounded text-xs text-gray-800">
                                        {JSON.parse(item.customization).text || 'Custom design'}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-playfair font-bold text-navy">
                                    ₹{item.price.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-blue-50 rounded-xl p-6">
                          <h4 className="text-lg font-great-vibes text-navy mb-3">Shipping Address</h4>
                          <div className="text-gray-700 font-playfair text-sm leading-relaxed">
                            <div className="font-semibold">{order.shipping_address.name}</div>
                            <div>{order.shipping_address.address_line}</div>
                            <div>
                              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                            </div>
                            <div>{order.shipping_address.country}</div>
                          </div>
                        </div>

                        {/* Order Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                          <button className="px-6 py-3 bg-navy text-white font-playfair font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                            Track Order
                          </button>
                          <button className="px-6 py-3 border border-navy text-navy font-playfair font-semibold rounded-lg hover:bg-navy hover:text-white transition-colors">
                            Need Help?
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Help Section */}
            <div className="mt-12 text-center py-12 bg-gray-50 rounded-2xl">
              <h3 className="text-2xl font-great-vibes text-navy mb-4">Need Help with Your Orders?</h3>
              <p className="text-gray-600 font-playfair mb-6 max-w-md mx-auto">
                Our customer service team is here to help with any questions about your orders.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-navy text-white font-playfair font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  Contact Support
                </button>
                <button className="px-6 py-3 border border-navy text-navy font-playfair font-semibold rounded-lg hover:bg-navy hover:text-white transition-colors">
                  Shipping Info
                </button>
              </div>
            </div>
          </>
        )}
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
