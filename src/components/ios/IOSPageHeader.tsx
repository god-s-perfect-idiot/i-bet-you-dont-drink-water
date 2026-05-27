import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { iosLargeTitleSx } from '../../theme/iosStyles'

interface IOSPageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function IOSPageHeader({ title, subtitle, action }: IOSPageHeaderProps) {
  return (
    <Box sx={{ mb: 2, pt: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography component="h1" sx={iosLargeTitleSx}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {action}
      </Box>
    </Box>
  )
}
