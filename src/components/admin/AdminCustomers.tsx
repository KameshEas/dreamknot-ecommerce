'use client'

import { useEffect, useState } from 'react'

interface Customer {
  id: number
  name: string
  email: string
  phone: string | null
  role: string
  email_notifications: boolean
  sms_notifications: boolean
  created_at: string
  total_spent: number
  last_order_date: string | null
  order_count: number
  review_count: number
  address_count: number
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchCustomers()
  }, [currentPage, searchTerm, roleFilter])

  const fetchCustomers = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        search: searchTerm,
        role: roleFilter
      })

      const response = await fetch(`/api/admin/customers?${params}`)
      if (response.ok) {
        const data = await response.json()
        setCustomers(data.customers)
      }
    } catch (error) {
      console.error('Fetch customers error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      const response = await fetch('/api/admin/customers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole })
      })

      if (response.ok) {
        setCustomers(customers.map(customer =>
          customer.id === userId
            ? { ...customer, role: newRole }
            : customer
        ))
        alert('User role updated successfully')
      } else {
        alert('Failed to update user role')
      }
    } catch (error) {
      console.error('Update role error:', error)
      alert('Failed to update user role')
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-gray-600 font-playfair">Loading customers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-playfair font-semibold text-navy mb-2">
              Search Customers
            </label>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl font-playfair focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-playfair font-semibold text-navy mb-2">
              Filter by Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl font-playfair focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent min-w-48"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="staff">Staff</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-playfair font-bold text-navy">
            Customers ({customers.length})
          </h2>
        </div>

        {customers.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="text-lg font-playfair text-gray-600 mb-2">No customers found</h3>
            <p className="text-gray-500 font-playfair">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-playfair">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-playfair">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-playfair">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-playfair">
                    Stats
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-playfair">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-navy font-playfair">{customer.name}</div>
                        <div className="text-sm text-gray-500 font-playfair">
                          Joined {new Date(customer.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-navy font-playfair">{customer.email}</div>
                        {customer.phone && (
                          <div className="text-sm text-gray-500 font-playfair">{customer.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        customer.role === 'admin'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : customer.role === 'staff'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {customer.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-playfair">
                        <div className="text-navy font-semibold">₹{customer.total_spent.toFixed(2)} spent</div>
                        <div className="text-gray-500">{customer.order_count} orders</div>
                        <div className="text-gray-500">{customer.review_count} reviews</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={customer.role}
                        onChange={(e) => updateUserRole(customer.id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-playfair focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent bg-white"
                      >
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
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
