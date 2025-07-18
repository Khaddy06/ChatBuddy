'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'

interface SidebarLinkProps {
  href: string
  label: string
  icon: LucideIcon
  onClick?: () => void
  className?: string
}

export default function SidebarLink({ href, label, icon: Icon, onClick, className }: SidebarLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 text-lg font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-[#F8F6FC] text-[#7F2982]' // active: purple text, soft bg
          : 'text-[#7F2982] hover:bg-[#F7717D]/10 hover:text-[#F7717D]' // hover: pink text, soft pink bg
      } ${className || ''}`}
    >
      <Icon size={20} />
      {label}
    </Link>
  )
}
