import { prisma } from '@/lib/prisma'
import { ProductsService } from './products.service'
import { NotFoundError, ConflictError } from '@/lib/errors'
import { ValidationError } from '@/lib/validation'

export interface Review {
  id: number
  user_id: number
  product_id: number
  rating: number
  title: string | null
  comment: string | null
  is_verified: boolean
  created_at: Date
  updated_at: Date
  user: {
    name: string
    avatar: string | null
  }
}

export interface CreateReviewData {
  product_id: number
  rating: number
  title?: string
  comment?: string
}

export interface ReviewQuery {
  productId: number
  sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'
  page?: number
  limit?: number
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export class ReviewService {
  static async createReview(userId: number, data: CreateReviewData): Promise<Review> {
    const { product_id, rating, title, comment } = data

    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new ValidationError('Rating must be between 1 and 5')
    }

    // Check if user has purchased this product (for verified purchase)
    const hasPurchased = await this.hasUserPurchasedProduct(userId, product_id)
    
    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        user_id: userId,
        product_id: product_id
      }
    })

    if (existingReview) {
      throw new ConflictError('You have already reviewed this product')
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        user_id: userId,
        product_id: product_id,
        rating: rating,
        title: title,
        comment: comment,
        is_verified: hasPurchased
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true
          }
        }
      }
    })

    return review
  }

  static async getProductReviews(query: ReviewQuery): Promise<{
    reviews: Review[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
    stats: ReviewStats
  }> {
    const { productId, sortBy = 'newest', page = 1, limit = 10 } = query

    // Get review stats
    const stats = await this.getReviewStats(productId)

    // Build sort options
    let orderBy: any = { created_at: 'desc' } // default to newest

    switch (sortBy) {
      case 'oldest':
        orderBy = { created_at: 'asc' }
        break
      case 'highest':
        orderBy = { rating: 'desc' }
        break
      case 'lowest':
        orderBy = { rating: 'asc' }
        break
      case 'helpful':
        // For now, sort by rating then date (could be enhanced with helpful votes)
        orderBy = [{ rating: 'desc' }, { created_at: 'desc' }]
        break
      case 'newest':
      default:
        orderBy = { created_at: 'desc' }
        break
    }

    // Get total count
    const total = await prisma.review.count({
      where: { product_id: productId }
    })

    // Get reviews with pagination
    const reviews = await prisma.review.findMany({
      where: { product_id: productId },
      include: {
        user: {
          select: {
            name: true,
            avatar: true
          }
        }
      },
      orderBy: orderBy,
      skip: (page - 1) * limit,
      take: limit
    })

    const totalPages = Math.ceil(total / limit)

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages
      },
      stats
    }
  }

  static async getReviewStats(productId: number): Promise<ReviewStats> {
    // Get all ratings for this product
    const ratings = await prisma.review.findMany({
      where: { product_id: productId },
      select: { rating: true }
    })

    const totalReviews = ratings.length
    const averageRating = totalReviews > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
      : 0

    // Count distribution
    const distribution = {
      5: ratings.filter(r => r.rating === 5).length,
      4: ratings.filter(r => r.rating === 4).length,
      3: ratings.filter(r => r.rating === 3).length,
      2: ratings.filter(r => r.rating === 2).length,
      1: ratings.filter(r => r.rating === 1).length
    }

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalReviews,
      ratingDistribution: distribution
    }
  }

  static async updateReview(userId: number, reviewId: number, data: Partial<CreateReviewData>): Promise<Review> {
    const { rating, title, comment } = data

    // Check if review exists and belongs to user
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        user_id: userId
      }
    })

    if (!review) {
      throw new NotFoundError('Review')
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      throw new ValidationError('Rating must be between 1 and 5')
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: rating,
        title: title,
        comment: comment
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true
          }
        }
      }
    })

    return updatedReview
  }

  static async deleteReview(userId: number, reviewId: number): Promise<void> {
    // Check if review exists and belongs to user
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        user_id: userId
      }
    })

    if (!review) {
      throw new NotFoundError('Review')
    }

    // Delete review
    await prisma.review.delete({
      where: { id: reviewId }
    })
  }

  static async hasUserPurchasedProduct(userId: number, productId: number): Promise<boolean> {
    // Check if user has completed orders containing this product
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          user_id: userId,
          payment_status: 'paid',
          order_status: {
            in: ['delivered', 'shipped']
          }
        },
        product_id: productId
      }
    })

    return orderItems.length > 0
  }

  static async getUserReview(userId: number, productId: number): Promise<Review | null> {
    const review = await prisma.review.findFirst({
      where: {
        user_id: userId,
        product_id: productId
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true
          }
        }
      }
    })

    return review
  }
}
