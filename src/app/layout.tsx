import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/auth'
import { PermissionProvider } from '@/lib/permissions'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Salesforce Web App',
  description: 'Modern Salesforce data management application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <PermissionProvider>
            <div className="min-h-screen bg-gray-50">
              {children}
            </div>
          </PermissionProvider>
        </AuthProvider>
      </body>
    </html>
  )
}