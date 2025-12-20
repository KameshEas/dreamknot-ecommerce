'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Image from 'next/image'
import Link from 'next/link'

interface UserProfile {
  id: number
  name: string
  email: string
  phone?: string
  avatar?: string
  date_of_birth?: string
  gender?: string
  bio?: string
  preferences?: any
  email_notifications: boolean
  sms_notifications: boolean
  created_at: string
  updated_at: string
  _count: {
    orders: number
    wishlists: number
    addresses: number
  }
}

interface Address {
  id: number
  name: string
  address_line: string
  city: string
  state: string
  zip: string
  country: string
  is_default: boolean
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    gender: '',
    date_of_birth: '',
    email_notifications: true,
    sms_notifications: false
  })

  useEffect(() => {
    fetchProfile()
    fetchAddresses()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        setFormData({
          name: data.user.name || '',
          phone: data.user.phone || '',
          bio: data.user.bio || '',
          gender: data.user.gender || '',
          date_of_birth: data.user.date_of_birth ? new Date(data.user.date_of_birth).toISOString().split('T')[0] : '',
          email_notifications: data.user.email_notifications,
          sms_notifications: data.user.sms_notifications
        })
      }
    } catch (error) {
      console.error('Fetch profile error:', error)
    }
  }

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/user/addresses')
      if (response.ok) {
        const data = await response.json()
        setAddresses(data.addresses)
      }
    } catch (error) {
      console.error('Fetch addresses error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchProfile()
        setEditing(false)
        alert('Profile updated successfully!')
      } else {
        alert('Failed to update profile')
      }
    } catch (error) {
      console.error('Update profile error:', error)
      alert('Failed to update profile')
    }
  }

  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setAddresses(addresses.filter(addr => addr.id !== addressId))
      } else {
        alert('Failed to delete address')
      }
    } catch (error) {
      console.error('Delete address error:', error)
      alert('Failed to delete address')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-navy font-playfair">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-playfair">Please log in to view your profile</p>
          <Link href="/auth/login" className="text-navy hover:text-blue-600 font-playfair underline mt-4 inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  fill
                  className="object-cover rounded-full"
                />
              ) : (
                <span className="text-2xl font-great-vibes text-navy">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-great-vibes text-navy mb-2">{profile.name}</h1>
              <p className="text-gray-600 font-playfair mb-2">{profile.email}</p>
              <p className="text-sm text-gray-500 font-playfair">
                Member since {new Date(profile.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long'
                })}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-navy font-playfair">{profile._count.orders}</div>
              <div className="text-sm text-gray-600 font-playfair">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-navy font-playfair">{profile._count.wishlists}</div>
              <div className="text-sm text-gray-600 font-playfair">Wishlist Items</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-navy font-playfair">{profile._count.addresses}</div>
              <div className="text-sm text-gray-600 font-playfair">Saved Addresses</div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: 'profile', label: 'Profile', icon: '👤' },
              { id: 'addresses', label: 'Addresses', icon: '📍' },
              { id: 'preferences', label: 'Preferences', icon: '⚙️' }
          ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-sans text-sm font-medium transition-colors duration-200 touch-target ${
                  activeTab === tab.id
                    ? 'border-navy text-navy'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <span className="flex items-center space-x-2">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-great-vibes text-navy">Personal Information</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 bg-navy text-white font-playfair font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {editing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-playfair font-semibold text-navy mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-playfair font-semibold text-navy mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-playfair font-semibold text-navy mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-playfair font-semibold text-navy mb-2">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-playfair font-semibold text-navy mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent resize-none"
                    placeholder="Tell us a little about yourself..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-playfair font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-navy text-white font-playfair font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-playfair font-semibold text-navy mb-2">Full Name</h3>
                    <p className="text-gray-900 font-playfair">{profile.name}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-playfair font-semibold text-navy mb-2">Email</h3>
                    <p className="text-gray-900 font-playfair">{profile.email}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-playfair font-semibold text-navy mb-2">Phone</h3>
                    <p className="text-gray-900 font-playfair">{profile.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-playfair font-semibold text-navy mb-2">Date of Birth</h3>
                    <p className="text-gray-900 font-playfair">
                      {profile.date_of_birth
                        ? new Date(profile.date_of_birth).toLocaleDateString('en-IN')
                        : 'Not provided'
                      }
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-playfair font-semibold text-navy mb-2">Gender</h3>
                    <p className="text-gray-900 font-playfair capitalize">
                      {profile.gender || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-playfair font-semibold text-navy mb-2">Bio</h3>
                    <p className="text-gray-900 font-playfair">{profile.bio || 'No bio added yet'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-great-vibes text-navy">Address Book</h2>
              <button className="px-4 py-2 bg-navy text-white font-playfair font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Add New Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <h3 className="text-lg font-playfair text-gray-600 mb-2">No addresses saved</h3>
                <p className="text-gray-500 font-playfair">Add your delivery addresses for faster checkout</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => (
                  <div key={address.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-playfair font-semibold text-navy">{address.name}</span>
                        {address.is_default && (
                          <span className="px-2 py-1 bg-navy text-white text-xs font-playfair rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="text-gray-700 font-playfair text-sm space-y-1">
                      <div>{address.address_line}</div>
                      <div>
                        {address.city}, {address.state} {address.zip}
                      </div>
                      <div>{address.country}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-great-vibes text-navy mb-8">Account Preferences</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-playfair font-semibold text-navy mb-4">Notifications</h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.email_notifications}
                      onChange={(e) => setFormData(prev => ({ ...prev, email_notifications: e.target.checked }))}
                      className="rounded border-gray-300 text-navy focus:ring-navy"
                    />
                    <div>
                      <div className="font-playfair font-medium text-navy">Email Notifications</div>
                      <div className="text-sm text-gray-600 font-playfair">Receive order updates and promotional emails</div>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.sms_notifications}
                      onChange={(e) => setFormData(prev => ({ ...prev, sms_notifications: e.target.checked }))}
                      className="rounded border-gray-300 text-navy focus:ring-navy"
                    />
                    <div>
                      <div className="font-playfair font-medium text-navy">SMS Notifications</div>
                      <div className="text-sm text-gray-600 font-playfair">Receive order updates via text message</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <button
                  onClick={() => handleUpdateProfile({ preventDefault: () => {} } as any)}
                  className="px-6 py-3 bg-navy text-white font-playfair font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-navy font-great-vibes text-sm">D</span>
                </div>
                <span className="text-xl font-great-vibes">DreamKnot</span>
              </div>
              <p className="text-gray-400 font-playfair text-sm leading-relaxed">
                Making personalized gifts simple, beautiful, and meaningful.
              </p>
            </div>

            <div>
              <h3 className="font-playfair font-semibold text-white mb-4">Products</h3>
              <ul className="space-y-2 text-gray-400 font-playfair text-sm">
                <li><a href="#products" className="hover:text-white transition-colors">Mugs</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">T-Shirts</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">Pillows</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">Custom Items</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-playfair font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 font-playfair text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-playfair font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 font-playfair text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 font-playfair text-sm">
              &copy; 2025 DreamKnot. Made with love for personalized gifting.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
