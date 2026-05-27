import type { ReactNode } from 'react'
import { IOSGroupedSection } from '../ios/IOSGroupedSection'

interface PanelFrameProps {
  title: string
  badge?: string
  children: ReactNode
}

export function PanelFrame({ title, badge, children }: PanelFrameProps) {
  const header = badge ? `${title} · ${badge}` : title
  return <IOSGroupedSection title={header}>{children}</IOSGroupedSection>
}
