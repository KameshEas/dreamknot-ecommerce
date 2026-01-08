import Link from 'next/link'
import Header from '@/components/Header'

export default function ReturnRefundPolicy() {
  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="text-sm text-gray-500 font-playfair">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Return & Refund Policy</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-4xl font-playfair text-navy mb-6">Return & Refund Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 font-playfair mb-8">
              At DreamKnot, we take pride in creating personalized gifts that are as unique as your relationships. Due to the custom nature of our products, our return and refund policy is designed to ensure quality while respecting the personalized aspect of each item.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-playfair text-red-800 mb-3">Important Notice</h2>
              <p className="text-red-700 font-playfair">
                <strong>Personalized Products:</strong> All items sold by DreamKnot are personalized and made-to-order. Due to the custom nature of these products, we do not accept returns or provide refunds for items that are made exactly to your specifications.
              </p>
            </div>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">No Returns or Refunds Policy</h2>
            <p className="text-gray-600 font-playfair mb-4">
              We regret that we cannot accept returns or provide refunds for any personalized items, as they are custom-made specifically for you and cannot be resold.
            </p>
            <p className="text-gray-600 font-playfair mb-4">
              This policy applies to all personalized products including but not limited to:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• Custom printed mugs with personal photos or text</li>
              <li>• Personalized t-shirts with custom designs</li>
              <li>• Customized pillows with personal messages</li>
              <li>• Any other made-to-order items</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">What We Do Accept Returns For</h2>
            <p className="text-gray-600 font-playfair mb-4">
              We understand that sometimes issues can occur during production or shipping. We will accept returns and provide refunds or replacements for:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• <strong>Manufacturing defects:</strong> Items that arrive damaged or with production errors</li>
              <li>• <strong>Wrong items:</strong> If you receive an item that was not what you ordered</li>
              <li>• <strong>Shipping damage:</strong> Items damaged during transit</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Quality Assurance</h2>
            <p className="text-gray-600 font-playfair mb-4">
              We take great care in ensuring the quality of every personalized item we create. Our production process includes multiple quality checks to ensure your item meets our high standards.
            </p>
            <p className="text-gray-600 font-playfair mb-4">
              If you receive an item with a manufacturing defect, please contact us within <strong>7 days</strong> of receiving your order.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">How to Report Quality Issues</h2>
            <p className="text-gray-600 font-playfair mb-4">
              If you receive a defective item, please:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• Contact us at <a href="mailto:support@dreamknot.co.in" className="text-deep-gold hover:text-navy">support@dreamknot.co.in</a> within 7 days</li>
              <li>• Include photos of the defect or damage</li>
              <li>• Provide your order number</li>
              <li>• Describe the issue in detail</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Resolution Process</h2>
            <p className="text-gray-600 font-playfair mb-4">
              For items that qualify for returns or refunds:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• We will review your claim within <strong>48 hours</strong></li>
              <li>• We may request additional photos or information</li>
              <li>• We will provide a resolution within <strong>5-7 working days</strong></li>
              <li>• Options may include replacement, repair, or refund</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Before You Order</h2>
            <p className="text-gray-600 font-playfair mb-4">
              To ensure you're completely satisfied with your personalized gift, we recommend:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• <strong>Double-check customization details:</strong> Review all text, photos, and design elements carefully</li>
              <li>• <strong>Verify product specifications:</strong> Ensure you've selected the correct product type and size</li>
              <li>• <strong>Review our product previews:</strong> Use our preview tools to see how your customization will look</li>
              <li>• <strong>Contact us with questions:</strong> Our team is happy to help before you place your order</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Customization Guidelines</h2>
            <p className="text-gray-600 font-playfair mb-4">
              To help ensure the best results for your personalized items:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• Use high-quality images (minimum 300 DPI recommended)</li>
              <li>• Ensure text is clear and legible</li>
              <li>• Follow our size and placement guidelines</li>
              <li>• Consider how colors will appear on different materials</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-600 font-playfair mb-4">
              If you have any questions about our return and refund policy, or if you need to report a quality issue, please contact our customer service team:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• Email: <a href="mailto:support@dreamknot.co.in" className="text-deep-gold hover:text-navy">support@dreamknot.co.in</a></li>
              <li>• Response time: Within 24 hours on business days</li>
              <li>• For quality issues: Please contact us within 7 days of receiving your order</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Why We Have This Policy</h2>
            <p className="text-gray-600 font-playfair mb-4">
              Our no-returns policy for personalized items exists because:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• <strong>Custom nature:</strong> Each item is uniquely created for you</li>
              <li>• <strong>Cannot be resold:</strong> Personalized items have no resale value</li>
              <li>• <strong>Quality commitment:</strong> We stand behind the quality of our products</li>
              <li>• <strong>Fair pricing:</strong> Allows us to offer competitive prices on custom items</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 font-playfair mb-4">
              We may update our return and refund policy from time to time. We encourage you to review this page periodically for any changes. Any changes to this policy will be posted on this page with an updated effective date.
            </p>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-playfair font-semibold text-navy mb-2">Need Help?</h3>
              <p className="text-gray-600 font-playfair">
                If you have any questions about our return and refund policy, please contact us at{' '}
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