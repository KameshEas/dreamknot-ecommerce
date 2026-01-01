'use client'

import { useState } from 'react'

interface Order {
  id: number
  user: {
    name: string
    email: string
  }
  total_amount: number
  order_status: string
  payment_status: string
  created_at: string
  order_items: {
    product: { title: string }
    qty: number
  }[]
}

interface AdminOrdersProps {
  orders: Order[]
  loading: boolean
  onStatusUpdate: (orderId: number, newStatus: string) => void
  getStatusColor: (status: string) => string
  getStatusIcon: (status: string) => string
}

export default function AdminOrders({
  orders,
  loading,
  onStatusUpdate,
  getStatusColor,
  getStatusIcon
}: AdminOrdersProps) {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.order_status === filter
    const matchesSearch = searchTerm === '' ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm)
    return matchesFilter && matchesSearch
  })

  const handleBulkUpdate = async (newStatus: string) => {
    if (selectedOrders.length === 0) {
      alert('Please select orders to update')
      return
    }

    try {
      const response = await fetch('/api/admin/orders/bulk', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderIds: selectedOrders,
          action: 'update_status',
          status: newStatus
        })
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Successfully updated ${data.updated_count} orders`)

        // Refresh orders
        window.location.reload()
      } else {
        alert('Failed to update orders')
      }
    } catch (error) {
      console.error('Bulk update error:', error)
      alert('Failed to update orders')
    }
  }

  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const selectAllOrders = () => {
    setSelectedOrders(filteredOrders.map(order => order.id))
  }

  const clearSelection = () => {
    setSelectedOrders([])
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-gray-600 font-playfair">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-playfair font-semibold text-blue-800">
                {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={clearSelection}
                className="text-sm text-blue-600 hover:text-blue-800 font-playfair underline"
              >
                Clear selection
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkUpdate('processing')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-playfair hover:bg-blue-700 transition-colors"
              >
                Mark as Processing
              </button>
              <button
                onClick={() => handleBulkUpdate('shipped')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-playfair hover:bg-green-700 transition-colors"
              >
                Mark as Shipped
              </button>
              <button
                onClick={() => handleBulkUpdate('delivered')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-playfair hover:bg-emerald-700 transition-colors"
              >
                Mark as Delivered
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-playfair font-semibold text-navy mb-2">
              Search Orders
            </label>
            <input
              type="text"
              placeholder="Search by order ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl font-playfair focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-playfair font-semibold text-navy mb-2">
              Filter by Status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl font-playfair focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent min-w-48"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="in_production">In Production</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={selectAllOrders}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-playfair hover:bg-gray-200 transition-colors"
            >
              Select All
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-playfair font-bold text-navy">
            Orders ({filteredOrders.length})
          </h2>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-playfair text-gray-600 mb-2">No orders found</h3>
            <p className="text-gray-500 font-playfair">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          selectAllOrders()
                        } else {
                          clearSelection()
                        }
                      }}
                      className="rounded border-gray-300 text-navy focus:ring-navy"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-playfair">
                    Order Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-playfair">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-playfair">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-playfair">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-playfair">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                        className="rounded border-gray-300 text-navy focus:ring-navy"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-navy font-playfair">
                          #{order.id.toString().padStart(6, '0')}
                        </div>
                        <div className="text-sm text-gray-500 font-playfair">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500 font-playfair">
                          {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-navy font-playfair">{order.user.name}</div>
                        <div className="text-sm text-gray-500 font-playfair">{order.user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.order_status)}`}>
                        <span className="mr-2">{getStatusIcon(order.order_status)}</span>
                        {order.order_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-navy font-playfair">
                      ₹{order.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.order_status}
                        onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-playfair focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="in_production">In Production</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
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
