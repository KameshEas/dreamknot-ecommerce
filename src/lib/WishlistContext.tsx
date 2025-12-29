'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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

interface WishlistContextType {
  wishlist: WishlistItem[]
  isInWishlist: (productId: number) => boolean
  addToWishlist: (productId: number) => Promise<boolean>
  removeFromWishlist: (productId: number) => Promise<boolean>
  refreshWishlist: () => Promise<void>
  loading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist')
      if (response.ok) {
        const data = await response.json()
        setWishlist(data.wishlist || [])
      } else if (response.status === 401) {
        // User not logged in, clear wishlist
        setWishlist([])
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const isInWishlist = (productId: number): boolean => {
    return wishlist.some(item => item.product.id === productId)
  }

  const addToWishlist = async (productId: number): Promise<boolean> => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      if (response.ok) {
        await fetchWishlist() // Refresh the wishlist
        return true
      } else if (response.status === 401) {
        alert('Please log in to add items to your wishlist')
        return false
      } else {
        const error = await response.json()
        if (error.error !== 'Product already in wishlist') {
          alert(error.error || 'Failed to add to wishlist')
        } else {
          await fetchWishlist() // Product was already in wishlist, refresh to sync state
          return true
        }
        return false
      }
    } catch (error) {
      console.error('Wishlist error:', error)
      alert('Failed to add to wishlist')
      return false
    }
  }

  const removeFromWishlist = async (productId: number): Promise<boolean> => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      if (response.ok) {
        await fetchWishlist() // Refresh the wishlist
        return true
      } else if (response.status === 401) {
        alert('Please log in to manage your wishlist')
        return false
      } else {
        alert('Failed to remove from wishlist')
        return false
      }
    } catch (error) {
      console.error('Wishlist error:', error)
      alert('Failed to remove from wishlist')
      return false
    }
  }

  const refreshWishlist = async () => {
    await fetchWishlist()
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  return (
    <WishlistContext.Provider value={{
      wishlist,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      refreshWishlist,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
