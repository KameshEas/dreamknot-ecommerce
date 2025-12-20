'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import StarRating from './StarRating'

interface Review {
  id: number
  rating: number
  title?: string
  comment?: string
  is_verified: boolean
  created_at: string
  user: {
    id: number
    name: string
    avatar?: string
  }
}

interface ReviewStats {
  total: number
  average: number
  distribution: Record<number, number>
}

interface ProductReviewsProps {
  productId: number
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  })

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Fetch reviews error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingReview(true)

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      })

      if (response.ok) {
        await fetchReviews()
        setNewReview({ rating: 5, title: '', comment: '' })
        setShowReviewForm(false)
        alert('Review submitted successfully!')
      } else if (response.status === 401) {
        alert('Please log in to submit a review')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Submit review error:', error)
      alert('Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const renderRatingDistribution = () => {
    if (!stats) return null

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.distribution[rating] || 0
          const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0

          return (
            <div key={rating} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 min-w-0">
                <span className="text-sm font-playfair text-gray-600">{rating}</span>
                <svg className="w-4 h-4 text-deep-gold fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-deep-gold h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 font-playfair min-w-0">{count}</span>
            </div>
          )
        })}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-great-vibes text-navy">Customer Reviews</h2>
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="px-6 py-3 bg-navy text-white font-playfair font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Write a Review
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-2xl font-great-vibes text-navy mb-6">Write Your Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div>
              <label className="block text-sm font-playfair font-semibold text-navy mb-3">
                Rating
              </label>
              <StarRating
                rating={newReview.rating}
                onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                size="lg"
              />
            </div>

            <div>
              <label className="block text-sm font-playfair font-semibold text-navy mb-3">
                Review Title (Optional)
              </label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Summarize your experience"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-playfair font-semibold text-navy mb-3">
                Your Review
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                placeholder="Share your thoughts about this product..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent resize-none"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-playfair font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-3 bg-navy text-white font-playfair font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Review Stats */}
      {stats && stats.total > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-navy font-playfair mb-2">
                {stats.average.toFixed(1)}
              </div>
              <StarRating rating={stats.average} readonly size="lg" />
              <div className="text-gray-600 font-playfair mt-2">
                Based on {stats.total} review{stats.total !== 1 ? 's' : ''}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-playfair font-semibold text-navy mb-4">Rating Breakdown</h4>
              {renderRatingDistribution()}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-lg font-playfair text-gray-600 mb-2">No reviews yet</h3>
            <p className="text-gray-500 font-playfair">Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start space-x-4">
                <div className="relative w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {review.user.avatar ? (
                    <Image
                      src={review.user.avatar}
                      alt={review.user.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-lg font-great-vibes text-navy">
                      {review.user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-playfair font-semibold text-navy">{review.user.name}</h4>
                      {review.is_verified && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-playfair rounded-full">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 font-playfair">
                      {new Date(review.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="mb-3">
                    <StarRating rating={review.rating} readonly size="sm" />
                  </div>

                  {review.title && (
                    <h5 className="font-playfair font-semibold text-navy mb-2">{review.title}</h5>
                  )}

                  {review.comment && (
                    <p className="text-gray-700 font-playfair leading-relaxed">{review.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
