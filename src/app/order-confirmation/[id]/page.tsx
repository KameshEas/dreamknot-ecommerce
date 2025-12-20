'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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
  }, [orderId])

  const fetchOrder = async () => {
    try {
      // For now, we'll simulate getting order details
      // In a real app, you'd have an API endpoint to fetch order by ID
      // Since we just created it, we'll show a success message

      setOrder({
        id: parseInt(orderId),
        total_amount: 0, // Would be fetched from API
        order_status: 'processing',
        shipping_address: '{}',
        billing_address: '{}',
        created_at: new Date().toISOString(),
        order_items: []
      })
    } catch (error) {
      console.error('Fetch order error:', error)
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
      <header className="bg-navy text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-great-vibes">DreamKnot</h1>
          <nav className="space-x-6">
            <a href="/" className="font-playfair hover:text-light-gold transition-colors">Home</a>
            <a href="/cart" className="font-playfair hover:text-light-gold transition-colors">Cart</a>
            <a href="#" className="font-playfair hover:text-light-gold transition-colors">Orders</a>
            <a href="#" className="font-playfair hover:text-light-gold transition-colors">Login</a>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-4xl font-great-vibes text-navy mb-4">
            Order Confirmed!
          </h1>

          <p className="text-xl font-playfair text-dark-gray mb-6">
            Thank you for your order. We're excited to create your personalized gifts!
          </p>

          <div className="bg-light-gold bg-opacity-20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-playfair font-bold text-navy mb-4">Order Details</h2>
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
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-lg font-playfair text-dark-gray">
              We'll send you an email confirmation and updates on your order status.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="px-6 py-3 bg-gradient-to-r from-light-gold to-deep-gold text-navy font-playfair font-bold rounded hover:opacity-90 transition-opacity"
              >
                Continue Shopping
              </a>
              <a
                href="#"
                className="px-6 py-3 border-2 border-navy text-navy font-playfair font-bold rounded hover:bg-navy hover:text-white transition-colors"
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
