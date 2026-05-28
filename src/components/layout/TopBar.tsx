import { useEffect, useRef, useState } from 'react'
import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import type { UserProfile } from '../../types'
import { iosFrostedBarSx, iosTopInset, paperThemeColors } from '../../theme/iosStyles'

interface TopBarProps {
  profile: UserProfile | null
}

export function TopBar({ profile }: TopBarProps) {
  const balance = profile?.balance ?? 0
  const [displayBalance, setDisplayBalance] = useState(0)
  const previousBalanceRef = useRef(0)
  const latestDisplayBalanceRef = useRef(0)

  useEffect(() => {
    const startValue = previousBalanceRef.current
    const endValue = balance
    const durationMs = 700
    const animationStart = performance.now()
    let frameId = 0

    const tick = (now: number) => {
      const elapsed = now - animationStart
      const progress = Math.min(elapsed / durationMs, 1)
      const nextValue = Math.round(startValue + (endValue - startValue) * progress)
      latestDisplayBalanceRef.current = nextValue
      setDisplayBalance(nextValue)

      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      } else {
        previousBalanceRef.current = endValue
      }
    }

    frameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frameId)
      previousBalanceRef.current = latestDisplayBalanceRef.current
    }
  }, [balance])

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        ...iosFrostedBarSx,
        pt: iosTopInset,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        overflow: 'hidden',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          gap: 2,
          minHeight: 58,
          py: 1.25,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            px: 1.25,
            py: 0.5,
            borderRadius: 999,
            border: `2px solid ${paperThemeColors.ink}`,
            bgcolor: paperThemeColors.yellow,
            boxShadow: `2px 2px 0 ${paperThemeColors.ink}`,
            transform: 'rotate(-2deg)',
          }}
        >
          Chore. Bet. Repeat.
        </Typography>
        <Box
          sx={{
            px: 1.4,
            py: 0.65,
            minWidth: 112,
            borderRadius: '12px',
            border: `3px solid ${paperThemeColors.ink}`,
            bgcolor: '#FFFFFF',
            boxShadow: `4px 4px 0 ${paperThemeColors.ink}`,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', lineHeight: 1.1, fontSize: '0.68rem', textAlign: 'right' }}
          >
            Balance
          </Typography>
          <Typography
            variant="body2"
            component="div"
            sx={{ fontWeight: 700, lineHeight: 1.2, color: 'primary.main', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}
          >
            ${displayBalance.toLocaleString()}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
