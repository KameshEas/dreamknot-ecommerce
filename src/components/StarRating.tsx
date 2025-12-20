import { useState } from 'react'

interface StarRatingProps {
  rating?: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}

export default function StarRating({
  rating = 0,
  onRatingChange,
  readonly = false,
  size = 'md',
  showValue = false
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const handleClick = (star: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(star)
    }
  }

  const handleMouseEnter = (star: number) => {
    if (!readonly) {
      setHoverRating(star)
    }
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0)
    }
  }

  const displayRating = hoverRating || rating

  return (
    <div className="flex items-center space-x-1">
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
          >
            <svg
              className={`${sizeClasses[size]} ${
                star <= displayRating
                  ? 'text-deep-gold fill-current'
                  : 'text-gray-300 fill-current'
              }`}
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
        ))}
      </div>

      {showValue && (
        <span className="text-sm text-gray-600 font-playfair ml-2">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  )
}
