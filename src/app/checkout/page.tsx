'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'

interface CartItem {
  id: number
  product: {
    id: number
    title: string
    images: string[]
    base_price: number
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

interface Address {
  name: string
  phone: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  order_id: string
  name: string
  description: string
  handler: (response: RazorpayResponse) => void
  modal: {
    ondismiss: () => void
  }
  prefill: {
    name: string
    email: string
    contact: string
  }
  theme: {
    color: string
  }
}

interface RazorpayInstance {
  open: () => void
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor
  }
}

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

interface Order {
  id: number
  total_amount: number
  order_status: string
  shipping_address: string
  billing_address: string
  created_at: string
  order_items: OrderItem[]
}

type CheckoutStep = 'cart' | 'checkout' | 'confirmation'

export default function CheckoutPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('checkout')
  const [cart, setCart] = useState<Cart>({ id: null, items: [], total: 0 })
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<Address>({
    name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: ''
  })
  const [billingAddress, setBillingAddress] = useState<Address>({
    name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: ''
  })
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<{ amount: number; code: string } | null>(null)
  const [discountLoading, setDiscountLoading] = useState(false)

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      alert('Please enter a discount code')
      return
    }

    setDiscountLoading(true)
    try {
      const response = await fetch('/api/discount-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: discountCode.trim(),
          orderTotal: cart.total
        })
      })

      const data = await response.json()

      if (data.valid) {
        setAppliedDiscount({ amount: data.discount, code: discountCode.trim() })
        alert(`Discount applied! You saved ₹${data.discount.toFixed(2)}`)
      } else {
        alert('Invalid or expired discount code')
        setAppliedDiscount(null)
      }
    } catch (error) {
      console.error('Discount validation error:', error)
      alert('Failed to validate discount code')
      setAppliedDiscount(null)
    } finally {
      setDiscountLoading(false)
    }
  }

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null)
    setDiscountCode('')
  }

  const getFinalTotal = () => {
    return appliedDiscount ? Math.max(0, cart.total - appliedDiscount.amount) : cart.total
  }

  useEffect(() => {
    fetchCart()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress(shippingAddress)
    }
  }, [shippingAddress, sameAsShipping])

  // Load Razorpay SDK
  useEffect(() => {
    const loadRazorpay = async () => {
      if (!(window as Window & { Razorpay?: unknown }).Razorpay) {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.body.appendChild(script)

        return new Promise((resolve) => {
          script.onload = resolve
        })
      }
    }

    loadRazorpay()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setCart(data)
        if (data.items.length === 0) {
          router.push('/cart')
        }
      } else if (response.status === 401) {
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Fetch cart error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address_line_1 || !shippingAddress.city) {
      alert('Please fill in all required shipping address fields')
      return
    }

    if (!billingAddress.name || !billingAddress.phone || !billingAddress.address_line_1 || !billingAddress.city) {
      alert('Please fill in all required billing address fields')
      return
    }

    setProcessing(true)

    try {
      // Create RazorPay order
      const orderResponse = await fetch('/api/orders/create-payment-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!orderResponse.ok) {
        const error = await orderResponse.json()
        alert(`Error creating payment order: ${error.error}`)
        setProcessing(false)
        return
      }

      const orderData = await orderResponse.json()

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        alert('Razorpay SDK not loaded. Please refresh the page and try again.')
        setProcessing(false)
        return
      }

      // Initialize RazorPay checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'DreamKnot',
        description: 'Purchase from DreamKnot',
        handler: async function (response: RazorpayResponse) {
          // Payment successful, verify and create order
          try {
            const verifyResponse = await fetch('/api/orders/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                shipping_address: shippingAddress,
                billing_address: billingAddress
              })
            })

            if (verifyResponse.ok) {
              const data = await verifyResponse.json()

              // Create order object for confirmation step
              const confirmedOrder: Order = {
                id: data.order.id,
                total_amount: cart.total,
                order_status: 'processing',
                shipping_address: JSON.stringify(shippingAddress),
                billing_address: JSON.stringify(billingAddress),
                created_at: new Date().toISOString(),
                order_items: cart.items.map(item => ({
                  id: item.id,
                  product: {
                    id: item.product.id,
                    title: item.product.title,
                    images: item.product.images
                  },
                  customization: item.customization,
                  qty: item.qty,
                  price: item.price
                }))
              }

              setOrder(confirmedOrder)
              setCurrentStep('confirmation')
              setProcessing(false)
            } else {
              const error = await verifyResponse.json()
              alert(`Payment verification failed: ${error.error}`)
              setProcessing(false)
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            alert('Payment verification failed')
            setProcessing(false)
          }
        },
        modal: {
          ondismiss: function() {
            setProcessing(false)
          }
        },
        prefill: {
          name: shippingAddress.name,
          email: '', // You might want to get this from user profile
          contact: '' // You might want to get this from user profile
        },
        theme: {
          color: '#1e3a8a' // Navy color
        }
      }

      try {
        const rzp = new window.Razorpay!(options)
        rzp.open()
      } catch (razorpayError) {
        console.error('Razorpay initialization error:', razorpayError)
        alert('Failed to initialize payment gateway. Please try again.')
        setProcessing(false)
      }
    } catch (error) {
      console.error('Place order error:', error)
      alert('Failed to initiate payment')
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-deep-gold/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-deep-gold animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-navy font-playfair text-xl">Preparing your checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-off-white to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-playfair font-bold text-navy mb-6 leading-tight">
            Almost There — Your Gift is Ready
          </h1>
          <p className="text-lg text-gray-600 font-playfair leading-relaxed mb-8">
            Secure checkout in just a few steps. Preview before you buy • Easy edits • Fast delivery.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 font-playfair">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-deep-gold rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Cart</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${currentStep === 'checkout' || currentStep === 'confirmation' ? 'text-navy' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 'checkout' || currentStep === 'confirmation' ? 'bg-navy text-white' : 'bg-gray-200'
              }`}>
                {currentStep === 'checkout' || currentStep === 'confirmation' ? '✓' : '2'}
              </div>
              <span className={currentStep === 'checkout' || currentStep === 'confirmation' ? 'font-semibold' : ''}>Checkout</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${currentStep === 'confirmation' ? 'text-navy' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 'confirmation' ? 'bg-deep-gold text-navy' : 'bg-gray-200'
              }`}>
                {currentStep === 'confirmation' ? '✓' : '3'}
              </div>
              <span className={currentStep === 'confirmation' ? 'font-semibold' : ''}>Confirmation</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Order Summary - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-playfair text-navy mb-6">Your Order</h2>
              <div className="space-y-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-6 p-4 bg-off-white rounded-xl">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.product.images[0] || '/next.svg'}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-playfair font-semibold text-navy text-lg mb-1">{item.product.title}</h3>
                      <p className="text-gray-600 font-playfair text-sm">Quantity: {item.qty}</p>
                      {item.customization && (
                        <p className="text-gray-500 font-playfair text-xs mt-1">
                          Personalized: {JSON.parse(item.customization).text?.substring(0, 30) || 'Yes'}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-playfair font-bold text-navy text-xl">₹{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-playfair text-gray-700">Subtotal</span>
                    <span className="text-lg font-playfair text-gray-700">₹{cart.total.toFixed(2)}</span>
                  </div>

                  {appliedDiscount && (
                    <div className="flex justify-between items-center text-green-600">
                      <span className="text-lg font-playfair">Discount ({appliedDiscount.code})</span>
                      <span className="text-lg font-playfair">-₹{appliedDiscount.amount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-2xl font-playfair text-navy">Total</span>
                    <span className="text-3xl font-playfair font-bold text-navy">₹{getFinalTotal().toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 font-playfair mt-2">Includes all taxes and shipping</p>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-playfair text-navy mb-6">Why Choose DreamKnot?</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-deep-gold/10 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6 text-deep-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h4 className="font-playfair font-semibold text-navy">Premium Quality</h4>
                  <p className="text-sm text-gray-600 font-playfair">Every gift is carefully crafted with attention to detail</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-deep-gold/10 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6 text-deep-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-playfair font-semibold text-navy">Preview First</h4>
                  <p className="text-sm text-gray-600 font-playfair">See exactly how your gift looks before checkout</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-deep-gold/10 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6 text-deep-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-playfair font-semibold text-navy">Fast Delivery</h4>
                  <p className="text-sm text-gray-600 font-playfair">Expedited production and premium shipping</p>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form - Takes up 1 column on large screens */}
          <div className="space-y-8">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-playfair text-navy">Shipping Address</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-playfair font-semibold text-navy mb-2">Full Name</label>
                  <input
                    type="text"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-playfair font-semibold text-navy mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-playfair font-semibold text-navy mb-2">Address Line 1</label>
                  <input
                    type="text"
                    value={shippingAddress.address_line_1}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, address_line_1: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                    placeholder="Street address, apartment, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-playfair font-semibold text-navy mb-2">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    value={shippingAddress.address_line_2}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, address_line_2: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-playfair font-semibold text-navy mb-2">City</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-playfair font-semibold text-navy mb-2">State</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-playfair font-semibold text-navy mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={shippingAddress.postal_code}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, postal_code: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                      placeholder="Postal Code"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-playfair font-semibold text-navy mb-2">Country</label>
                    <input
                      type="text"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                      placeholder="Country"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-deep-gold rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-playfair text-navy">Billing Address</h2>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="rounded border-gray-300 text-navy focus:ring-navy"
                  />
                  <span className="text-sm font-playfair text-gray-600">Same as shipping</span>
                </label>
              </div>

              {!sameAsShipping && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-playfair font-semibold text-navy mb-2">Full Name</label>
                    <input
                      type="text"
                      value={billingAddress.name}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-playfair font-semibold text-navy mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={billingAddress.phone}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-playfair font-semibold text-navy mb-2">Address Line 1</label>
                    <input
                      type="text"
                      value={billingAddress.address_line_1}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, address_line_1: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                      placeholder="Street address, apartment, etc."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-playfair font-semibold text-navy mb-2">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={billingAddress.address_line_2}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, address_line_2: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-playfair font-semibold text-navy mb-2">City</label>
                      <input
                        type="text"
                        value={billingAddress.city}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-playfair font-semibold text-navy mb-2">State</label>
                      <input
                        type="text"
                        value={billingAddress.state}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, state: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-playfair font-semibold text-navy mb-2">Postal Code</label>
                      <input
                        type="text"
                        value={billingAddress.postal_code}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, postal_code: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                        placeholder="Postal Code"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-playfair font-semibold text-navy mb-2">Country</label>
                      <input
                        type="text"
                        value={billingAddress.country}
                        onChange={(e) => setBillingAddress(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                        placeholder="Country"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Discount Code */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-playfair text-navy mb-4">Have a discount code?</h3>
              {appliedDiscount ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-playfair text-green-800 font-medium">
                        Code {appliedDiscount.code} applied!
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveDiscount}
                      className="text-red-600 hover:text-red-800 text-sm font-playfair underline"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-green-700 font-playfair text-sm mt-1">
                    You saved ₹{appliedDiscount.amount.toFixed(2)}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      placeholder="Enter discount code"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent uppercase"
                    />
                    <button
                      onClick={handleApplyDiscount}
                      disabled={discountLoading || !discountCode.trim()}
                      className="px-6 py-3 bg-navy text-white font-playfair font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {discountLoading ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 font-playfair">
                    Enter your discount code to get savings on your order
                  </p>
                </div>
              )}
            </div>

            {/* What Happens Next Section */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-playfair font-semibold text-navy mb-4">What happens next?</h3>
              <div className="space-y-3 text-sm text-gray-700 font-playfair">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-navy rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <span>We review your design for perfection</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-deep-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-navy text-xs font-bold">2</span>
                  </div>
                  <span>{"You'll receive a confirmation email"}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-navy rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <span>Your gift goes into production within 24 hours</span>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="w-full py-4 bg-gradient-to-r from-deep-gold to-navy text-white font-playfair font-bold text-lg rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg"
              >
                {processing ? (
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Pay ₹{getFinalTotal().toFixed(2)} & Place Order</span>
                  </div>
                )}
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 font-playfair flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Secure payment powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Step */}
      {currentStep === 'confirmation' && order && (
        <div className="max-w-4xl mx-auto px-4 pb-20">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-4xl font-playfair text-navy mb-4">
              Order Confirmed!
            </h1>

            <p className="text-2xl font-playfair text-gray-600 mb-8">
              {"Thank you for your order. We're excited to create your personalized gifts!"}
            </p>

            <div className="bg-deep-gold/5 rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-playfair font-bold text-navy mb-6">Order Details</h2>
              <div className="text-left space-y-3">
                <p className="font-playfair text-gray-700">
                  <span className="font-bold">Order Number:</span> #{order.id.toString().padStart(6, '0')}
                </p>
                <p className="font-playfair text-gray-700">
                  <span className="font-bold">Status:</span> {order.order_status.replace('_', ' ')}
                </p>
                <p className="font-playfair text-gray-700">
                  <span className="font-bold">Order Date:</span> {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p className="font-playfair text-gray-700">
                  <span className="font-bold">Total:</span> ₹{order.total_amount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="text-xl font-playfair font-bold text-navy mb-4">Your Items</h3>
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
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-playfair font-bold text-navy">₹{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center space-y-6">
              <p className="text-lg font-playfair text-gray-600">
                {"We'll send you an email confirmation and updates on your order status."}
              </p>

              {/* Post-Purchase Momentum */}
              <div className="bg-navy/5 rounded-2xl p-6 max-w-2xl mx-auto">
                <p className="text-base font-playfair text-gray-700 mb-4">
                  💝 While we prepare your gift, want to create another special surprise?
                </p>
                <Link
                  href="/gift-finder"
                  className="inline-flex items-center px-6 py-3 bg-deep-gold text-navy font-playfair font-semibold rounded-lg hover:opacity-90 transition-colors"
                >
                  Find Another Perfect Gift
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H7" />
                  </svg>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="px-8 py-4 bg-navy text-white font-playfair font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/orders"
                  className="px-8 py-4 border-2 border-navy text-navy font-playfair font-semibold rounded-lg hover:bg-navy hover:text-white transition-colors"
                >
                  View All Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Founders' Promise - Only show if not on confirmation step */}
      {currentStep !== 'confirmation' && (
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-playfair text-navy mb-6">
              Your Gift, Made With Care
            </h2>
            <p className="text-xl text-gray-600 font-playfair leading-relaxed mb-8">
              Every DreamKnot order is personally reviewed before production.
              {"If something doesn't look perfect, we'll fix it before shipping."}
            </p>
            <div className="bg-off-white rounded-2xl p-8 max-w-2xl mx-auto">
              <blockquote className="text-lg font-playfair text-navy italic mb-4">
                {"We want you to love your gift as much as we do."}
              </blockquote>
              <cite className="text-sm text-gray-600 font-playfair">
                — DreamKnot Team
              </cite>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
