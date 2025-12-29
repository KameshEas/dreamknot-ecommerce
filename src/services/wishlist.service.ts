import { prisma } from '@/lib/prisma'
import { ProductsService } from './products.service'
import { NotFoundError, ConflictError } from '@/lib/errors'

export interface WishlistItem {
  id: number
  product: any
  added_at: Date | number
}

export interface Wishlist {
  wishlist: WishlistItem[]
}

export interface AddToWishlistData {
  productId: number
}

export interface RemoveFromWishlistData {
  productId: number
}

export class WishlistService {
  static async getUserWishlist(userId: number): Promise<Wishlist> {
    // Get wishlist items from database
    const wishlistItems = await prisma.wishlist.findMany({
      where: { user_id: userId }
    })

    // Get all products to enrich wishlist items
    const productsResult = await ProductsService.getProducts({ limit: 1000 })
    const products = productsResult.products

    // Process wishlist items and filter out unavailable products
    const validWishlist: WishlistItem[] = []

    for (const item of wishlistItems) {
      const product = products.find(p => p.id === item.product_id)

      if (product) {
        validWishlist.push({
          id: item.id,
          product,
          added_at: item.id // Using id as timestamp proxy since created_at may not be selected
        })
      } else {
        // Remove unavailable product from wishlist
        await prisma.wishlist.delete({
          where: { id: item.id }
        })
      }
    }

    return {
      wishlist: validWishlist
    }
  }

  static async addToWishlist(userId: number, data: AddToWishlistData): Promise<void> {
    const { productId } = data

    // Check if product exists
    const productsResult = await ProductsService.getProducts({ limit: 1000 })
    const product = productsResult.products.find(p => p.id === productId)

    if (!product) {
      throw new NotFoundError('Product')
    }

    // Check if already in wishlist
    const existing = await prisma.wishlist.findFirst({
      where: {
        user_id: userId,
        product_id: productId
      }
    })

    if (existing) {
      throw new ConflictError('Product already in wishlist')
    }

    // Add to wishlist
    await prisma.wishlist.create({
      data: {
        user_id: userId,
        product_id: productId
      }
    })
  }

  static async removeFromWishlist(userId: number, data: RemoveFromWishlistData): Promise<void> {
    const { productId } = data

    // Remove from wishlist
    await prisma.wishlist.deleteMany({
      where: {
        user_id: userId,
        product_id: productId
      }
    })
  }

  static async isInWishlist(userId: number, productId: number): Promise<boolean> {
    const item = await prisma.wishlist.findFirst({
      where: {
        user_id: userId,
        product_id: productId
      }
    })

    return !!item
  }

  static async clearWishlist(userId: number): Promise<void> {
    await prisma.wishlist.deleteMany({
      where: { user_id: userId }
    })
  }

  static async getWishlistItemCount(userId: number): Promise<number> {
    const count = await prisma.wishlist.count({
      where: { user_id: userId }
    })

    return count
  }

  static async toggleWishlistItem(userId: number, productId: number): Promise<{ added: boolean }> {
    const existing = await prisma.wishlist.findFirst({
      where: {
        user_id: userId,
        product_id: productId
      }
    })

    if (existing) {
      // Remove from wishlist
      await prisma.wishlist.delete({
        where: { id: existing.id }
      })
      return { added: false }
    } else {
      // Add to wishlist
      await this.addToWishlist(userId, { productId })
      return { added: true }
    }
  }
}
