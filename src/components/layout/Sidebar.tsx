'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Building2, Users, TrendingUp, Calendar, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { usePermissions } from '@/lib/permissions'

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const { hasPermission, loading } = usePermissions()

  const navigation = [
    {
      name: '取引先',
      href: '/dashboard/accounts',
      icon: Building2,
      permission: { object: 'accounts' as const, action: 'read' as const }
    },
    {
      name: '取引先責任者',
      href: '/dashboard/contacts',
      icon: Users,
      permission: { object: 'contacts' as const, action: 'read' as const }
    },
    {
      name: '商談',
      href: '/dashboard/opportunities',
      icon: TrendingUp,
      permission: { object: 'opportunities' as const, action: 'read' as const }
    },
    {
      name: '活動',
      href: '/dashboard/activities',
      icon: Calendar,
      permission: { object: 'activities' as const, action: 'read' as const }
    }
  ]

  const filteredNavigation = navigation.filter(item => 
    loading || hasPermission(item.permission.object, item.permission.action)
  )

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 border-l-4 border-l-green-500">
      {/* デバッグ: Sidebarが表示されていることを明確に */}
      <div className="bg-green-500 text-white text-center py-1 text-xs">✓ MODERN SIDEBAR ACTIVE</div>
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">メニュー</h2>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          filteredNavigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive
                    ? 'bg-salesforce-blue text-white'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                <Icon 
                  className={`
                    mr-3 h-5 w-5 transition-colors
                    ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}
                  `}
                />
                {item.name}
              </Link>
            )
          })
        )}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Salesforce Web App v1.0
        </div>
      </div>
    </div>
  )
}