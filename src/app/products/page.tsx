'use client'

import { useEffect, useState } from 'react'
import SearchFilters from '@/components/SearchFilters'
import ProductGrid from '@/components/ProductGrid'
import Header from '@/components/Header'

interface Category {
  id: number
  name: string
}

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest'
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Categories fetch error:', error)
    }
  }

  const handleSearch = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Page Header with Premium Styling */}
        <div className="text-center mb-16 relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-1/4 w-20 h-20 border-2 border-deep-gold rounded-full"></div>
            <div className="absolute bottom-10 right-1/4 w-16 h-16 border-2 border-navy rounded-full"></div>
          </div>

          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-great-vibes text-navy mb-6 animate-fade-in">
              Our <span className="text-transparent bg-gradient-to-r from-deep-gold via-light-gold to-deep-gold bg-clip-text">Products</span>
            </h1>
            <p className="text-xl text-gray-600 font-playfair max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Discover our collection of customizable products. Find the perfect item to personalize for your special occasion.
            </p>
          </div>
        </div>

        {/* Search and Filters with Enhanced Styling */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <SearchFilters onSearch={handleSearch} categories={categories} />
        </div>

        {/* Products Grid with Premium Spacing */}
        <div className="py-12">
          <ProductGrid
            search={filters.search}
            category={filters.category}
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            sortBy={filters.sortBy}
          />
        </div>

        {/* Premium Call to Action */}
        <div className="relative mt-20 mb-16">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-light-gold/10 via-transparent to-deep-gold/10 rounded-3xl"></div>

          <div className="relative z-10 text-center py-16 bg-gradient-to-br from-off-white to-white rounded-3xl shadow-xl border border-light-gold/20">
            {/* Decorative elements */}
            <div className="absolute top-6 left-6 w-12 h-12 border-2 border-deep-gold/30 rounded-full"></div>
            <div className="absolute bottom-6 right-6 w-8 h-8 border-2 border-navy/30 rounded-full"></div>

            <div className="max-w-2xl mx-auto px-8">
              <h3 className="text-4xl md:text-5xl font-great-vibes text-navy mb-6 animate-fade-in">
                Can't Find What You're Looking For?
              </h3>
              <p className="text-lg text-gray-600 font-playfair mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                We can help customize any product to your specific needs. Contact us for custom orders and special requests.
              </p>
              <button className="btn-premium text-lg px-10 py-4 shadow-2xl hover:shadow-glow animate-scale-in" style={{ animationDelay: '0.4s' }}>
                Contact Us
                <svg className="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 mt-24 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-deep-gold rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-light-gold rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border-2 border-white/30 rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center shadow-xl">
                    <span className="text-navy font-great-vibes text-lg">D</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-gold rounded-full animate-float"></div>
                </div>
                <span className="text-2xl font-great-vibes text-white">DreamKnot</span>
              </div>
              <p className="text-gray-300 font-playfair text-base leading-relaxed mb-6">
                Making personalized gifts simple, beautiful, and meaningful for every special moment.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.84-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.012.017z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.84-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.012.017z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-playfair font-bold text-white mb-6 text-lg">Products</h3>
              <ul className="space-y-3 text-gray-300 font-playfair">
                <li><a href="/products" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Mugs</a></li>
                <li><a href="/products" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">T-Shirts</a></li>
                <li><a href="/products" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Pillows</a></li>
                <li><a href="/products" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Custom Items</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-playfair font-bold text-white mb-6 text-lg">Support</h3>
              <ul className="space-y-3 text-gray-300 font-playfair">
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Help Center</a></li>
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Shipping</a></li>
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Returns</a></li>
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-playfair font-bold text-white mb-6 text-lg">Company</h3>
              <ul className="space-y-3 text-gray-300 font-playfair">
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">About Us</a></li>
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Blog</a></li>
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Careers</a></li>
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Press</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 font-playfair text-base">
              &copy; 2025 DreamKnot. Made with <span className="text-red-400 animate-pulse">♥</span> for personalized gifting.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
