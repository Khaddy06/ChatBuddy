'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'

interface SidebarLinkProps {
  href: string
  label: string
  icon: LucideIcon
  onClick?: () => void
}

export default function SidebarLink({ href, label, icon: Icon, onClick }: SidebarLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 text-lg font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      <Icon size={20} />
      {label}
    </Link>
  )
}
