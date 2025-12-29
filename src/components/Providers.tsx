'use client'

import { WishlistInitializer } from './WishlistInitializer'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WishlistInitializer />
      {children}
    </>
  )
}
