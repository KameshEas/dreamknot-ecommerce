import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { validateRequest } from '@/lib/validation'
import { handleApiError } from '@/lib/errors'
import { WishlistService } from '@/services/wishlist.service'
import { wishlistSchemas } from '@/lib/validation'

// Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request)
    const wishlist = await WishlistService.getUserWishlist(authUser.id)
    return NextResponse.json(wishlist)
  } catch (error) {
    return handleApiError(error)
  }
}

// Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request)
    const wishlistData = await validateRequest(request, wishlistSchemas.addItem)
    await WishlistService.addToWishlist(authUser.id, wishlistData)
    return NextResponse.json({ message: 'Added to wishlist' })
  } catch (error) {
    return handleApiError(error)
  }
}

// Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const authUser = getAuthUser(request)
    const removeData = await validateRequest(request, wishlistSchemas.removeItem)
    await WishlistService.removeFromWishlist(authUser.id, removeData)
    return NextResponse.json({ message: 'Removed from wishlist' })
  } catch (error) {
    return handleApiError(error)
  }
}
