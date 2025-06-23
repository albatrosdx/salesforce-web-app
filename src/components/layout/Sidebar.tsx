'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Building2, Users, TrendingUp, Calendar, X, Home, BarChart3, Settings, HelpCircle, ChevronDown } from 'lucide-react'
import { Button } from '../ui/Button'
import { usePermissions } from '@/lib/permissions'
import { useState } from 'react'

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const { hasPermission, loading } = usePermissions()
  const [expandedSections, setExpandedSections] = useState<string[]>(['sales'])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const navigationSections = [
    {
      id: 'home',
      label: 'ホーム',
      items: [
        {
          name: 'ダッシュボード',
          href: '/dashboard',
          icon: Home,
          permission: null
        }
      ]
    },
    {
      id: 'sales',
      label: '営業',
      items: [
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
        }
      ]
    },
    {
      id: 'activities',
      label: '活動',
      items: [
        {
          name: '活動',
          href: '/dashboard/activities',
          icon: Calendar,
          permission: { object: 'activities' as const, action: 'read' as const }
        }
      ]
    },
    {
      id: 'reports',
      label: 'レポート',
      items: [
        {
          name: 'レポート',
          href: '/dashboard/reports',
          icon: BarChart3,
          permission: null
        }
      ]
    }
  ]

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SF</span>
          </div>
          <h2 className="text-lg font-semibold">Salesforce App</h2>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden text-white hover:bg-gray-700">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          navigationSections.map((section) => {
            const isExpanded = expandedSections.includes(section.id)
            const filteredItems = section.items.filter(item => 
              !item.permission || hasPermission(item.permission.object, item.permission.action)
            )

            if (filteredItems.length === 0) return null

            return (
              <div key={section.id} className="space-y-1">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
                >
                  <span>{section.label}</span>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform ${
                      isExpanded ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                
                {isExpanded && (
                  <div className="space-y-1 ml-3">
                    {filteredItems.map((item) => {
                      const isActive = pathname === item.href || 
                        (item.href !== '/dashboard' && pathname.startsWith(item.href))
                      const Icon = item.icon
                      
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={onClose}
                          className={`
                            group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all
                            ${isActive
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-gray-300 hover:text-white hover:bg-gray-800'
                            }
                          `}
                        >
                          <Icon 
                            className={`
                              mr-3 h-4 w-4 transition-colors
                              ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}
                            `}
                          />
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })
        )}
      </nav>

      {/* Quick Actions */}
      <div className="px-3 py-4 border-t border-gray-800">
        <div className="space-y-2">
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
            <Settings className="mr-3 h-4 w-4 text-gray-400" />
            設定
          </button>
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors">
            <HelpCircle className="mr-3 h-4 w-4 text-gray-400" />
            ヘルプ
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-800">
        <div className="text-xs text-gray-400">
          Salesforce Web App v1.0
        </div>
      </div>
    </div>
  )
}