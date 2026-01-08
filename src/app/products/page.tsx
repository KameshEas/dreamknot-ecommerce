'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ProductGrid from '@/components/ProductGrid'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Category {
  id: number
  name: string
}

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('none')
  const [priceRange, setPriceRange] = useState<string>('none')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryFilter = (category: string) => {
    if (category === selectedCategory) {
      setSelectedCategory('none')
    } else {
      setSelectedCategory(category)
      setPriceRange('none')
    }
  }

  const handleAdvancedFilter = (filterType: string, value: string) => {
    // For advanced filters, we would need to implement proper filtering logic
    // This is a placeholder for now
    console.log(`Filter: ${filterType} = ${value}`)
  }

  const handlePriceFilter = (range: string) => {
    if (range === priceRange) {
      setPriceRange('none')
    } else {
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

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="text-sm text-gray-500 font-playfair">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Products</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-playfair text-navy mb-4">
            Browse All Products
          </h1>
          <p className="text-xl text-gray-600 font-playfair max-w-2xl mx-auto">
            Find the perfect personalized gift for every occasion and budget.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCategoryFilter('')}
              className={`px-6 py-3 rounded-full font-playfair text-sm transition-all duration-200 ${
                selectedCategory === ''
                  ? 'bg-navy text-white shadow-lg'
                  : 'bg-white text-navy border border-gray-200 hover:border-deep-gold hover:bg-gray-50'
              }`}
            >
              All Products
            </button>

            {/* Category Filters */}
            {categories.slice(0, 3).map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.name)}
                className={`px-6 py-3 rounded-full font-playfair text-sm transition-all duration-200 ${
                  selectedCategory === category.name
                    ? 'bg-navy text-white shadow-lg'
                    : 'bg-white text-navy border border-gray-200 hover:border-deep-gold hover:bg-gray-50'
                }`}
              >
                {category.name}
              </button>
            ))}

            {/* Price Filters */}
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
              onClick={() => handlePriceFilter('₹500 - ₹1000')}
              className={`px-6 py-3 rounded-full font-playfair text-sm transition-all duration-200 ${
                priceRange === '₹500 - ₹1000'
                  ? 'bg-navy text-white shadow-lg'
                  : 'bg-white text-navy border border-gray-200 hover:border-deep-gold hover:bg-gray-50'
              }`}
            >
              ₹500 - ₹1000
            </button>
            <button
              onClick={() => handlePriceFilter('₹1000 - ₹2000')}
              className={`px-6 py-3 rounded-full font-playfair text-sm transition-all duration-200 ${
                priceRange === '₹1000 - ₹2000'
                  ? 'bg-navy text-white shadow-lg'
                  : 'bg-white text-navy border border-gray-200 hover:border-deep-gold hover:bg-gray-50'
              }`}
            >
              ₹1000 - ₹2000
            </button>
            <button
              onClick={() => handlePriceFilter('Over ₹2000')}
              className={`px-6 py-3 rounded-full font-playfair text-sm transition-all duration-200 ${
                priceRange === 'Over ₹2000'
                  ? 'bg-navy text-white shadow-lg'
                  : 'bg-white text-navy border border-gray-200 hover:border-deep-gold hover:bg-gray-50'
              }`}
            >
              Over ₹2000
            </button>
          </div>

          {/* Sort and View Options */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-playfair text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg font-playfair text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-4 py-2 bg-navy text-white font-playfair text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters (Mobile) */}
        {showFilters && (
          <div className="lg:hidden mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-playfair text-navy mb-4">Advanced Filters</h3>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="text-sm font-playfair font-semibold text-navy mb-3">Categories</h4>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryFilter(category.name)}
                    className={`px-4 py-2 rounded-lg font-playfair text-sm transition-all duration-200 ${
                      selectedCategory === category.name
                        ? 'bg-navy text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Ranges */}
            <div className="mb-6">
              <h4 className="text-sm font-playfair font-semibold text-navy mb-3">Price Range</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handlePriceFilter('Under ₹500')}
                  className={`px-4 py-2 rounded-lg font-playfair text-sm transition-all duration-200 ${
                    priceRange === 'Under ₹500'
                      ? 'bg-navy text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Under ₹500
                </button>
                <button
                  onClick={() => handlePriceFilter('₹500 - ₹1000')}
                  className={`px-4 py-2 rounded-lg font-playfair text-sm transition-all duration-200 ${
                    priceRange === '₹500 - ₹1000'
                      ? 'bg-navy text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ₹500 - ₹1000
                </button>
                <button
                  onClick={() => handlePriceFilter('₹1000 - ₹2000')}
                  className={`px-4 py-2 rounded-lg font-playfair text-sm transition-all duration-200 ${
                    priceRange === '₹1000 - ₹2000'
                      ? 'bg-navy text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ₹1000 - ₹2000
                </button>
                <button
                  onClick={() => handlePriceFilter('Over ₹2000')}
                  className={`px-4 py-2 rounded-lg font-playfair text-sm transition-all duration-200 ${
                    priceRange === 'Over ₹2000'
                      ? 'bg-navy text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Over ₹2000
                </button>
              </div>
            </div>

            {/* Product Types */}
            <div className="mb-6">
              <h4 className="text-sm font-playfair font-semibold text-navy mb-3">Product Type</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleCategoryFilter('physical')}
                  className={`px-4 py-2 rounded-lg font-playfair text-sm transition-all duration-200 ${
                    selectedCategory === 'physical'
                      ? 'bg-navy text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Physical
                </button>
                <button
                  onClick={() => handleCategoryFilter('digital')}
                  className={`px-4 py-2 rounded-lg font-playfair text-sm transition-all duration-200 ${
                    selectedCategory === 'digital'
                      ? 'bg-navy text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Digital
                </button>
                <button
                  onClick={() => handleCategoryFilter('service')}
                  className={`px-4 py-2 rounded-lg font-playfair text-sm transition-all duration-200 ${
                    selectedCategory === 'service'
                      ? 'bg-navy text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Service
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <h4 className="text-sm font-playfair font-semibold text-navy mb-3">Stock Status</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleCategoryFilter('in-stock')}
                  className={`px-4 py-2 rounded-lg font-playfair text-sm transition-all duration-200 ${
                    selectedCategory === 'in-stock'
                      ? 'bg-navy text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  In Stock
                </button>
                <button
                  onClick={() => handleCategoryFilter('low-stock')}
                  className={`px-4 py-2 rounded-lg font-playfair text-sm transition-all duration-200 ${
                    selectedCategory === 'low-stock'
                      ? 'bg-navy text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Low Stock
                </button>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="mb-6">
              <h4 className="text-sm font-playfair font-semibold text-navy mb-3">Delivery</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleCategoryFilter('two-day')}
                  className={`px-4 py-2 rounded-lg font-playfair text-sm transition-all duration-200 ${
                    selectedCategory === 'two-day'
                      ? 'bg-navy text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  2-Day
                </button>
                <button
                  onClick={() => handleCategoryFilter('standard')}
                  className={`px-4 py-2 rounded-lg font-playfair text-sm transition-all duration-200 ${
                    selectedCategory === 'standard'
                      ? 'bg-navy text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => handleCategoryFilter('express')}
                  className={`px-4 py-2 rounded-lg font-playfair text-sm transition-all duration-200 ${
                    selectedCategory === 'express'
                      ? 'bg-navy text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Express
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <ProductGrid
          category={selectedCategory === 'none' ? '' : selectedCategory}
          minPrice={priceParams.minPrice}
          maxPrice={priceParams.maxPrice}
          sortBy={sortBy}
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
