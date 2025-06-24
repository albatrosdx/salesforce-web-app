'use client'

import { useEffect, useState } from 'react'
import { Building2, Users, TrendingUp, Calendar, BarChart3, Activity, DollarSign, Target } from 'lucide-react'
import { Card, CardHeader, CardContent } from '../ui/Card'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { usePermissions } from '@/lib/permissions'
import Link from 'next/link'

interface DashboardStats {
  accounts: number
  contacts: number
  opportunities: number
  activities: number
  totalRevenue: number
  closedWonOpportunities: number
  newAccountsThisMonth: number
  upcomingActivities: number
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
        const response = await fetch('/api/salesforce/dashboard/stats')
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard statistics')
        }
        
        const data = await response.json()
        setStats(data)
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
      <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
            <p className="text-gray-600 mt-1">本日の営業活動概要</p>
          </div>
          <div className="text-sm text-gray-500">
            最終更新: {new Date().toLocaleString('ja-JP', { 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleCards.map((card) => {
          const Icon = card.icon
          
          return (
            <Link key={card.title} href={card.href}>
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${card.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className={`h-5 w-5 ${card.color}`} />
                      </div>
                      <p className="ml-3 text-sm font-medium text-gray-600">
                        {card.title}
                      </p>
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mt-4">
                      {card.value.toLocaleString('ja-JP')}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      前月比 <span className="text-green-600 font-medium">+12%</span>
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">売上推移</h2>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100">
                    今月
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                    四半期
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                    年間
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">売上チャートエリア</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">今月の売上</span>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ¥{stats?.totalRevenue.toLocaleString('ja-JP') || 0}
              </p>
              <p className="text-xs text-green-600 mt-1">目標達成率 87%</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">成約商談</span>
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.closedWonOpportunities || 0} 件
              </p>
              <p className="text-xs text-gray-500 mt-1">成約率 42.8%</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">本日の活動</span>
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.upcomingActivities || 0} 件
              </p>
              <p className="text-xs text-gray-500 mt-1">完了 8件 / 予定 15件</p>
            </CardContent>
          </Card>
        </div>
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