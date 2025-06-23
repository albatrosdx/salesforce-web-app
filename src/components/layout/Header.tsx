'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton } from '@/components/auth'
import { PermissionBadge } from '@/components/permissions'
import { classNames } from '@/utils'

const navigation = [
  { name: '取引先', href: '/dashboard/accounts' },
  { name: '取引先責任者', href: '/dashboard/contacts' },
  { name: '商談', href: '/dashboard/opportunities' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <div className="w-8 h-8 bg-salesforce-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SF</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Salesforce Web App
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  pathname.startsWith(item.href)
                    ? 'border-salesforce-blue text-salesforce-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <PermissionBadge compact showDetails />
            <SignInButton />
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                pathname.startsWith(item.href)
                  ? 'bg-salesforce-blue text-white'
                  : 'text-gray-700 hover:bg-gray-50',
                'block px-3 py-2 rounded-md text-base font-medium transition-colors'
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}