'use client'

import { OpportunityPipeline } from '@/components/opportunities'
import { useOpportunities } from '@/lib/salesforce'

export default function OpportunityPipelinePage() {
  // より多くのデータを取得してパイプライン表示
  const { data, isLoading, error } = useOpportunities(200, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">商談パイプライン</h1>
        <p className="text-gray-600 mt-1">ステージ別の商談状況を視覚的に確認できます</p>
      </div>
      
      {error ? (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">データ取得エラー</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                再試行
              </button>
            </div>
          </div>
        </div>
      ) : (
        <OpportunityPipeline
          opportunities={data?.records || []}
          loading={isLoading}
        />
      )}
    </div>
  )
}