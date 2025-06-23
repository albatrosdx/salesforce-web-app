'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { classNames } from '@/utils'
import { TabItem } from '@/types'

interface TabNavigationProps {
  tabs: TabItem[]
  className?: string
}

export function TabNavigation({ tabs, className }: TabNavigationProps) {
  const pathname = usePathname()

  return (
    <div className={classNames('border-b border-gray-200', className)}>
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/')
          
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={classNames(
                isActive
                  ? 'border-salesforce-blue text-salesforce-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors'
              )}
            >
              {tab.icon && (
                <span className="mr-2 inline-block">
                  {tab.icon}
                </span>
              )}
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

// 事前定義されたタブセット
export const accountTabs: TabItem[] = [
  {
    id: 'list',
    label: '一覧',
    href: '/dashboard/accounts',
  },
  {
    id: 'search',
    label: '検索',
    href: '/dashboard/accounts/search',
  },
]

export const contactTabs: TabItem[] = [
  {
    id: 'list',
    label: '一覧',
    href: '/dashboard/contacts',
  },
  {
    id: 'search',
    label: '検索',
    href: '/dashboard/contacts/search',
  },
]

export const opportunityTabs: TabItem[] = [
  {
    id: 'list',
    label: '一覧',
    href: '/dashboard/opportunities',
  },
  {
    id: 'pipeline',
    label: 'パイプライン',
    href: '/dashboard/opportunities/pipeline',
  },
]