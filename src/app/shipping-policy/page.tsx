import Link from 'next/link'
import Header from '@/components/Header'

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="text-sm text-gray-500 font-playfair">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Shipping Policy</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-4xl font-playfair text-navy mb-6">Shipping Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 font-playfair mb-8">
              Thank you for shopping at DreamKnot. We are committed to delivering your personalized gifts safely and promptly. Please read our shipping policy carefully to understand how we handle the delivery of your orders.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Standard Shipping</h2>
            <p className="text-gray-600 font-playfair mb-4">
              We offer standard shipping across India with delivery times of <strong>3-7 working days</strong> from the date of dispatch.
            </p>
            <p className="text-gray-600 font-playfair mb-4">
              Shipping costs are calculated based on the package weight and destination, ranging from <strong>₹40-₹80</strong>. The exact shipping cost will be displayed at checkout before you complete your purchase.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Express Shipping (Two-Day Delivery)</h2>
            <p className="text-gray-600 font-playfair mb-4">
              For selected products, we offer express shipping with delivery in just <strong>2 working days</strong>. This service is available for an additional shipping charge.
            </p>
            <p className="text-gray-600 font-playfair mb-4">
              Express shipping is currently available for select products and locations. Availability will be shown during checkout if your order qualifies for this service.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Processing Time</h2>
            <p className="text-gray-600 font-playfair mb-4">
              Please note that all our products are personalized and made-to-order. After you place your order, we require <strong>1-2 working days</strong> for production and quality checks before your order is shipped.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Order Tracking</h2>
            <p className="text-gray-600 font-playfair mb-4">
              Once your order has been shipped, we will send you a confirmation email with tracking information. You can use this information to track your package through our shipping partner's website.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Delivery Issues</h2>
            <p className="text-gray-600 font-playfair mb-4">
              If you experience any issues with your delivery, please contact our customer service team at <a href="mailto:support@dreamknot.co.in" className="text-deep-gold hover:text-navy">support@dreamknot.co.in</a>. We're here to help ensure your package reaches you safely.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">International Shipping</h2>
            <p className="text-gray-600 font-playfair mb-4">
              Currently, we only ship within India. We are working on expanding our international shipping options and will update this policy when available.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Changes to This Shipping Policy</h2>
            <p className="text-gray-600 font-playfair mb-4">
              We may update our shipping policy from time to time. We encourage you to review this page periodically for any changes. Any changes to this policy will be posted on this page with an updated effective date.
            </p>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-playfair font-semibold text-navy mb-2">Need Help?</h3>
              <p className="text-gray-600 font-playfair">
                If you have any questions about our shipping policy, please contact us at{' '}
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