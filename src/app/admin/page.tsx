'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminOrders from '@/components/admin/AdminOrders'
import AdminCustomers from '@/components/admin/AdminCustomers'
import AdminInventory from '@/components/admin/AdminInventory'
import AdminReports from '@/components/admin/AdminReports'

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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Fetch orders error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_status: newStatus })
      })

      if (response.ok) {
        setOrders(orders.map(order =>
          order.id === orderId
            ? { ...order, order_status: newStatus }
            : order
        ))
      } else {
        alert('Failed to update order status')
      }
    } catch (error) {
      console.error('Update order error:', error)
      alert('Failed to update order status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in_production': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'shipped': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '⏳'
      case 'processing': return '⚙️'
      case 'in_production': return '🎨'
      case 'shipped': return '🚚'
      case 'delivered': return '✅'
      case 'cancelled': return '❌'
      default: return '📋'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.order_status === filter
    const matchesSearch = searchTerm === '' ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm)
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.order_status === 'pending').length,
    processing: orders.filter(o => o.order_status === 'processing').length,
    shipped: orders.filter(o => o.order_status === 'shipped').length,
    delivered: orders.filter(o => o.order_status === 'delivered').length,
    revenue: orders.reduce((sum, o) => sum + o.total_amount, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-gray-600 font-playfair">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-navy to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-great-vibes text-2xl">D</span>
              </div>
              <div>
                <h1 className="text-2xl font-great-vibes text-navy">DreamKnot</h1>
                <p className="text-sm text-gray-600 font-playfair">Admin Dashboard</p>
              </div>
            </div>

            <nav className="flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-navy font-playfair transition-colors">
                ← Back to Store
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-4">
            {[
              { id: 'orders', label: 'Orders', icon: '📋' },
              { id: 'customers', label: 'Customers', icon: '👥' },
              { id: 'inventory', label: 'Inventory', icon: '📦' },
              { id: 'reports', label: 'Reports', icon: '📊' },
              { id: 'staff', label: 'Staff', icon: '👷' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-playfair font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-navy text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-playfair">Total Orders</p>
                    <p className="text-3xl font-bold text-navy">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-playfair">Pending Orders</p>
                    <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⏳</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-playfair">Processing</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.processing}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⚙️</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-playfair">Total Revenue</p>
                    <p className="text-3xl font-bold text-emerald-600">₹{stats.revenue.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Component */}
            <AdminOrders
              orders={orders}
              loading={loading}
              onStatusUpdate={updateOrderStatus}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          </>
        )}

        {activeTab === 'customers' && <AdminCustomers />}
        {activeTab === 'inventory' && <AdminInventory />}
        {activeTab === 'reports' && <AdminReports />}
        {activeTab === 'staff' && <div className="text-center py-16"><p className="text-gray-600">Staff management coming soon...</p></div>}
      </div>
    </div>
  )
}
