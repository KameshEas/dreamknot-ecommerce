import Link from 'next/link'
import Header from '@/components/Header'

export default function CancellationPolicy() {
  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="text-sm text-gray-500 font-playfair">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Cancellation Policy</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-4xl font-playfair text-navy mb-6">Cancellation Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 font-playfair mb-8">
              At DreamKnot, we understand that plans can change. However, due to the personalized nature of our products, our cancellation policy is designed to balance customer needs with the custom production process.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-playfair text-red-800 mb-3">Important Notice</h2>
              <p className="text-red-700 font-playfair">
                <strong>Personalized Products:</strong> All items sold by DreamKnot are personalized and made-to-order. Due to the custom nature of these products, we are unable to accept cancellations once the production process has begun.
              </p>
            </div>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Order Cancellation Window</h2>
            <p className="text-gray-600 font-playfair mb-4">
              You may cancel your order within <strong>30 minutes</strong> of placing it, provided that the order has not yet entered the production phase.
            </p>
            <p className="text-gray-600 font-playfair mb-4">
              To cancel your order within this window, please contact our customer service team immediately at{' '}
              <a href="mailto:support@dreamknot.co.in" className="text-deep-gold hover:text-navy">support@dreamknot.co.in</a> with your order number.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Production Timeline</h2>
            <p className="text-gray-600 font-playfair mb-4">
              Our production process typically begins within <strong>1-2 working days</strong> after your order is placed. Once production has started, we are unable to cancel or modify your order.
            </p>
            <p className="text-gray-600 font-playfair mb-4">
              We will notify you via email when your order has been processed and is in production.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">How to Request a Cancellation</h2>
            <p className="text-gray-600 font-playfair mb-4">
              To request a cancellation, please:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• Contact us at <a href="mailto:support@dreamknot.co.in" className="text-deep-gold hover:text-navy">support@dreamknot.co.in</a></li>
              <li>• Include your order number in the subject line</li>
              <li>• Clearly state your request to cancel the order</li>
              <li>• Contact us as soon as possible after placing your order</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Refunds for Cancelled Orders</h2>
            <p className="text-gray-600 font-playfair mb-4">
              If your cancellation is approved within the 30-minute window, you will receive a full refund. Refunds will be processed to your original payment method within <strong>5-7 working days</strong>.
            </p>
            <p className="text-gray-600 font-playfair mb-4">
              Please note that if your order has already entered production, we will not be able to process a cancellation or refund.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Why We Have This Policy</h2>
            <p className="text-gray-600 font-playfair mb-4">
              Our products are:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• <strong>Custom-made:</strong> Each item is created specifically for you</li>
              <li>• <strong>Personalized:</strong> Designs are tailored to your specifications</li>
              <li>• <strong>Non-returnable:</strong> Due to the custom nature, we cannot resell cancelled orders</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Before You Order</h2>
            <p className="text-gray-600 font-playfair mb-4">
              To avoid the need for cancellation, we recommend:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• Carefully reviewing your customization details before checkout</li>
              <li>• Double-checking product specifications and quantities</li>
              <li>• Ensuring the shipping address is correct</li>
              <li>• Contacting us with any questions before placing your order</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-600 font-playfair mb-4">
              If you have any questions about our cancellation policy or need to cancel an order, please contact our customer service team:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• Email: <a href="mailto:support@dreamknot.co.in" className="text-deep-gold hover:text-navy">support@dreamknot.co.in</a></li>
              <li>• Phone: Available during business hours</li>
              <li>• Response time: Within 24 hours on business days</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Changes to This Cancellation Policy</h2>
            <p className="text-gray-600 font-playfair mb-4">
              We may update our cancellation policy from time to time. We encourage you to review this page periodically for any changes. Any changes to this policy will be posted on this page with an updated effective date.
            </p>

            <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
              <h3 className="text-lg font-playfair font-semibold text-navy mb-2">Need Help?</h3>
              <p className="text-gray-600 font-playfair">
                If you have any questions about our cancellation policy, please contact us at{' '}
                <a href="mailto:support@dreamknot.co.in" className="text-deep-gold hover:text-navy">support@dreamknot.co.in</a>
                {' '} or visit our{' '}
                <Link href="/contact" className="text-deep-gold hover:text-navy">Contact Us</Link> page.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-navy text-white py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo.svg" alt="DreamKnot Logo" className="w-8 h-8" />
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