'use client'

interface SkeletonProps {
  type: 'card' | 'list' | 'text' | 'avatar'
  count?: number
  className?: string
}

export default function SkeletonLoader({ type, count = 1, className = '' }: SkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
            <div className="skeleton h-48 w-full"></div>
            <div className="p-6 space-y-4">
              <div className="skeleton h-6 w-3/4 rounded"></div>
              <div className="skeleton h-4 w-full rounded"></div>
              <div className="skeleton h-4 w-2/3 rounded"></div>
              <div className="flex justify-between items-center pt-4">
                <div className="skeleton h-8 w-20 rounded"></div>
                <div className="skeleton h-6 w-16 rounded"></div>
              </div>
            </div>
          </div>
        )
      case 'list':
        return (
          <div className={`space-y-4 ${className}`}>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="skeleton h-12 w-12 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-5 w-3/4 rounded"></div>
                  <div className="skeleton h-4 w-full rounded"></div>
                </div>
                <div className="skeleton h-8 w-20 rounded"></div>
              </div>
            </div>
          </div>
        )
      case 'text':
        return (
          <div className={`space-y-3 ${className}`}>
            <div className="skeleton h-4 w-full rounded"></div>
            <div className="skeleton h-4 w-4/5 rounded"></div>
            <div className="skeleton h-4 w-3/5 rounded"></div>
          </div>
        )
      case 'avatar':
        return (
          <div className={`relative ${className}`}>
            <div className="skeleton w-16 h-16 rounded-full"></div>
          </div>
        )
      default:
        return <div className={`skeleton h-8 w-full rounded ${className}`}></div>
    }
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  )
}
