'use client'

import { useEffect, useState } from 'react'

interface Product {
  id: number
  title: string
  base_price: number
  stock_quantity: number
  is_available: boolean
  sku: string | null
  category: {
    id: number
    name: string
  }
  total_sold: number
  review_count: number
  stock_status: string
  created_at: string
}

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [stockStatusFilter, setStockStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [alerts, setAlerts] = useState({ low_stock_count: 0, low_stock_products: [] })

  useEffect(() => {
    fetchInventory()
  }, [currentPage, searchTerm, categoryFilter, stockStatusFilter])

  const fetchInventory = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        search: searchTerm,
        category: categoryFilter,
        stock_status: stockStatusFilter
      })

      const response = await fetch(`/api/admin/inventory?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
        setAlerts(data.alerts)
      }
    } catch (error) {
      console.error('Fetch inventory error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (productId: number, updates: any) => {
    try {
      const response = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, updates })
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(products.map(product =>
          product.id === productId ? data.product : product
        ))
        alert('Product updated successfully')
      } else {
        alert('Failed to update product')
      }
    } catch (error) {
      console.error('Update product error:', error)
      alert('Failed to update product')
    }
  }

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'out_of_stock': return 'bg-red-100 text-red-800 border-red-200'
      case 'low_stock': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'in_stock': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-gray-600 font-playfair">Loading inventory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Low Stock Alerts */}
      {alerts.low_stock_count > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="text-lg font-playfair font-semibold text-amber-800">
                Low Stock Alert
              </h3>
              <p className="text-amber-700 font-playfair">
                {alerts.low_stock_count} product{alerts.low_stock_count !== 1 ? 's' : ''} are running low on stock
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-playfair font-semibold text-navy mb-2">
              Search Products
            </label>
            <input
              type="text"
              placeholder="Search by title or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl font-playfair focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-playfair font-semibold text-navy mb-2">
              Stock Status
            </label>
            <select
              value={stockStatusFilter}
              onChange={(e) => setStockStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl font-playfair focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent min-w-48"
            >
              <option value="all">All Stock</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-playfair font-bold text-navy">
            Inventory ({products.length})
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-lg font-playfair text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500 font-playfair">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-playfair">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-playfair">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-playfair">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-playfair">
                    Sales
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-playfair">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-navy font-playfair">{product.title}</div>
                        <div className="text-sm text-gray-500 font-playfair">{product.category.name}</div>
                        {product.sku && (
                          <div className="text-xs text-gray-400 font-playfair">SKU: {product.sku}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStockStatusColor(product.stock_status)}`}>
                          {product.stock_quantity}
                        </span>
                        {!product.is_available && (
                          <span className="text-xs text-red-600 font-semibold">UNAVAILABLE</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-navy font-playfair">
                      ₹{product.base_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-playfair">
                        <div className="text-navy font-semibold">{product.total_sold} sold</div>
                        <div className="text-gray-500">{product.review_count} reviews</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Stock"
                          defaultValue={product.stock_quantity}
                          onBlur={(e) => {
                            const newStock = parseInt(e.target.value)
                            if (newStock !== product.stock_quantity) {
                              updateProduct(product.id, { stock_quantity: newStock })
                            }
                          }}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm font-playfair focus:outline-none focus:ring-1 focus:ring-navy"
                        />
                        <button
                          onClick={() => updateProduct(product.id, { is_available: !product.is_available })}
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            product.is_available
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {product.is_available ? 'Available' : 'Unavailable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
