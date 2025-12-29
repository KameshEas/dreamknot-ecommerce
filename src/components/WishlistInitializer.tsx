'use client'

import { useEffect } from 'react'
import { useWishlistStore } from '@/lib/wishlist-store'

export function WishlistInitializer() {
  const fetchWishlist = useWishlistStore(state => state.fetchWishlist)

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  return null
}
