import { alpha } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'

export const paperThemeColors = {
  ink: '#1C1B1B',
  cream: '#FCF9F8',
  paper: '#F6F3F2',
  paperElevated: '#FFFFFF',
  red: '#BC000A',
  redBright: '#E2241F',
  yellow: '#FECB00',
  blue: '#0079C1',
  brown: '#926F6A',
} as const

export const sectionStackSx: SxProps<Theme> = {
  position: 'relative',
  zIndex: 1,
}

/** iOS large navigation title (34pt semibold). */
export const iosLargeTitleSx: SxProps<Theme> = {
  fontWeight: 800,
  fontSize: { xs: '2rem', sm: '2.3rem' },
  lineHeight: 1.05,
  letterSpacing: '-0.01em',
  textTransform: 'uppercase',
  textShadow: `2px 2px 0 ${alpha(paperThemeColors.ink, 0.22)}`,
  mb: 0.25,
}

/** Footnote-style section header above grouped lists. */
export const iosSectionHeaderSx: SxProps<Theme> = {
  color: 'text.primary',
  fontSize: '0.74rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  px: 0.5,
  pt: 1.25,
  pb: 1,
  transform: 'rotate(-1deg)',
}

/** Grouped inset card (Settings-style). */
export const iosGroupedCardSx: SxProps<Theme> = {
  bgcolor: 'background.paper',
  borderRadius: '16px',
  overflow: 'hidden',
  border: `3px solid ${paperThemeColors.ink}`,
  boxShadow: `4px 4px 0 ${paperThemeColors.ink}`,
  backgroundImage:
    'radial-gradient(rgba(28,27,27,0.06) 0.8px, transparent 0.8px), linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 30%)',
  backgroundSize: '8px 8px, auto',
}

/** Cell inside a grouped card. */
export const iosListCellSx: SxProps<Theme> = {
  py: 1.5,
  px: 2,
  alignItems: 'center',
  minHeight: 44,
  '&:not(:last-child)': {
    borderBottom: `2px solid ${alpha(paperThemeColors.ink, 0.2)}`,
  },
}

/** Frosted bar (top nav). */
export const iosFrostedBarSx: SxProps<Theme> = {
  bgcolor: alpha(paperThemeColors.cream, 0.95),
  borderBottom: `3px solid ${paperThemeColors.ink}`,
  boxShadow: `4px 4px 0 ${paperThemeColors.ink}`,
}

/** Bottom tab bar — solid fill (no backdrop blur) to avoid a light fringe at the top edge. */
export const iosTabBarSx: SxProps<Theme> = {
  bgcolor: paperThemeColors.cream,
  borderColor: paperThemeColors.ink,
  boxShadow: `4px 4px 0 ${paperThemeColors.ink}`,
  backgroundImage:
    'radial-gradient(rgba(28,27,27,0.05) 0.8px, transparent 0.8px), linear-gradient(180deg, rgba(255,255,255,0.4), rgba(255,255,255,0))',
  backgroundSize: '8px 8px, auto',
}

/** Tab bar content height (excludes safe-area inset). */
export const iosTabBarHeight = 56

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
export const iosBottomInset = `calc(${iosTabBarHeight}px + env(safe-area-inset-bottom, 0px))`

/** Top safe area padding for status bar. */
export const iosTopInset = 'env(safe-area-inset-top, 0px)'
