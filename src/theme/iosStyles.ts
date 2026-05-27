import { alpha } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'

export const sectionStackSx: SxProps<Theme> = {
  position: 'relative',
  zIndex: 1,
}

/** iOS large navigation title (34pt semibold). */
export const iosLargeTitleSx: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: { xs: '2rem', sm: '2.125rem' },
  lineHeight: 1.15,
  letterSpacing: '0.01em',
  mb: 0.25,
}

/** Footnote-style section header above grouped lists. */
export const iosSectionHeaderSx: SxProps<Theme> = {
  color: 'text.secondary',
  fontSize: '0.8125rem',
  fontWeight: 400,
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
  px: 2,
  pt: 2,
  pb: 0.75,
}

/** Grouped inset card (Settings-style). */
export const iosGroupedCardSx: SxProps<Theme> = {
  bgcolor: 'background.paper',
  borderRadius: '12px',
  overflow: 'hidden',
}

/** Cell inside a grouped card. */
export const iosListCellSx: SxProps<Theme> = {
  py: 1.75,
  px: 2,
  alignItems: 'center',
  minHeight: 44,
  '&:not(:last-child)': {
    borderBottom: '0.5px solid',
    borderColor: 'divider',
  },
}

/** Frosted bar (tab bar / nav bar). */
export const iosFrostedBarSx: SxProps<Theme> = {
  backdropFilter: 'saturate(180%) blur(20px)',
  WebkitBackdropFilter: 'saturate(180%) blur(20px)',
  bgcolor: alpha('#1C1C1E', 0.72),
  borderColor: alpha('#545456', 0.36),
}

/** Home screen app icon tile. */
export const iosAppIconSx = (accent: string): SxProps<Theme> => ({
  bgcolor: accent,
  borderRadius: '22%',
  aspectRatio: '1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'transform 0.15s ease, opacity 0.15s ease',
  userSelect: 'none',
  WebkitTapHighlightColor: 'transparent',
  '&:active': {
    transform: 'scale(0.92)',
    opacity: 0.9,
  },
})

/** Fixed bottom offset above tab bar. */
export const iosBottomInset = 'calc(49px + env(safe-area-inset-bottom, 0px))'

/** Top safe area padding for status bar. */
export const iosTopInset = 'env(safe-area-inset-top, 0px)'
