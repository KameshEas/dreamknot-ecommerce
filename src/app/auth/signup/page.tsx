'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required')
      setIsLoading(false)
      return
    }

    if (!formData.email.trim()) {
      setError('Email is required')
      setIsLoading(false)
      return
    }

    if (!formData.password) {
      setError('Password is required')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Auto-login after successful signup
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }),
        })

        if (loginResponse.ok) {
          router.push('/')
          router.refresh()
        } else {
          // Signup successful but login failed, redirect to login
          router.push('/auth/login?message=Account created successfully. Please log in.')
        }
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy text-white p-12 flex-col justify-center">
        <div className="max-w-md mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <span className="text-navy font-great-vibes text-2xl">D</span>
            </div>
            <h1 className="text-3xl font-great-vibes">DreamKnot</h1>
          </div>

          <h2 className="text-4xl font-great-vibes mb-6 leading-tight">
            Start Your<br />
            <span className="text-light-gold">Personalized</span><br />
            Gifting Journey
          </h2>

          <p className="text-lg font-playfair leading-relaxed mb-8 opacity-90">
            Join thousands of customers who trust DreamKnot to create meaningful,
            personalized gifts that bring joy to their loved ones.
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-light-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-playfair">Free shipping on orders over ₹999</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-light-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-playfair">100% satisfaction guarantee</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-light-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-playfair">Secure payment processing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-great-vibes text-navy mb-2">Create Account</h1>
            <p className="text-gray-600 font-playfair">
              Join DreamKnot and start creating personalized gifts
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-playfair text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-playfair font-semibold text-navy mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-playfair font-semibold text-navy mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-playfair font-semibold text-navy mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                placeholder="Create a password (min. 6 characters)"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-playfair font-semibold text-navy mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
                placeholder="Confirm your password"
              />
            </div>

            <div className="flex items-start space-x-3">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 text-navy border-gray-300 rounded focus:ring-navy"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-600 font-playfair leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="text-navy hover:text-blue-600 underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-navy hover:text-blue-600 underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-navy text-white font-playfair font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600 font-playfair">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-navy hover:text-blue-600 font-semibold underline">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Mobile Branding */}
          <div className="lg:hidden text-center pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
                <span className="text-white font-great-vibes text-lg">D</span>
              </div>
              <span className="text-xl font-great-vibes text-navy">DreamKnot</span>
            </div>
            <p className="text-sm text-gray-600 font-playfair">
              Making personalized gifts simple, beautiful, and meaningful.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
