import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { iosGroupedCardSx, iosSectionHeaderSx } from '../../theme/iosStyles'

interface IOSGroupedSectionProps {
  title?: string
  footer?: string
  children: ReactNode
  sx?: object
}

export function IOSGroupedSection({ title, footer, children, sx }: IOSGroupedSectionProps) {
  return (
    <Box sx={{ mb: 2.5, ...sx }}>
      {title ? (
        <Typography component="h3" sx={iosSectionHeaderSx}>
          {title}
        </Typography>
      ) : null}
      <Box sx={iosGroupedCardSx}>{children}</Box>
      {footer ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', px: 2, pt: 1 }}>
          {footer}
        </Typography>
      ) : null}
    </Box>
  )
}
