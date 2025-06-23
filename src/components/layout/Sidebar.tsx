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
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            SF
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Salesforce App</h2>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden text-white hover:bg-gray-700">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {loading ? (
          <div style={{ padding: '8px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ height: '40px', backgroundColor: '#475569', borderRadius: '6px', marginBottom: '8px' }} />
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
              <div key={section.id} className="sidebar-section">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="sidebar-section-header"
                >
                  <span>{section.label}</span>
                  <ChevronDown 
                    style={{
                      width: '16px',
                      height: '16px',
                      transition: 'transform 0.2s',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  />
                </button>
                
                {isExpanded && (
                  <div className="sidebar-items">
                    {filteredItems.map((item) => {
                      const isActive = pathname === item.href || 
                        (item.href !== '/dashboard' && pathname.startsWith(item.href))
                      const Icon = item.icon
                      
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={onClose}
                          className={`sidebar-item ${isActive ? 'active' : ''}`}
                        >
                          <Icon 
                            style={{
                              width: '16px',
                              height: '16px'
                            }}
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
      <div className="sidebar-footer">
        <div>
          Salesforce Web App v1.0
        </div>
      </div>
    </div>
  )
}