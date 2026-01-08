import Link from 'next/link'
import Header from '@/components/Header'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="text-sm text-gray-500 font-playfair">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Privacy Policy</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-4xl font-playfair text-navy mb-6">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 font-playfair mb-8">
              At DreamKnot, we respect your privacy and are committed to protecting your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
              visit our website and make purchases from our store.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-playfair text-blue-800 mb-3">Last Updated</h2>
              <p className="text-blue-700 font-playfair">
                This Privacy Policy was last updated on January 2026.
              </p>
            </div>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Information We Collect</h2>
            <p className="text-gray-600 font-playfair mb-4">
              We collect information that identifies, relates to, describes, references, is capable of being 
              associated with, or could reasonably be linked, directly or indirectly, with a particular consumer 
              or device ("personal information").
            </p>

            <h3 className="text-lg font-playfair text-navy mb-3">Personal Information We Collect</h3>
            <p className="text-gray-600 font-playfair mb-4">
              When you visit, use, or navigate our Services, we may collect the following categories of personal information:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• <strong>Identifiers:</strong> Name, email address, phone number, postal address</li>
              <li>• <strong>Personal information categories listed in the California Customer Records statute:</strong> 
                  Billing address, shipping address, phone number</li>
              <li>• <strong>Commercial information:</strong> Purchase history, preferences, and interests</li>
              <li>• <strong>Internet or other similar network activity:</strong> Browsing history, search history, 
                  information on interactions with our website</li>
              <li>• <strong>Geolocation data:</strong> Device location</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-gray-600 font-playfair mb-4">
              We use personal information for the following purposes:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• To provide, operate, and maintain our website and services</li>
              <li>• To improve, personalize, and expand our website and services</li>
              <li>• To understand and analyze how you use our website and services</li>
              <li>• To develop new products, services, features, and functionality</li>
              <li>• To communicate with you, either directly or through one of our partners, including for customer service</li>
              <li>• To process your transactions and send you related information</li>
              <li>• To send you marketing and promotional communications</li>
              <li>• To monitor and analyze usage patterns and trends</li>
              <li>• To detect, prevent, and address technical issues</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Sharing Your Information</h2>
            <p className="text-gray-600 font-playfair mb-4">
              We may share your personal information with the following categories of third parties:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• <strong>Service providers:</strong> Third-party vendors who perform services on our behalf</li>
              <li>• <strong>Business partners:</strong> Third-party companies with whom we offer joint products or services</li>
              <li>• <strong>Third-party advertisers:</strong> Companies that display advertisements on our website</li>
              <li>• <strong>Analytics providers:</strong> Third-party services that help us analyze usage patterns</li>
              <li>• <strong>Legal requirements:</strong> When required by law or to protect our rights</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-gray-600 font-playfair mb-4">
              We use cookies and similar tracking technologies to track the activity on our website and store certain information. 
              Cookies are files with a small amount of data which may include an anonymous unique identifier.
            </p>
            <p className="text-gray-600 font-playfair mb-4">
              Examples of Cookies we use:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• <strong>Session Cookies:</strong> We use Session Cookies to operate our website</li>
              <li>• <strong>Preference Cookies:</strong> We use Preference Cookies to remember your preferences</li>
              <li>• <strong>Security Cookies:</strong> We use Security Cookies for security purposes</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Your Privacy Rights</h2>
            <p className="text-gray-600 font-playfair mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• <strong>Access:</strong> Request access to your personal information</li>
              <li>• <strong>Correction:</strong> Request correction of your personal information</li>
              <li>• <strong>Deletion:</strong> Request deletion of your personal information</li>
              <li>• <strong>Portability:</strong> Request transfer of your personal information</li>
              <li>• <strong>Restriction:</strong> Request restriction of processing your personal information</li>
              <li>• <strong>Objection:</strong> Object to processing of your personal information</li>
            </ul>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Data Security</h2>
            <p className="text-gray-600 font-playfair mb-4">
              We have implemented appropriate technical and organizational security measures designed to protect 
              the security of any personal information we process. However, please also remember that we cannot 
              guarantee that the internet itself is 100% secure.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Children's Privacy</h2>
            <p className="text-gray-600 font-playfair mb-4">
              Our website is not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children under 13. If you are under 13, please do not provide any information on 
              this website or through any of its features.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">International Transfers</h2>
            <p className="text-gray-600 font-playfair mb-4">
              Your information, including personal information, may be transferred to — and maintained on — 
              computers located outside of your state, province, country, or other governmental jurisdiction 
              where the data protection laws may differ from those of your jurisdiction.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-600 font-playfair mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
            </p>

            <h2 className="text-2xl font-playfair text-navy mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-600 font-playfair mb-4">
              If you have questions or comments about this Privacy Policy, please contact us:
            </p>
            <ul className="text-gray-600 font-playfair mb-4 space-y-2">
              <li>• Email: <a href="mailto:privacy@dreamknot.co.in" className="text-deep-gold hover:text-navy">privacy@dreamknot.co.in</a></li>
              <li>• Mail: Privacy Officer, DreamKnot, 123 Gift Street, Mumbai, Maharashtra 400001, India</li>
            </ul>

            <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
              <h3 className="text-lg font-playfair font-semibold text-navy mb-2">Privacy Commitment</h3>
              <p className="text-gray-600 font-playfair">
                Your trust is important to us. We are committed to protecting your privacy and handling your 
                personal information responsibly. If you have any concerns about how we handle your data, 
                please don't hesitate to reach out to us.
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