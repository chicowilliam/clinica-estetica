import type { ReactNode } from 'react'

export function Magnetic({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex ${className}`.trim()} data-magnetic>
      {children}
    </span>
  )
}
