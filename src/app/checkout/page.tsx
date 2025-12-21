'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Script from 'next/script'

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
  address_line: string
  city: string
  state: string
  zip: string
  country: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<Cart>({ id: null, items: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<Address>({
    name: '',
    address_line: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  })
  const [billingAddress, setBillingAddress] = useState<Address>({
    name: '',
    address_line: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  })
  const [sameAsShipping, setSameAsShipping] = useState(true)

  useEffect(() => {
    fetchCart()
  }, [])

  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress(shippingAddress)
    }
  }, [shippingAddress, sameAsShipping])

  // Load Razorpay SDK
  useEffect(() => {
    const loadRazorpay = async () => {
      if (!(window as any).Razorpay) {
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
    if (!shippingAddress.name || !shippingAddress.address_line || !shippingAddress.city) {
      alert('Please fill in all required shipping address fields')
      return
    }

    if (!billingAddress.name || !billingAddress.address_line || !billingAddress.city) {
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
      if (!(window as any).Razorpay) {
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
        handler: async function (response: any) {
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
              router.push(`/order-confirmation/${data.order.id}`)
            } else {
              const error = await verifyResponse.json()
              alert(`Payment verification failed: ${error.error}`)
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            alert('Payment verification failed')
          } finally {
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
        const rzp = new (window as any).Razorpay(options)
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
        <div className="text-navy font-playfair text-xl">Loading checkout...</div>
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
            <a href="#" className="font-playfair hover:text-light-gold transition-colors">Products</a>
            <a href="#" className="font-playfair hover:text-light-gold transition-colors">About</a>
            <a href="#" className="font-playfair hover:text-light-gold transition-colors">Login</a>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-playfair font-bold text-navy mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-playfair font-bold text-navy mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.product.images[0] || '/placeholder-product.jpg'}
                      alt={item.product.title}
                      fill
                      className="object-cover rounded"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-playfair font-bold text-navy">{item.product.title}</h3>
                    <p className="text-sm text-dark-gray font-playfair">Qty: {item.qty}</p>
                    {item.customization && (
                      <p className="text-xs text-dark-gray">
                        Custom: {JSON.parse(item.customization).text?.substring(0, 20) || 'Yes'}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-playfair font-bold text-navy">₹{item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-playfair font-bold text-navy">Total:</span>
                <span className="text-2xl font-playfair font-bold text-navy">₹{cart.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Billing */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-playfair font-bold text-navy mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-playfair font-bold text-navy mb-2">Full Name</label>
                  <input
                    type="text"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded font-playfair focus:outline-none focus:ring-2 focus:ring-light-gold"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-playfair font-bold text-navy mb-2">Address Line</label>
                  <input
                    type="text"
                    value={shippingAddress.address_line}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, address_line: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded font-playfair focus:outline-none focus:ring-2 focus:ring-light-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-playfair font-bold text-navy mb-2">City</label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded font-playfair focus:outline-none focus:ring-2 focus:ring-light-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-playfair font-bold text-navy mb-2">State</label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded font-playfair focus:outline-none focus:ring-2 focus:ring-light-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-playfair font-bold text-navy mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={shippingAddress.zip}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, zip: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded font-playfair focus:outline-none focus:ring-2 focus:ring-light-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-playfair font-bold text-navy mb-2">Country</label>
                  <input
                    type="text"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded font-playfair focus:outline-none focus:ring-2 focus:ring-light-gold"
                  />
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-playfair font-bold text-navy">Billing Address</h2>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-playfair text-dark-gray">Same as shipping</span>
                </label>
              </div>

              {!sameAsShipping && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-playfair font-bold text-navy mb-2">Full Name</label>
                    <input
                      type="text"
                      value={billingAddress.name}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded font-playfair focus:outline-none focus:ring-2 focus:ring-light-gold"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-playfair font-bold text-navy mb-2">Address Line</label>
                    <input
                      type="text"
                      value={billingAddress.address_line}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, address_line: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded font-playfair focus:outline-none focus:ring-2 focus:ring-light-gold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-playfair font-bold text-navy mb-2">City</label>
                    <input
                      type="text"
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded font-playfair focus:outline-none focus:ring-2 focus:ring-light-gold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-playfair font-bold text-navy mb-2">State</label>
                    <input
                      type="text"
                      value={billingAddress.state}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded font-playfair focus:outline-none focus:ring-2 focus:ring-light-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-playfair font-bold text-navy mb-2">ZIP Code</label>
                    <input
                      type="text"
                      value={billingAddress.zip}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, zip: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded font-playfair focus:outline-none focus:ring-2 focus:ring-light-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-playfair font-bold text-navy mb-2">Country</label>
                    <input
                      type="text"
                      value={billingAddress.country}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded font-playfair focus:outline-none focus:ring-2 focus:ring-light-gold"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Place Order */}
            <button
              onClick={handlePlaceOrder}
              disabled={processing}
              className="w-full py-4 bg-gradient-to-r from-light-gold to-deep-gold text-navy font-playfair font-bold text-lg rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : `Place Order - ₹${cart.total.toFixed(2)}`}
            </button>
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
