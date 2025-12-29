import { prisma } from '@/lib/prisma'
import { ProductsService } from './products.service'
import { NotFoundError, ConflictError } from '@/lib/errors'

export interface CartItem {
  id: number
  product: any
  customization: string | null
  qty: number
  price: number
}

export interface Cart {
  id: number | null
  items: CartItem[]
  total: number
}

export interface AddToCartData {
  productId: number
  customization?: any
  qty?: number
}

export interface UpdateCartItemData {
  itemId: number
  qty: number
}

export interface RemoveFromCartData {
  itemId: number
}

export class CartService {
  static async getUserCart(userId: number): Promise<Cart> {
    // Get cart with items
    const cart = await prisma.cart.findFirst({
      where: { user_id: userId },
      include: {
        cart_items: true
      }
    })

    if (!cart) {
      return {
        id: null,
        items: [],
        total: 0
      }
    }

    // Get all products to enrich cart items
    const productsResult = await ProductsService.getProducts({ limit: 1000 })
    const products = productsResult.products

    // Process cart items
    const items = cart.cart_items.map((item) => {
      const product = products.find(p => p.id === item.product_id)

      // If product not found, create a placeholder
      const finalProduct = product || {
        id: item.product_id,
        title: 'Product Unavailable',
        description: 'This product is no longer available.',
        base_price: 0,
        category_id: null,
        images: ['/placeholder-product.jpg'],
        created_at: new Date().toISOString(),
        category: null,
        customizations: []
      }

      return {
        id: item.id,
        product: finalProduct,
        customization: item.customization,
        qty: item.qty,
        price: finalProduct.base_price * item.qty
      }
    })

    const total = items.reduce((sum, item) => sum + item.price, 0)

    return {
      id: cart.id,
      items,
      total
    }
  }

  static async addToCart(userId: number, data: AddToCartData): Promise<void> {
    const { productId, customization, qty = 1 } = data

    // Find or create cart
    let cart = await prisma.cart.findFirst({
      where: { user_id: userId }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { user_id: userId }
      })
    }

    // Check if item already exists (same product and customization)
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cart_id: cart.id,
        product_id: productId,
        customization: customization ? JSON.stringify(customization) : null
      }
    })

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { qty: existingItem.qty + qty }
      })
    } else {
      // Create new item
      await prisma.cartItem.create({
        data: {
          cart_id: cart.id,
          product_id: productId,
          customization: customization ? JSON.stringify(customization) : null,
          qty
        }
      })
    }
  }

  static async updateCartItem(userId: number, data: UpdateCartItemData): Promise<void> {
    const { itemId, qty } = data

    // Verify cart ownership
    const cart = await prisma.cart.findFirst({
      where: { user_id: userId }
    })

    if (!cart) {
      throw new NotFoundError('Cart')
    }

    // Check if item belongs to user's cart
    const item = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart_id: cart.id
      }
    })

    if (!item) {
      throw new NotFoundError('Cart item')
    }

    if (qty <= 0) {
      // Remove item if quantity is 0 or less
      await prisma.cartItem.delete({
        where: { id: itemId }
      })
    } else {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { qty }
      })
    }
  }

  static async removeFromCart(userId: number, data: RemoveFromCartData): Promise<void> {
    const { itemId } = data

    // Verify cart ownership
    const cart = await prisma.cart.findFirst({
      where: { user_id: userId }
    })

    if (!cart) {
      throw new NotFoundError('Cart')
    }

    // Check if item belongs to user's cart
    const item = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart_id: cart.id
      }
    })

    if (!item) {
      throw new NotFoundError('Cart item')
    }

    // Remove item
    await prisma.cartItem.delete({
      where: { id: itemId }
    })
  }

  static async clearCart(userId: number): Promise<void> {
    const cart = await prisma.cart.findFirst({
      where: { user_id: userId }
    })

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cart_id: cart.id }
      })
    }
  }

  static async getCartItemCount(userId: number): Promise<number> {
    const cart = await prisma.cart.findFirst({
      where: { user_id: userId },
      include: {
        _count: {
          select: { cart_items: true }
        }
      }
    })

    return cart?._count.cart_items || 0
  }
}
