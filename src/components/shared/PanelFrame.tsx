import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'

interface PanelFrameProps {
  title: string
  badge?: string
  children: ReactNode
}

export function PanelFrame({ title, badge, children }: PanelFrameProps) {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
        <Typography variant="subtitle2" component="h2" sx={{ color: 'primary.main', mb: 0 }}>
          {title}
        </Typography>
        {badge ? (
          <Typography variant="caption" color="text.secondary">
            {badge}
          </Typography>
        ) : null}
      </Box>
      {children}
    </Box>
  )
}
