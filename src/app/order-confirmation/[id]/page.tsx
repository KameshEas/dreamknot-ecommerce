'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface OrderItem {
  id: number
  product: {
    id: number
    title: string
    images: string[]
  }
  customization_json: string | null
  qty: number
  price: number
}

interface Order {
  id: number
  total_amount: number
  order_status: string
  shipping_address: string
  billing_address: string
  created_at: string
  order_items: OrderItem[]
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchOrder = async () => {
    try {
      // First, try to get order data from localStorage (set after payment)
      const storedOrder = localStorage.getItem('lastOrder')
      if (storedOrder) {
        const parsedOrder = JSON.parse(storedOrder)
        if (parsedOrder.id === parseInt(orderId)) {
          setOrder(parsedOrder)
          setLoading(false)
          return
        }
      }

      // If not in localStorage, fetch from API
      const response = await fetch(`/api/user/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
      } else {
        // Fallback to basic order info if detailed fetch fails
        setOrder({
          id: parseInt(orderId),
          total_amount: 0,
          order_status: 'processing',
          shipping_address: '{}',
          billing_address: '{}',
          created_at: new Date().toISOString(),
          order_items: []
        })
      }
    } catch (error) {
      console.error('Fetch order error:', error)
      // Fallback to basic order info
      setOrder({
        id: parseInt(orderId),
        total_amount: 0,
        order_status: 'processing',
        shipping_address: '{}',
        billing_address: '{}',
        created_at: new Date().toISOString(),
        order_items: []
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-navy font-playfair text-xl">Loading order confirmation...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-4xl font-playfair font-bold text-navy mb-4">
            Order Confirmed!
          </h1>

          <p className="text-xl font-playfair text-dark-gray mb-6">
            {"Thank you for your order. We're excited to create your personalized gifts!"}
          </p>

          <div className="bg-light-gold bg-opacity-20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-playfair font-semibold text-navy mb-4">Order Details</h2>
            <div className="text-left space-y-2">
              <p className="font-playfair text-dark-gray">
                <span className="font-bold">Order Number:</span> #{order?.id.toString().padStart(6, '0')}
              </p>
              <p className="font-playfair text-dark-gray">
                <span className="font-bold">Status:</span> {order?.order_status.replace('_', ' ')}
              </p>
              <p className="font-playfair text-dark-gray">
                <span className="font-bold">Order Date:</span> {new Date(order?.created_at || '').toLocaleDateString()}
              </p>
              <p className="font-playfair text-dark-gray">
                <span className="font-bold">Total Amount:</span> ₹{order?.total_amount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Order Items */}
          {order?.order_items && order.order_items.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-playfair font-bold text-navy mb-4">Your Items</h3>
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-off-white rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={item.product.images[0] || '/next.svg'}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="text-left">
                        <h4 className="font-playfair font-bold text-navy">{item.product.title}</h4>
                        <p className="text-sm text-gray-600 font-playfair">Quantity: {item.qty}</p>
                        {item.customization_json && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 font-playfair mb-1">Customization:</p>
                            <div className="bg-white px-3 py-1 rounded text-xs text-gray-800 max-w-md">
                              {JSON.parse(item.customization_json).text || 'Custom design'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 font-playfair">
                        ₹{item.price.toFixed(2)} × {item.qty}
                      </div>
                      <p className="font-playfair font-bold text-navy">₹{(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center space-y-4">
            <p className="text-lg font-playfair text-dark-gray">
              {"We'll send you an email confirmation and updates on your order status."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-4 bg-gradient-to-r from-light-gold to-deep-gold text-navy font-playfair font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Continue Shopping
              </Link>
              <a
                href="#"
                className="px-8 py-4 border-2 border-navy text-navy font-playfair font-semibold rounded-lg hover:bg-navy hover:text-white transition-colors"
              >
                Track Order
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-navy text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-playfair">&copy; 2025 DreamKnot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
