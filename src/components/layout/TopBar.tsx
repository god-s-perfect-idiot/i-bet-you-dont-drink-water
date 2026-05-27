import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import type { UserProfile } from '../../types'

interface TopBarProps {
  profile: UserProfile | null
}

export function TopBar({ profile }: TopBarProps) {
  const balance = profile?.balance ?? 0

  return (
    <AppBar position="sticky" elevation={0}>
      <Box sx={{ height: 4, bgcolor: 'primary.main' }} aria-hidden />
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2, minHeight: 44, py: 0.5 }}>
        <Typography
          variant="subtitle2"
          component="div"
          sx={{ flex: 1, fontWeight: 600, letterSpacing: '0.08em', color: 'text.secondary' }}
        >
          water bets
        </Typography>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2 }}>
            balance
          </Typography>
          <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            ${balance.toLocaleString()}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
