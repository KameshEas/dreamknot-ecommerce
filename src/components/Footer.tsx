import Link from 'next/link'

interface FooterProps {
  variant?: 'default' | 'minimal'
}

export default function Footer({ variant = 'default' }: FooterProps) {
  const currentYear = new Date().getFullYear()

  if (variant === 'minimal') {
    return (
      <footer className="bg-navy text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img src="/logo.svg" alt="DreamKnot Logo" className="w-12 h-12" />
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-300 font-playfair text-sm">
                &copy; {currentYear} DreamKnot. Made with love for personalized gifting.
              </p>
              <div className="mt-2 space-x-4 text-sm">
                <Link href="/shipping-policy" className="text-gray-400 hover:text-white transition-colors">
                  Shipping
                </Link>
                <Link href="/cancellation-policy" className="text-gray-400 hover:text-white transition-colors">
                  Cancellations
                </Link>
                <Link href="/return-refund-policy" className="text-gray-400 hover:text-white transition-colors">
                  Returns
                </Link>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-navy text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo.svg" alt="DreamKnot Logo" className="w-8 h-8" />
              <span className="text-xl font-playfair">DreamKnot</span>
            </div>
            <p className="text-gray-300 font-playfair text-sm leading-relaxed mb-6">
              Making personalized gifts simple, beautiful, and meaningful. 
              We create custom gifts that tell your unique story.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04a13.073 13.073 0 0 0 7.05 2.04c8.017 0 12.404-6.73 12.404-12.402 0-.195-.004-.39-.012-.583.851-.611 1.582-1.37 2.131-2.244z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439-.239-.594-1.199-3.062-1.199-3.062-.279-.709-1.029-1.418-1.029-1.418-.817-.559.061-.549.061-.549.903.061 1.383.923 1.383.923.803 1.376 2.106 1.951 3.305 1.951 1.2 0 2.495-.575 3.305-1.951 1.001-1.375 1.043-3.182 1.043-3.182 0 .042-.006.267-.041.549-.35.817-1.362 2.052-2.1 2.558.65.719 1.237 1.556 1.237 2.715 0 3.928-2.394 5.421-4.682 5.717-.365.294-.694.863-.694 1.732 0 1.256.012 2.275.012 2.589 0 .253-.162.55-.677.448C13.396 23.9 9.248 22.149 6.265 18.96c-1.114-.963-2.058-2.506-2.058-4.193 0-3.152 2.547-5.7 5.7-5.7 1.555 0 3.011.637 4.085 1.638l2.929-2.929C16.66 3.931 14.484 3.009 12.017 3.009 5.396 3.009.029 8.376.029 11.987z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Pinterest">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.033 17.29c-.34.487-.93 1.07-1.82 1.287-.78.187-1.71.12-2.54-.224-1.56-.647-2.49-1.98-3.22-3.12-.4-.647-.73-1.32-.73-2.11 0-1.56.8-2.86 2.01-2.86.76 0 1.35.52 1.56 1.18.25.79.12 1.64-.28 2.3-.37.61-.93 1.18-1.02 1.28-.09.09-.28.12-.43-.03-.12-.12-.25-.37-.18-.61.06-.28.25-.76.34-.97.09-.22.06-.43-.03-.58-.09-.15-.31-.25-.7-.37-1.02-.34-1.74-.97-1.74-2.14 0-1.35 1.15-2.5 2.61-2.5 1.32 0 2.33.83 2.33 2.04 0 1.15-.58 2.11-1.28 2.61-.25.18-.28.31-.18.58.09.25.4.64.55.83.15.18.22.28.37.28.18 0 .31-.12.4-.31.09-.18.15-.52.06-.8-.09-.31-.31-.73-.46-.97-.15-.25-.22-.37-.03-.61.18-.22.67-.34 1.15-.34.97 0 1.71.64 1.71 1.64 0 1.86-1.25 3.52-2.86 4.13z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Products Section */}
          <div>
            <h3 className="font-playfair font-semibold text-white mb-4">Products</h3>
            <ul className="space-y-2 text-gray-300 font-playfair text-sm">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=Birthday" className="hover:text-white transition-colors">
                  Birthday Gifts
                </Link>
              </li>
              <li>
                <Link href="/products?category=For Couples" className="hover:text-white transition-colors">
                  For Couples
                </Link>
              </li>
              <li>
                <Link href="/products?minPrice=0&maxPrice=500" className="hover:text-white transition-colors">
                  Under ₹500
                </Link>
              </li>
              <li>
                <Link href="/gift-finder" className="hover:text-white transition-colors">
                  Gift Finder
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="font-playfair font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300 font-playfair text-sm">
              <li>
                <Link href="/faqs" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation-policy" className="hover:text-white transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/return-refund-policy" className="hover:text-white transition-colors">
                  Return & Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="font-playfair font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-gray-300 font-playfair text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-white transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-300 font-playfair text-sm">
                &copy; {currentYear} DreamKnot. Made with love for personalized gifting.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/shipping-policy" className="text-gray-400 hover:text-white transition-colors">
                Shipping
              </Link>
              <Link href="/cancellation-policy" className="text-gray-400 hover:text-white transition-colors">
                Cancellations
              </Link>
              <Link href="/return-refund-policy" className="text-gray-400 hover:text-white transition-colors">
                Returns
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}