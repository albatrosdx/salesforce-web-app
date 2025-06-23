import { HTMLAttributes, forwardRef } from 'react'
import { classNames } from '@/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'md', children, ...props }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    }
    
    return (
      <div
        ref={ref}
        className={classNames(
          'bg-white rounded-lg shadow-sm border border-gray-200',
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

type CardHeaderProps = HTMLAttributes<HTMLDivElement>

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={classNames('pb-4 border-b border-gray-200', className)}
      {...props}
    />
  )
)

CardHeader.displayName = 'CardHeader'

type CardContentProps = HTMLAttributes<HTMLDivElement>

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={classNames('pt-4', className)}
      {...props}
    />
  )
)

CardContent.displayName = 'CardContent'

export { Card, CardHeader, CardContent }