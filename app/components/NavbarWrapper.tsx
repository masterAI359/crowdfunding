// app/components/NavbarWrapper.tsx
'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function NavbarWrapper() {
  const pathname = usePathname()

  // Check if we are on the landing page
  const isLanding = pathname === '/'

  return (
    <Navbar theme={isLanding ? 'dark' : 'light'} background={isLanding ? 'invisible' : 'color'} />
  )
}
