import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface Product {
  id: number
  title: string
  description: string
  base_price: number
  images: string[]
  category: {
    name: string
  } | null
}

interface WishlistItem {
  id: number
  product: Product
  added_at: string
}

interface WishlistState {
  wishlist: WishlistItem[]
  loading: boolean
  addLoading: Record<number, boolean>
  removeLoading: Record<number, boolean>
  error: string | null

  // Actions
  fetchWishlist: () => Promise<void>
  isInWishlist: (productId: number) => boolean
  addToWishlist: (productId: number) => Promise<boolean>
  removeFromWishlist: (productId: number) => Promise<boolean>
  clearError: () => void
}

export const useWishlistStore = create<WishlistState>()(
  devtools(
    (set, get) => ({
      wishlist: [],
      loading: true,
      addLoading: {},
      removeLoading: {},
      error: null,

      fetchWishlist: async () => {
        try {
          set({ loading: true, error: null })
          const response = await fetch('/api/wishlist')
          if (response.ok) {
            const data = await response.json()
            set({ wishlist: data.wishlist || [], loading: false })
          } else if (response.status === 401) {
            // User not logged in, clear wishlist
            set({ wishlist: [], loading: false })
          } else {
            throw new Error('Failed to fetch wishlist')
          }
        } catch (error) {
          console.error('Failed to fetch wishlist:', error)
          set({ error: 'Failed to load wishlist', loading: false })
        }
      },

      isInWishlist: (productId: number): boolean => {
        return get().wishlist.some(item => item.product.id === productId)
      },

      addToWishlist: async (productId: number): Promise<boolean> => {
        const { wishlist, addLoading } = get()

        // Check if already in wishlist (optimistic check)
        if (wishlist.some(item => item.product.id === productId)) {
          return true
        }

        try {
          // Set loading state
          set({
            addLoading: { ...addLoading, [productId]: true },
            error: null
          })

          const response = await fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId })
          })

          if (response.ok) {
            // Fetch updated wishlist
            await get().fetchWishlist()
            set({ addLoading: { ...addLoading, [productId]: false } })
            return true
          } else if (response.status === 401) {
            set({
              error: 'Please log in to add items to your wishlist',
              addLoading: { ...addLoading, [productId]: false }
            })
            return false
          } else {
            const error = await response.json()
            if (error.error !== 'Product already in wishlist') {
              set({
                error: error.error || 'Failed to add to wishlist',
                addLoading: { ...addLoading, [productId]: false }
              })
            } else {
              // Product was already in wishlist, refresh to sync state
              await get().fetchWishlist()
              set({ addLoading: { ...addLoading, [productId]: false } })
              return true
            }
            return false
          }
        } catch (error) {
          console.error('Wishlist error:', error)
          set({
            error: 'Failed to add to wishlist',
            addLoading: { ...addLoading, [productId]: false }
          })
          return false
        }
      },

      removeFromWishlist: async (productId: number): Promise<boolean> => {
        const { removeLoading } = get()

        try {
          // Set loading state
          set({
            removeLoading: { ...removeLoading, [productId]: true },
            error: null
          })

          const response = await fetch('/api/wishlist', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId })
          })

          if (response.ok) {
            // Fetch updated wishlist
            await get().fetchWishlist()
            set({ removeLoading: { ...removeLoading, [productId]: false } })
            return true
          } else if (response.status === 401) {
            set({
              error: 'Please log in to manage your wishlist',
              removeLoading: { ...removeLoading, [productId]: false }
            })
            return false
          } else {
            set({
              error: 'Failed to remove from wishlist',
              removeLoading: { ...removeLoading, [productId]: false }
            })
            return false
          }
        } catch (error) {
          console.error('Wishlist error:', error)
          set({
            error: 'Failed to remove from wishlist',
            removeLoading: { ...removeLoading, [productId]: false }
          })
          return false
        }
      },

      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'wishlist-store'
    }
  )
)
