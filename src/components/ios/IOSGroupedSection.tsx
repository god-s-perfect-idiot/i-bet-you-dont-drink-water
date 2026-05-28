import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { iosGroupedCardSx, iosSectionHeaderSx } from '../../theme/iosStyles'

interface IOSGroupedSectionProps {
  title?: string
  footer?: string
  children: ReactNode
  bare?: boolean
  sx?: object
}

export function IOSGroupedSection({ title, footer, children, bare, sx }: IOSGroupedSectionProps) {
  return (
    <Box sx={{ mb: 2.75, ...sx }}>
      {title ? (
        <Typography component="h3" sx={iosSectionHeaderSx}>
          {title}
        </Typography>
      ) : null}
      <Box sx={bare ? undefined : iosGroupedCardSx}>{children}</Box>
      {footer ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', px: 1, pt: 1.1, fontWeight: 500 }}>
          {footer}
        </Typography>
      ) : null}
    </Box>
  )
}
