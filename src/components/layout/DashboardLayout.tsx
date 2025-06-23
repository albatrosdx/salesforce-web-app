'use client'

import { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { ProtectedRoute } from '@/components/auth'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ProtectedRoute>
      <div className="h-screen flex overflow-hidden bg-gray-100">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <Header />
          
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden fixed bottom-4 right-4 z-50 bg-salesforce-blue text-white p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-salesforce-blue focus:ring-offset-2"
          onClick={() => setSidebarOpen(true)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </ProtectedRoute>
  )
}