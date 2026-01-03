'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Header from '@/components/Header'
import Image from 'next/image'
import Link from 'next/link'
import SkeletonLoader from '@/components/SkeletonLoader'
import EmptyState from '@/components/EmptyState'

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
        toast.error('Please log in to view your orders')
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

  const getStatusExplanation = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'Payment confirmation in progress'
      case 'processing': return 'Design review & preparation in progress'
      case 'in_production': return 'Your gift is being crafted with care'
      case 'shipped': return 'On its way to you!'
      case 'delivered': return 'Enjoy your personalized gift!'
      case 'cancelled': return 'Order was cancelled'
      default: return 'Order status being updated'
    }
  }

  const getPrimaryAction = (status: string, orderId: number) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { text: 'Contact Support', href: '#', icon: '💬' }
      case 'processing':
        return { text: 'Design in Review', href: '#', icon: '👁️', disabled: true }
      case 'in_production':
        return { text: 'In Production', href: '#', icon: '🎨', disabled: true }
      case 'shipped':
        return { text: 'Shipped', href: '#', icon: '🚚', disabled: true }
      case 'delivered':
        return { text: 'Leave Review', href: `/orders/${orderId}/review`, icon: '⭐' }
      default:
        return { text: 'Contact Support', href: '#', icon: '💬' }
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
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <Header />

      {/* Hero Section - Landing Page Style */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-playfair font-bold text-navy mb-6 leading-tight">
            Your Order History
          </h1>
          <p className="text-lg text-gray-600 font-playfair leading-relaxed mb-8">
            {orders.length > 0
              ? 'Track and manage every personalized gift you\'ve ordered'
              : 'Your personalized gifts will appear here once you place your first order'
            }
          </p>
          {orders.length > 0 && (
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 font-playfair">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>All orders processed with care</span>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {orders.length === 0 ? (
          <EmptyState type="orders" />
        ) : (
          <>
            {/* Orders List */}
            <div className="max-w-4xl mx-auto space-y-8">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Order Header */}
                  <div className="p-8 border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div>
                        <h3 className="text-2xl font-playfair font-bold text-navy mb-2">
                          Order #{order.id.toString().padStart(6, '0')}
                        </h3>
                        <p className="text-gray-600 font-playfair">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                        <div className="flex flex-col items-start gap-2">
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.order_status)}`}>
                            <span className="mr-2">{getStatusIcon(order.order_status)}</span>
                            {order.order_status.replace('_', ' ').toUpperCase()}
                          </span>
                          <p className="text-xs text-gray-600 font-playfair max-w-xs">
                            {getStatusExplanation(order.order_status)}
                          </p>
                          {/* Progress Indicator */}
                          <div className="flex items-center space-x-2 text-xs text-gray-500 font-playfair">
                            <span className={`px-2 py-1 rounded ${order.order_status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>Design Review</span>
                            <span className="text-gray-300">→</span>
                            <span className={`px-2 py-1 rounded ${order.order_status === 'in_production' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100'}`}>Production</span>
                            <span className="text-gray-300">→</span>
                            <span className={`px-2 py-1 rounded ${order.order_status === 'shipped' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100'}`}>Shipping</span>
                            <span className="text-gray-300">→</span>
                            <span className={`px-2 py-1 rounded ${order.order_status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100'}`}>Delivered</span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="text-right">
                            <div className="text-3xl font-playfair font-bold text-navy">
                              ₹{order.total_amount.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500 font-playfair">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </div>
                          </div>

                          {/* Primary Action Button - Made more subtle */}
                          <div className="flex flex-col gap-2">
                            {(() => {
                              const action = getPrimaryAction(order.order_status, order.id)
                              return action.disabled ? (
                                <div className="px-3 py-2 bg-gray-200 text-gray-500 font-playfair font-medium rounded-md text-xs flex items-center gap-2 cursor-not-allowed">
                                  <span>{action.icon}</span>
                                  <span>{action.text}</span>
                                </div>
                              ) : (
                                <Link
                                  href={action.href}
                                  className="px-3 py-2 bg-deep-gold/80 text-navy font-playfair font-medium rounded-md hover:bg-deep-gold transition-all duration-300 text-xs flex items-center gap-2"
                                >
                                  <span>{action.icon}</span>
                                  <span>{action.text}</span>
                                </Link>
                              )
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-8">
                    <div className="space-y-4 mb-6">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex items-center space-x-6 p-4 bg-off-white rounded-xl">
                          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                            <Image
                              src={item.product.images[0] || '/next.svg'}
                              alt={item.product.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-playfair font-semibold text-navy">{item.product.title}</h4>
                            <p className="text-sm text-gray-600 font-playfair">Quantity: {item.qty}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-playfair font-bold text-navy">₹{item.price.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-center text-gray-500 font-playfair text-sm">
                          +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>

                    {/* Expandable Details */}
                    <div className="border-t border-gray-100 pt-6">
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="flex items-center justify-between w-full text-left font-playfair font-semibold text-navy hover:text-blue-600 transition-colors"
                      >
                        <span>
                          {expandedOrder === order.id ? 'Hide Details' : 'View Order Details'}
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
                          {/* All Order Items */}
                          <div>
                            <h4 className="text-xl font-playfair text-navy mb-4">All Items</h4>
                            <div className="space-y-4">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center space-x-6 p-4 bg-off-white rounded-xl">
                                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                                    <Image
                                      src={item.product.images[0] || '/next.svg'}
                                      alt={item.product.title}
                                      fill
                                      className="object-cover"
                                      sizes="80px"
                                    />
                                  </div>
                                  <div className="flex-grow">
                                    <h5 className="font-playfair font-semibold text-navy text-lg">{item.product.title}</h5>
                                    <p className="text-gray-600 font-playfair">Quantity: {item.qty}</p>
                                    {item.customization && (
                                      <div className="mt-2">
                                        <p className="text-xs text-gray-500 font-playfair mb-1">Customization:</p>
                                        <div className="bg-white px-3 py-1 rounded text-xs text-gray-800 max-w-md">
                                          {JSON.parse(item.customization).text || 'Custom design'}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <span className="font-playfair font-bold text-navy text-xl">₹{item.price.toFixed(2)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div className="bg-blue-50 rounded-2xl p-6">
                            <h4 className="text-xl font-playfair text-navy mb-4">Shipping Address</h4>
                            <div className="text-gray-700 font-playfair leading-relaxed">
                              <div className="font-semibold text-lg">{order.shipping_address.name}</div>
                              <div>{order.shipping_address.address_line}</div>
                              <div>
                                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                              </div>
                              <div>{order.shipping_address.country}</div>
                            </div>
                          </div>

                          {/* Order Actions */}
                          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                            <div className="px-6 py-3 bg-gray-200 text-gray-500 font-playfair font-semibold rounded-lg cursor-not-allowed">
                              Order Tracking Not Available
                            </div>
                            <button className="px-6 py-3 border-2 border-navy text-navy font-playfair font-semibold rounded-lg hover:bg-navy hover:text-white transition-colors">
                              Need Help?
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Section */}
            <div className="mt-16 text-center">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-4xl mx-auto">
                <h3 className="text-3xl lg:text-4xl font-playfair text-navy mb-6">
                  Every Order, Made With Care
                </h3>
                <p className="text-lg text-gray-600 font-playfair mb-4 leading-relaxed">
                  Your personalized gifts are crafted individually with attention to every detail.
                  Each order is personally reviewed before production begins.
                </p>
                <p className="text-base text-gray-700 font-playfair mb-8">
                  💝 Loved one gift? Reordering takes just one click.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/gift-finder" className="px-8 py-4 bg-navy text-white font-playfair font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    💝 Create Another Gift
                  </Link>
                  <Link href="/products" className="px-8 py-4 border-2 border-navy text-navy font-playfair font-semibold rounded-lg hover:bg-navy hover:text-white transition-colors">
                    🎁 Find a Gift for Someone Special
                  </Link>
                </div>
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
              <h3 className="font-playfair font-semibold text-white mb-4 text-sm">Products</h3>
              <ul className="space-y-2 text-gray-300 font-playfair text-sm">
                <li><Link href="/products" className="hover:text-white transition-colors">Mugs</Link></li>
                <li><Link href="/products" className="hover:text-white transition-colors">T-Shirts</Link></li>
                <li><Link href="/products" className="hover:text-white transition-colors">Pillows</Link></li>
                <li><Link href="/products" className="hover:text-white transition-colors">Custom Items</Link></li>
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
