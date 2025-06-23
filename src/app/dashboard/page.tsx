'use client'

import { PageHeader, Card, CardContent } from '@/components'

// ダッシュボード統計カード
function StatsCard({ title, value, change, changeType }: {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
}) {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }[changeType || 'neutral']

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {change && (
              <p className={`text-sm ${changeColor}`}>{change}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="ダッシュボード"
        description="Salesforceデータの概要と最新の活動を確認できます"
      />

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="総取引先数"
          value="1,234"
          change="+12% 先月比"
          changeType="positive"
        />
        <StatsCard
          title="総取引先責任者数"
          value="5,678"
          change="+8% 先月比"
          changeType="positive"
        />
        <StatsCard
          title="進行中の商談"
          value="89"
          change="-3% 先月比"
          changeType="negative"
        />
        <StatsCard
          title="今月の活動"
          value="456"
          change="+15% 先月比"
          changeType="positive"
        />
      </div>

      {/* メインコンテンツエリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近の活動 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">最近の活動</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-salesforce-blue rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">新しい取引先「株式会社サンプル」が作成されました</p>
                  <p className="text-xs text-gray-500">2時間前</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">商談「新規プロジェクト」がクローズしました</p>
                  <p className="text-xs text-gray-500">4時間前</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">フォローアップタスクが作成されました</p>
                  <p className="text-xs text-gray-500">6時間前</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 今週の予定 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">今週の予定</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-salesforce-lightblue rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">24</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">顧客訪問</p>
                  <p className="text-xs text-gray-500">明日 14:00 - 15:00</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 font-semibold text-sm">25</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">プロジェクト会議</p>
                  <p className="text-xs text-gray-500">水曜日 10:00 - 11:30</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 font-semibold text-sm">26</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">商談レビュー</p>
                  <p className="text-xs text-gray-500">木曜日 16:00 - 17:00</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* クイックアクション */}
      <div className="mt-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">クイックアクション</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-8 h-8 text-salesforce-blue mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm font-medium text-gray-900">新規取引先</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-8 h-8 text-salesforce-blue mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">新規責任者</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-8 h-8 text-salesforce-blue mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">新規商談</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-8 h-8 text-salesforce-blue mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span className="text-sm font-medium text-gray-900">新規タスク</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}