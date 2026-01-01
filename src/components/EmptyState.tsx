'use client'

import Link from 'next/link'

interface EmptyStateProps {
  type: 'cart' | 'wishlist' | 'orders' | 'addresses' | 'products'
  title?: string
  description?: string
  actionText?: string
  actionHref?: string
}

export default function EmptyState({ 
  type, 
  title, 
  description, 
  actionText, 
  actionHref 
}: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'cart':
        return (
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        )
      case 'wishlist':
        return (
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )
      case 'orders':
        return (
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        )
      case 'addresses':
        return (
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        )
      case 'products':
        return (
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 00-.293.707V21a2 2 0 002 2z"/>
          </svg>
        )
      default:
        return null
    }
  }

  const getDefaultContent = () => {
    switch (type) {
      case 'cart':
        return {
          title: 'Your cart is waiting for amazing gifts',
          description: 'Start creating a personalized gift they\'ll truly love. Preview before you buy • Easy edits • Fast delivery.',
          actionText: 'Start Creating a Gift',
          actionHref: '/products'
        }
      case 'wishlist':
        return {
          title: 'Your wishlist is empty',
          description: 'Discover amazing personalized gifts and save them here for easy access later. Click the heart icon on any product to add it to your wishlist.',
          actionText: 'Explore Products',
          actionHref: '/'
        }
      case 'orders':
        return {
          title: 'No orders yet',
          description: 'Start your personalized gifting journey. Browse our collection and create meaningful gifts that will be cherished forever.',
          actionText: 'Start Shopping',
          actionHref: '/'
        }
      case 'addresses':
        return {
          title: 'No addresses saved',
          description: 'Add your delivery addresses for faster checkout and seamless shopping experience.',
          actionText: 'Add Address',
          actionHref: '#'
        }
      case 'products':
        return {
          title: 'No products found',
          description: 'We couldn\'t find any products matching your criteria. Try adjusting your filters or browse our featured items.',
          actionText: 'Browse All Products',
          actionHref: '/products'
        }
      default:
        return {
          title: 'Nothing here',
          description: 'Check back later or explore other sections of our store.',
          actionText: 'Go Home',
          actionHref: '/'
        }
    }
  }

  const content = getDefaultContent()
  const finalTitle = title || content.title
  const finalDescription = description || content.description
  const finalActionText = actionText || content.actionText
  const finalActionHref = actionHref || content.actionHref

  const getAdditionalContent = () => {
    if (type === 'cart') {
      return (
        <div className="mt-12 text-center">
          <p className="text-gray-600 font-playfair text-lg mb-6">
            Not sure where to start? Popular gifts people love to personalize:
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link
              href="/products?category=Mugs"
              className="px-6 py-3 bg-white border-2 border-navy text-navy font-playfair font-semibold rounded-lg hover:bg-navy hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Personalized Mugs
            </Link>
            <Link
              href="/products?category=T-Shirts"
              className="px-6 py-3 bg-white border-2 border-navy text-navy font-playfair font-semibold rounded-lg hover:bg-navy hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Custom T-Shirts
            </Link>
            <Link
              href="/gift-finder"
              className="px-6 py-3 bg-white border-2 border-deep-gold text-deep-gold font-playfair font-semibold rounded-lg hover:bg-deep-gold hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Find a Gift They Love
            </Link>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="text-center py-16">
      <div className="mb-8">
        {getIcon()}
      </div>
      <h2 className="text-3xl font-playfair font-semibold text-navy mb-6">{finalTitle}</h2>
      <p className="text-lg text-gray-600 font-playfair mb-8 max-w-lg mx-auto leading-relaxed">
        {finalDescription}
      </p>
      {finalActionHref && (
        <Link
          href={finalActionHref}
          className="px-8 py-4 bg-navy text-white font-playfair font-semibold rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105"
        >
          {finalActionText}
        </Link>
      )}
      {getAdditionalContent()}
    </div>
  )
}
