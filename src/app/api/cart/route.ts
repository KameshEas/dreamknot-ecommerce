import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { validateRequest } from '@/lib/validation'
import { handleApiError } from '@/lib/errors'
import { CartService } from '@/services/cart.service'
import { cartSchemas } from '@/lib/validation'

// Get user's cart
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    const cart = await CartService.getUserCart(authUser.id)
    return NextResponse.json(cart)
  } catch (error) {
    return handleApiError(error)
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    const cartData = await validateRequest(request, cartSchemas.addItem)
    await CartService.addToCart(authUser.id, cartData)
    return NextResponse.json({ message: 'Item added to cart' })
  } catch (error) {
    return handleApiError(error)
  }
}

// Update cart item
export async function PATCH(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    const updateData = await validateRequest(request, cartSchemas.updateItem)
    await CartService.updateCartItem(authUser.id, updateData)
    return NextResponse.json({ message: 'Cart item updated' })
  } catch (error) {
    return handleApiError(error)
  }
}

// Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    const removeData = await validateRequest(request, cartSchemas.removeItem)
    await CartService.removeFromCart(authUser.id, removeData)
    return NextResponse.json({ message: 'Item removed from cart' })
  } catch (error) {
    return handleApiError(error)
  }
}
