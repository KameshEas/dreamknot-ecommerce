'use client'

import { useState, useEffect } from 'react'

interface Category {
  id: number
  name: string
}

interface SearchFiltersProps {
  onSearch: (filters: {
    search: string
    category: string
    minPrice: string
    maxPrice: string
    sortBy: string
  }) => void
  categories: Category[]
}

export default function SearchFilters({ onSearch, categories }: SearchFiltersProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch({ search, category, minPrice, maxPrice, sortBy })
    }, 300)

    return () => clearTimeout(timer)
  }, [search, category, minPrice, maxPrice, sortBy, onSearch])

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    setSortBy('newest')
  }

  const hasActiveFilters = search || category || minPrice || maxPrice || sortBy !== 'newest'

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Toggle & Sort */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="px-4 py-3 border border-gray-300 rounded-lg font-playfair text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {hasActiveFilters && (
                <span className="bg-navy text-white text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Expandable Filters */}
        {isFiltersOpen && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-playfair font-semibold text-navy mb-3">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-playfair font-semibold text-navy mb-3">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-playfair font-semibold text-navy mb-3">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="No limit"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                />
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-navy font-playfair font-semibold hover:text-blue-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
