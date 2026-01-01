'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface User {
  id: number
  name: string
  email: string
}

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const checkAuthStatus = async () => {
    try {
      // Check if we have a token in cookies
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setIsLoggedIn(true)

        // Fetch cart data for logged-in users
        fetchCartCount()
      } else {
        setIsLoggedIn(false)
        setUser(null)
        setCartItemCount(0)
      }
    } catch {
      setIsLoggedIn(false)
      setUser(null)
      setCartItemCount(0)
    }
  }

  const fetchCartCount = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setCartItemCount(data.items?.length || 0)
      }
    } catch {
      console.error('Cart count fetch error')
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus()
    }
    initAuth()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      setIsLoggedIn(false)
      setUser(null)
      setShowUserMenu(false)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-effect h-16 shadow-sm' : 'bg-transparent h-20'}`}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
        <div className="flex justify-between items-center w-full">
          <Link href="/" className="hover:opacity-80 transition-opacity duration-300">
            <Image
              src="/logo.svg"
              alt="DreamKnot Logo"
              width={200}
              height={200}
              className="transition-transform duration-300 hover:scale-105"
            />
          </Link>



          <div className="flex items-end space-x-4">
            {isLoggedIn && (
              <>
                <Link
                  href="/wishlist"
                  className="relative p-3 text-gray-600 hover:text-navy transition-all duration-300 transform hover:scale-110 group"
                  title="Wishlist"
                >
                  <svg className="w-6 h-6 group-hover:stroke-deep-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>

                <Link
                  href="/cart"
                  className="relative p-3 text-gray-600 hover:text-navy transition-all duration-300 transform hover:scale-110 group"
                  title="Shopping Cart"
                >
                  <svg className="w-6 h-6 group-hover:stroke-deep-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-deep-gold text-navy text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center min-w-[24px] shadow-lg animate-pulse">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isLoggedIn && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-3 text-gray-600 hover:text-navy transition-all duration-300 group"
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-navy to-blue-800 rounded-full flex items-center justify-center shadow-md border-2 border-white/50">
                      <span className="text-white font-great-vibes text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-gold rounded-full border-2 border-white"></div>
                  </div>
                  <span className="hidden md:block font-playfair text-sm font-medium group-hover:text-navy">
                    {user.name}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-all duration-300 group-hover:text-deep-gold ${showUserMenu ? 'rotate-180 text-deep-gold' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="fixed right-4 top-20 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-[60]">
                    <div className="p-4 border-b border-gray-100">
                      <div className="text-center">
                        <div className="font-playfair text-sm text-gray-600">{user.email}</div>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 font-playfair text-sm transition-all duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/orders"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 font-playfair text-sm transition-all duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>My Orders</span>
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-playfair text-sm transition-all duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden md:block px-6 py-3 bg-navy text-white font-playfair font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            )}

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 touch-target"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-40 md:hidden ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Image
                  src="/logo.svg"
                  alt="DreamKnot Logo"
                  width={48}
                  height={48}
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 touch-target"
                aria-label="Close mobile menu"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {isLoggedIn && (
              <Link
                href="/profile"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-playfair font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
            )}
            {!isLoggedIn && (
              <Link
                href="/auth/login"
                className="block px-4 py-3 bg-navy text-white rounded-lg font-playfair font-medium text-center hover:bg-blue-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </div>
    </header>
  )
}
