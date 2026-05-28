import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { iosLargeTitleSx, paperThemeColors } from '../../theme/iosStyles'

interface IOSPageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function IOSPageHeader({ title, subtitle, action }: IOSPageHeaderProps) {
  return (
    <Box sx={{ mb: 2.5, pt: 0.75 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography component="h1" sx={iosLargeTitleSx}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant="body2"
              color="text.primary"
              sx={{
                mt: 0.35,
                display: 'inline-flex',
                px: 1,
                py: 0.25,
                borderRadius: 999,
                border: `2px solid ${paperThemeColors.ink}`,
                bgcolor: '#8DDB5B',
                boxShadow: `2px 2px 0 ${paperThemeColors.ink}`,
              }}
            >
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {action}
      </Box>
    </Box>
  )
}
