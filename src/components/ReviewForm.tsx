'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import StarRating from './StarRating'

interface ReviewFormProps {
  productId: number
  onSuccess?: () => void
  initialReview?: {
    rating: number
    title: string | null
    comment: string | null
  } | null
}

export default function ReviewForm({ productId, onSuccess, initialReview }: ReviewFormProps) {
  const [rating, setRating] = useState(initialReview?.rating || 0)
  const [title, setTitle] = useState(initialReview?.title || '')
  const [comment, setComment] = useState(initialReview?.comment || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(!!initialReview)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (!comment.trim()) {
      toast.error('Please write a review')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/product-reviews', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          rating,
          title: title.trim(),
          comment: comment.trim()
        })
      })

      if (response.ok) {
        const message = isEditing ? 'Review updated successfully!' : 'Review submitted successfully!'
        toast.success(message)
        if (onSuccess) onSuccess()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Review submission error:', error)
      toast.error('Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-lg font-playfair font-semibold text-navy mb-4">
        {isEditing ? 'Edit Your Review' : 'Write a Review'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-playfair font-semibold text-navy mb-2">
            Your Rating *
          </label>
          <StarRating 
            rating={rating} 
            onRatingChange={setRating}
            size="lg"
          />
          {rating === 0 && (
            <p className="text-red-500 text-sm mt-1">Please select a rating</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-playfair font-semibold text-navy mb-2">
            Review Title (Optional)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
            placeholder="Summarize your experience"
          />
          <p className="text-xs text-gray-500 font-playfair mt-1">Max 100 characters</p>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-playfair font-semibold text-navy mb-2">
            Your Review *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={6}
            maxLength={1000}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-colors resize-none"
            placeholder="Share your thoughts about this product..."
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500 font-playfair">Max 1000 characters</p>
            <p className="text-xs text-gray-400 font-playfair">{comment.length}/1000</p>
          </div>
          {comment.trim() === '' && (
            <p className="text-red-500 text-sm mt-1">Please write a review</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || comment.trim() === ''}
            className={`px-6 py-3 font-playfair font-semibold rounded-lg transition-all duration-200 ${
              isSubmitting || rating === 0 || comment.trim() === ''
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-navy text-white hover:bg-blue-700 transform hover:scale-105'
            }`}
          >
            {isSubmitting 
              ? (isEditing ? 'Updating...' : 'Submitting...') 
              : (isEditing ? 'Update Review' : 'Submit Review')
            }
          </button>
          
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setRating(0)
                setTitle('')
                setComment('')
                setIsEditing(false)
              }}
              className="px-6 py-3 font-playfair font-semibold text-navy border border-navy rounded-lg hover:bg-navy hover:text-white transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
