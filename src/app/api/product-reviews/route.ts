import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { validateRequest, validateQueryParams } from '@/lib/validation'
import { handleApiError } from '@/lib/errors'
import { ReviewService } from '@/services/review.service'
import { reviewSchemas } from '@/lib/validation'

// Create a new review
export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request)
    const reviewData = await validateRequest(request, reviewSchemas.create)
    const review = await ReviewService.createReview(authUser.id, reviewData)
    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

// Get reviews for a product with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const validatedParams = validateQueryParams(request, reviewSchemas.query)
    const reviews = await ReviewService.getProductReviews(validatedParams)
    return NextResponse.json(reviews)
  } catch (error) {
    return handleApiError(error)
  }
}
