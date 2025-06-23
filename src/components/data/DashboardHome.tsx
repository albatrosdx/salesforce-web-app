'use client'

import { useEffect, useState } from 'react'
import { Building2, Users, TrendingUp, Calendar } from 'lucide-react'
import { Card, CardHeader, CardContent } from '../ui/Card'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { usePermissions } from '@/lib/permissions'
import Link from 'next/link'

interface DashboardStats {
  accounts: number
  contacts: number
  opportunities: number
  activities: number
}

export function DashboardHome() {
  const { hasPermission, loading: permissionsLoading } = usePermissions()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        // ここでは簡単な統計データを模擬的に作成
        // 実際のAPIがあれば、それを呼び出します
        await new Promise(resolve => setTimeout(resolve, 1000)) // 模擬的な遅延
        
        setStats({
          accounts: 42,
          contacts: 156,
          opportunities: 28,
          activities: 89
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (!permissionsLoading) {
      fetchStats()
    }
  }, [permissionsLoading])

  const statCards = [
    {
      title: '取引先',
      value: stats?.accounts || 0,
      icon: Building2,
      href: '/dashboard/accounts',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      permission: { object: 'accounts' as const, action: 'read' as const }
    },
    {
      title: '取引先責任者',
      value: stats?.contacts || 0,
      icon: Users,
      href: '/dashboard/contacts',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      permission: { object: 'contacts' as const, action: 'read' as const }
    },
    {
      title: '商談',
      value: stats?.opportunities || 0,
      icon: TrendingUp,
      href: '/dashboard/opportunities',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      permission: { object: 'opportunities' as const, action: 'read' as const }
    },
    {
      title: '活動',
      value: stats?.activities || 0,
      icon: Calendar,
      href: '/dashboard/activities',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      permission: { object: 'activities' as const, action: 'read' as const }
    }
  ]

  const visibleCards = statCards.filter(card => 
    permissionsLoading || hasPermission(card.permission.object, card.permission.action)
  )

  if (loading || permissionsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-gray-600 mt-1">Salesforce データの概要を表示しています</p>
        </div>
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-gray-600 mt-1">Salesforce データの概要を表示しています</p>
        </div>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">エラーが発生しました</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600 mt-1">Salesforce データの概要を表示しています</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleCards.map((card) => {
          const Icon = card.icon
          
          return (
            <Link key={card.title} href={card.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {card.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {card.value.toLocaleString()}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${card.bgColor}`}>
                      <Icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">クイックアクション</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hasPermission('accounts', 'create') && (
              <Link 
                href="/dashboard/accounts/new"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">新規取引先</span>
                </div>
              </Link>
            )}
            {hasPermission('contacts', 'create') && (
              <Link 
                href="/dashboard/contacts/new"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">新規取引先責任者</span>
                </div>
              </Link>
            )}
            {hasPermission('opportunities', 'create') && (
              <Link 
                href="/dashboard/opportunities/new"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-900">新規商談</span>
                </div>
              </Link>
            )}
            {hasPermission('activities', 'create') && (
              <Link 
                href="/dashboard/activities/new"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">新規活動</span>
                </div>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}