'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ProductGrid from '@/components/ProductGrid'
import FeaturedProducts from '@/components/FeaturedProducts'
import Header from '@/components/Header'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('none')
  const [priceRange, setPriceRange] = useState<string>('none')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const handleCategoryFilter = (category: string) => {
    if (category === selectedCategory) {
      // Clicking the same category again deselects it
      setSelectedCategory('none')
    } else {
      // Clicking a different category selects it and clears price filter
      setSelectedCategory(category)
      setPriceRange('none')
    }
  }

  const handlePriceFilter = (range: string) => {
    if (range === priceRange) {
      // Clicking the same price range again deselects it
      setPriceRange('none')
    } else {
      // Clicking a different price range selects it and clears category filter
      setPriceRange(range)
      setSelectedCategory('none')
    }
  }

  const getPriceParams = (range: string) => {
    switch (range) {
      case 'Under ₹500':
        return { minPrice: '0', maxPrice: '500' }
      case '₹500 - ₹1000':
        return { minPrice: '500', maxPrice: '1000' }
      case '₹1000 - ₹2000':
        return { minPrice: '1000', maxPrice: '2000' }
      case 'Over ₹2000':
        return { minPrice: '2000', maxPrice: '' }
      default:
        return {}
    }
  }

  const priceParams = getPriceParams(priceRange)

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <Header />

      {/* Category Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left-aligned text block */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-playfair font-bold text-navy leading-tight">
                Your First Personalized Gift — Made Simple
              </h1>
              <p className="text-lg text-gray-600 font-playfair leading-relaxed max-w-lg">
                No confusing tools. No guesswork. Preview before you buy.
                {"If something's not right, we fix it."}
              </p>
              <div className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/gift-finder"
                    className="bg-deep-gold text-navy font-playfair font-semibold px-8 py-4 rounded-lg hover:bg-opacity-90 transition-colors text-base inline-block text-center"
                  >
                    👉 Create Gift
                  </Link>
                  <Link
                    href="/products"
                    className="bg-white border-2 border-navy text-navy font-playfair font-semibold px-8 py-4 rounded-lg hover:bg-navy hover:text-white transition-colors text-base"
                  >
                    Gifts That Mean More — Explore All
                  </Link>
                </div>
                <p className="text-sm text-gray-500 font-playfair mt-4">
                  Free preview • Easy edits • Fast delivery
                </p>
              </div>
            </div>

            {/* Right-aligned hero image */}
            <div className="lg:pl-12">
              <div className="relative h-80 w-full rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/hero-img.png"
                  alt="DreamKnot Personalized Gifts"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FeaturedProducts />
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-playfair font-semibold text-navy mb-6">
              Why DreamKnot?
            </h2>
            <p className="text-xl text-gray-600 font-playfair leading-relaxed max-w-3xl mx-auto">
              {"Buying a personalized gift shouldn't feel risky. DreamKnot is designed to make your first one easy and stress-free."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-deep-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-deep-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-playfair text-navy mb-3">Premium Quality</h3>
              <p className="text-gray-600 font-playfair leading-relaxed">
                Every product is sourced from trusted manufacturers, ensuring exceptional quality that lasts. We never compromise on materials or craftsmanship.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-deep-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-deep-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-playfair text-navy mb-3">Personal Touch</h3>
              <p className="text-gray-600 font-playfair leading-relaxed">
                Your stories deserve to be told beautifully. Our intuitive customization tools make it easy to add meaningful personal touches to every gift.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-deep-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-deep-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-playfair text-navy mb-3">Fast Delivery</h3>
              <p className="text-gray-600 font-playfair leading-relaxed">
                Premium service includes expedited production and shipping. Your personalized gifts arrive when you need them, without compromising quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Transparency */}
      <section className="py-20 bg-off-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-playfair font-semibold text-navy mb-6">
              How Your Gift Comes to Life
            </h2>
            <p className="text-xl text-gray-600 font-playfair leading-relaxed max-w-3xl mx-auto">
              {"You'll see exactly what your gift looks like before checkout."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 bg-navy text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-playfair text-navy">Choose a Gift</h3>
                <p className="text-gray-600 font-playfair leading-relaxed">
                  Carefully selected products that work beautifully with personalization.
                </p>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 bg-deep-gold text-navy rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-playfair text-navy">We Perfect Your Design</h3>
                <p className="text-gray-600 font-playfair leading-relaxed">
                  Our team checks alignment, spelling, and layout before production begins.
                </p>
                <p className="text-sm text-gray-500 font-playfair italic">
                  A real person checks every name and layout.
                </p>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 bg-navy text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  3
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-playfair text-navy">Crafted & Shipped Fast</h3>
                <p className="text-gray-600 font-playfair leading-relaxed">
                  Made-to-order and delivered securely with premium packaging.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders' Promise */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-playfair font-semibold text-navy mb-6">
            A Thoughtful Gift, Done Right
          </h2>
          <p className="text-xl text-gray-600 font-playfair leading-relaxed mb-8">
            DreamKnot is just getting started — and that means every order matters.
            We personally review each customization to ensure it looks perfect before it ships.
          </p>
          <div className="bg-off-white rounded-2xl p-8 max-w-2xl mx-auto">
            <blockquote className="text-lg font-playfair text-navy italic mb-4">
              {"If it's not something we'd gift our own family, we won't send it."}
            </blockquote>
            <cite className="text-sm text-gray-600 font-playfair">
              — Kamesh S, Founder<br />
              <span className="text-xs">Started DreamKnot to make gifting feel thoughtful again.</span>
            </cite>
          </div>
        </div>
      </section>

      {/* Early Traction Signals */}
      <section className="py-12 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-deep-gold rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-playfair font-semibold">Now accepting custom orders</h3>
              <p className="text-sm font-playfair text-gray-300">Fresh, made-to-order gifts ready for your personal touch</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-deep-gold rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-playfair font-semibold">Handcrafted in small batches</h3>
              <p className="text-sm font-playfair text-gray-300">Each piece made with care and attention to detail</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-deep-gold rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-playfair font-semibold">Limited daily production</h3>
              <p className="text-sm font-playfair text-gray-300">To ensure quality and attention to every detail</p>
            </div>
          </div>
        </div>
      </section>



      {/* Full Product Catalog */}
      <section className="py-20 bg-off-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-playfair font-semibold text-navy mb-4">
              Browse All Gifts
            </h2>
            <p className="text-lg text-gray-600 font-playfair max-w-2xl mx-auto">
              Find the perfect personalized gift for every occasion.
            </p>
          </div>

          {/* Horizontal Intent Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => handleCategoryFilter('')}
              className={`px-6 py-3 rounded-full font-playfair text-sm transition-all duration-200 ${
                selectedCategory === ''
                  ? 'bg-navy text-white shadow-lg'
                  : 'bg-white text-navy border border-gray-200 hover:border-deep-gold hover:bg-gray-50'
              }`}
            >
              All Gifts
            </button>
            <button
              onClick={() => handleCategoryFilter('Birthday')}
              className={`px-6 py-3 rounded-full font-playfair text-sm transition-all duration-200 ${
                selectedCategory === 'Birthday'
                  ? 'bg-navy text-white shadow-lg'
                  : 'bg-white text-navy border border-gray-200 hover:border-deep-gold hover:bg-gray-50'
              }`}
            >
              Birthday
            </button>
            <button
              onClick={() => handleCategoryFilter('For Couples')}
              className={`px-6 py-3 rounded-full font-playfair text-sm transition-all duration-200 ${
                selectedCategory === 'For Couples'
                  ? 'bg-navy text-white shadow-lg'
                  : 'bg-white text-navy border border-gray-200 hover:border-deep-gold hover:bg-gray-50'
              }`}
            >
              For Couples
            </button>
            <button
              onClick={() => handlePriceFilter('Under ₹500')}
              className={`px-6 py-3 rounded-full font-playfair text-sm transition-all duration-200 ${
                priceRange === 'Under ₹500'
                  ? 'bg-navy text-white shadow-lg'
                  : 'bg-white text-navy border border-gray-200 hover:border-deep-gold hover:bg-gray-50'
              }`}
            >
              Under ₹500
            </button>
            <button
              onClick={() => handlePriceFilter('fast-delivery')}
              className={`px-6 py-3 rounded-full font-playfair text-sm transition-all duration-200 ${
                priceRange === 'fast-delivery'
                  ? 'bg-navy text-white shadow-lg'
                  : 'bg-white text-navy border border-gray-200 hover:border-deep-gold hover:bg-gray-50'
              }`}
            >
              Fast Delivery
            </button>
          </div>

          {/* Product Grid */}
          <ProductGrid
            minPrice={priceParams.minPrice}
            maxPrice={priceParams.maxPrice}
          />
        </div>
      </section>


    </div>
  );
}
