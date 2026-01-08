'use client'
import Link from 'next/link'
import Header from '@/components/Header'
import { useState } from 'react'

export default function FAQs() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  const faqs = [
    {
      category: 'General Questions',
      questions: [
        {
          question: 'What makes DreamKnot gifts special?',
          answer: 'DreamKnot specializes in personalized gifts that tell your unique story. Every item is custom-made with your photos, names, dates, or messages, creating one-of-a-kind gifts that show the thought and care you put into choosing the perfect present.'
        },
        {
          question: 'Are your products really made-to-order?',
          answer: 'Yes! Every DreamKnot gift is created fresh after you place your order. This ensures the highest quality and allows us to incorporate your exact customization details. While this means slightly longer production times than mass-produced items, it guarantees your gift is truly unique.'
        },
        {
          question: 'How long does it take to receive my order?',
          answer: 'Most orders ship within 3-5 business days after we receive your order. Delivery typically takes 2-7 business days within India, depending on your location. We offer express shipping options for faster delivery on select products.'
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Currently, we ship only within India. We\'re working on expanding our international shipping options and will update this page when available.'
        }
      ]
    },
    {
      category: 'Customization & Design',
      questions: [
        {
          question: 'How do I upload photos for my gift?',
          answer: 'During the customization process, you\'ll see an option to upload photos. We accept JPG, PNG, and PDF files. For best results, use high-resolution images (300 DPI or higher) with good lighting and clear subjects.'
        },
        {
          question: 'Can I preview my design before ordering?',
          answer: 'Absolutely! We provide a real-time preview of your customization as you make changes. This allows you to see exactly how your gift will look before you complete your purchase. If something doesn\'t look right, you can adjust it before checkout.'
        },
        {
          question: 'What if I make a mistake in my customization?',
          answer: 'We review every order for accuracy before production begins. If we notice any issues with spelling, alignment, or image quality, we\'ll contact you before proceeding. However, please double-check your customization details carefully, as we cannot be responsible for errors you approve.'
        },
        {
          question: 'Can I add text to photo gifts?',
          answer: 'Yes! Most of our photo gifts allow you to add custom text. You can include names, dates, special messages, or any text you\'d like. Our design preview will show you exactly how the text will appear on your gift.'
        }
      ]
    },
    {
      category: 'Shipping & Delivery',
      questions: [
        {
          question: 'How much is shipping?',
          answer: 'Shipping costs vary based on package weight and destination, ranging from ₹40-₹80 for standard delivery within India. We offer free shipping on orders over ₹1500. Express shipping is available for an additional fee on select products.'
        },
        {
          question: 'Can I track my order?',
          answer: 'Yes! Once your order ships, we\'ll send you a confirmation email with tracking information. You can use this to track your package through our shipping partner\'s website.'
        },
        {
          question: 'What if my package is delayed?',
          answer: 'While we strive for timely delivery, occasionally packages may be delayed due to factors beyond our control (weather, carrier delays, etc.). If your order is significantly delayed, please contact us and we\'ll help investigate.'
        },
        {
          question: 'Do you offer gift wrapping?',
          answer: 'All our gifts are packaged with care and include premium wrapping materials. While we don\'t offer traditional gift wrapping, our packaging is designed to make your gift presentation-ready.'
        }
      ]
    },
    {
      category: 'Returns & Exchanges',
      questions: [
        {
          question: 'Can I return a personalized gift?',
          answer: 'Due to the custom nature of our products, we cannot accept returns or provide refunds for personalized items that are made exactly to your specifications. However, we will replace or refund items that arrive damaged, defective, or incorrect due to our error.'
        },
        {
          question: 'What if my gift arrives damaged?',
          answer: 'We\'re sorry to hear that! Please contact us within 7 days of receiving your order and provide photos of the damage. We\'ll work with you to resolve the issue quickly, either with a replacement or refund.'
        },
        {
          question: 'Can I cancel my order?',
          answer: 'You may cancel your order within 30 minutes of placing it, provided that the order has not yet entered the production phase. Once production begins, we cannot cancel or modify your order as it\'s being custom-made for you.'
        },
        {
          question: 'What if I received the wrong item?',
          answer: 'If you received an item that was not what you ordered, please contact us within 7 days with your order number and photos of the incorrect item. We\'ll send you the correct item at no additional cost.'
        }
      ]
    },
    {
      category: 'Product Care',
      questions: [
        {
          question: 'How do I care for my personalized gift?',
          answer: 'Care instructions vary by product type. Most items come with specific care instructions. Generally, we recommend hand washing mugs, avoiding harsh chemicals on printed surfaces, and storing items in a cool, dry place away from direct sunlight.'
        },
        {
          question: 'Will the colors fade over time?',
          answer: 'We use high-quality printing techniques and materials designed to resist fading. However, to maintain the best appearance, avoid prolonged exposure to direct sunlight and follow the care instructions provided with your item.'
        },
        {
          question: 'Are your products safe for food use?',
          answer: 'Yes, all our food-safe products (like mugs and plates) are made with food-safe materials and inks. They meet all relevant safety standards for food contact.'
        }
      ]
    },
    {
      category: 'Technical Issues',
      questions: [
        {
          question: 'What browsers work best with your website?',
          answer: 'Our website works best with the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, please ensure your browser is up to date.'
        },
        {
          question: 'I\'m having trouble uploading my photos. What should I do?',
          answer: 'Make sure your photos are in JPG, PNG, or PDF format and under 10MB in size. Try refreshing the page or using a different browser. If you continue to have issues, contact our support team for assistance.'
        },
        {
          question: 'My customization preview looks blurry. Is this normal?',
          answer: 'The preview is optimized for fast loading and may appear slightly blurry on screen. The final printed product will be crisp and clear. If you\'re concerned about image quality, feel free to contact us before placing your order.'
        }
      ]
    }
  ]

  // Filter function for search
  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="text-sm text-gray-500 font-playfair">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">FAQs</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-playfair text-navy mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 font-playfair max-w-2xl mx-auto">
              Find answers to common questions about our personalized gifts, 
              customization process, shipping, and more.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
              />
              <svg className="absolute right-4 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredFaqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-navy text-white px-6 py-4">
                  <h2 className="text-xl font-playfair font-semibold">{category.category}</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {category.questions.map((faq, faqIndex) => (
                    <details key={faqIndex} className="group">
                      <summary className="flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-gray-50 transition-colors">
                        <h3 className="text-lg font-playfair font-medium text-navy group-hover:text-deep-gold transition-colors">
                          {faq.question}
                        </h3>
                        <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-6 pb-5 text-gray-600 font-playfair leading-relaxed">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 bg-gradient-to-r from-deep-gold to-navy rounded-2xl p-8 text-white">
            <div className="text-center">
              <h2 className="text-2xl font-playfair font-bold mb-4">Still Have Questions?</h2>
              <p className="text-lg mb-6 opacity-90">
                We're here to help you create the perfect personalized gift.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact" 
                  className="bg-white text-navy px-8 py-3 rounded-lg font-playfair font-semibold hover:bg-gray-100 transition-colors"
                >
                  Contact Us
                </Link>
                <Link 
                  href="/gift-finder" 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-playfair font-semibold hover:bg-white hover:text-navy transition-colors"
                >
                  Find Your Perfect Gift
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-playfair font-semibold text-navy mb-3">Shipping Info</h3>
              <p className="text-sm text-gray-600 font-playfair mb-4">
                Learn about our shipping options, delivery times, and tracking.
              </p>
              <Link href="/shipping-policy" className="text-deep-gold font-playfair hover:text-navy transition-colors">
                View Shipping Policy →
              </Link>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-playfair font-semibold text-navy mb-3">Returns & Exchanges</h3>
              <p className="text-sm text-gray-600 font-playfair mb-4">
                Understand our return policy and what to do if something goes wrong.
              </p>
              <Link href="/return-refund-policy" className="text-deep-gold font-playfair hover:text-navy transition-colors">
                View Return Policy →
              </Link>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="font-playfair font-semibold text-navy mb-3">Customization Help</h3>
              <p className="text-sm text-gray-600 font-playfair mb-4">
                Get tips and guidelines for creating the perfect custom gift.
              </p>
              <Link href="/contact" className="text-deep-gold font-playfair hover:text-navy transition-colors">
                Get Design Help →
              </Link>
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
                <li><Link href="/faqs" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping</Link></li>
                <li><Link href="/cancellation-policy" className="hover:text-white transition-colors">Returns</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-playfair font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300 font-playfair text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white transition-colors">Press</Link></li>
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