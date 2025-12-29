'use client'

import { WishlistProvider } from '@/lib/WishlistContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WishlistProvider>
      {children}
    </WishlistProvider>
  )
}
