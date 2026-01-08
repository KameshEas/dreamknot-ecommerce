import Link from 'next/link'
import Header from '@/components/Header'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="text-sm text-gray-500 font-playfair">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Terms of Service</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-4xl font-playfair text-navy mb-6">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 font-playfair mb-8">
              Welcome to DreamKnot! These Terms of Service ("Terms") govern your use of our website 
              located at dreamknot.co.in (the "Site") and our services (collectively, the "Services"). 
              Please read these Terms carefully before using our Services.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-playfair text-blue-800 mb-3">Agreement to Terms</h2>
              <p className="text-blue-700 font-playfair">
                By accessing or using our Services, you agree to be bound by these Terms. If you disagree 
                with any part of the terms, you may not access the Services.
              </p>
            </div>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Intellectual Property</h2>
            <p className="text-gray-600 font-playfair mb-4">
              The Services and their original content, features, and functionality are and will remain 
              the exclusive property of DreamKnot and its licensors. Our trademarks and trade dress may 
              not be used in connection with any product or service without the prior written consent of DreamKnot.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">User Accounts</h2>
            <p className="text-gray-600 font-playfair mb-4">
              When you create an account with us, you must provide information that is accurate, complete, 
              and current at all times. Failure to do so constitutes a breach of the Terms, which may result 
              in immediate termination of your account.
            </p>
            <p className="text-gray-600 font-playfair mb-4">
              You are responsible for safeguarding the password that you use to access the Services and for 
              any activities or actions under your password, whether your password is with our Services or a 
              third-party service.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Orders and Payments</h2>
            <p className="text-gray-600 font-playfair mb-4">
              All purchases are subject to availability and our acceptance of your order. We reserve the right 
              to refuse or cancel your order for any reason.
            </p>
            <p className="text-gray-600 font-playfair mb-4">
              All prices are subject to change without notice. We reserve the right at any time to modify or 
              discontinue any aspect of the Services.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Personalized Products</h2>
            <p className="text-gray-600 font-playfair mb-4">
              All items sold by DreamKnot are personalized and made-to-order. Due to the custom nature of these 
              products, please review our <Link href="/cancellation-policy" className="text-deep-gold hover:text-navy">Cancellation Policy</Link> and{' '}
              <Link href="/return-refund-policy" className="text-deep-gold hover:text-navy">Return & Refund Policy</Link> for important information 
              about our policies regarding cancellations and returns.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">User Conduct</h2>
            <p className="text-gray-600 font-playfair mb-4">
              You agree not to use the Services for any unlawful purpose or for the promotion of illegal activities. 
              You agree not to:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• Use the Services in any way that could damage, disable, overburden, or impair our servers</li>
              <li>• Attempt to gain unauthorized access to any portion of the Services</li>
              <li>• Use the Services to harass, abuse, or harm another person</li>
              <li>• Use any robot, spider, or other automatic device to access the Services</li>
              <li>• Upload or transmit viruses or other harmful, disruptive, or destructive files</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Prohibited Content</h2>
            <p className="text-gray-600 font-playfair mb-4">
              You agree not to upload, post, or otherwise transmit any content that:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• Is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
              <li>• Infringes upon intellectual property rights</li>
              <li>• Contains personal information of others without their permission</li>
              <li>• Contains software viruses or any other computer code designed to interrupt, destroy, or limit the functionality of any computer software or hardware</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-gray-600 font-playfair mb-4">
              In no event shall DreamKnot, nor its directors, employees, or agents, be liable to you for any 
              indirect, incidental, special, consequential, or punitive damages, including without limitation, 
              loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• Your access to or inability to access the Services</li>
              <li>• Any conduct or content of any third party on the Services</li>
              <li>• Any content obtained from the Services</li>
              <li>• Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Indemnification</h2>
            <p className="text-gray-600 font-playfair mb-4">
              You agree to defend, indemnify, and hold harmless DreamKnot and its licensee and licensors, and 
              their employees, contractors, agents, officers, and directors, from and against any and all claims, 
              damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited 
              to attorney's fees), resulting from or arising out of:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• Your use and access of the Services</li>
              <li>• Your violation of any term of these Terms</li>
              <li>• Your violation of any third-party right, including without limitation any copyright, property, or privacy right</li>
              <li>• Any claim that your content caused damage to a third party</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Disclaimer of Warranties</h2>
            <p className="text-gray-600 font-playfair mb-4">
              Your use of the Services is at your sole risk. The Services are provided on an "AS IS" and "AS AVAILABLE" basis, 
              without warranties of any kind, either express or implied, including, without limitation, implied warranties 
              of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Governing Law</h2>
            <p className="text-gray-600 font-playfair mb-4">
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its 
              conflict of law provisions.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Changes to Terms</h2>
            <p className="text-gray-600 font-playfair mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision 
              is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What 
              constitutes a material change will be determined at our sole discretion.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-600 font-playfair mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• Email: <a href="mailto:legal@dreamknot.co.in" className="text-deep-gold hover:text-navy">legal@dreamknot.co.in</a></li>
              <li>• Mail: Legal Department, DreamKnot, 123 Gift Street, Mumbai, Maharashtra 400001, India</li>
            </ul>

            <div className="mt-8 p-6 bg-green-50 rounded-lg">
              <h3 className="text-lg font-playfair font-semibold text-navy mb-2">Important Notice</h3>
              <p className="text-gray-600 font-playfair">
                By using our Services, you acknowledge that you have read, understood, and agree to be bound 
                by these Terms of Service. If you do not agree to these terms, please do not use our Services.
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