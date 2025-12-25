'use client'

import { usePathname } from 'next/navigation'
import FAQSection from './FAQSection'

export default function ClientWrapper() {
  const pathname = usePathname()
  const showParam = pathname === '/videofunding'
  //   console.log("Ryong===========>", pathname);

  // return pathname.startsWith("/videofunding") ? <FAQSection /> : null;
  return showParam ? <FAQSection /> : null
}
