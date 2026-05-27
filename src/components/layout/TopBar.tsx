import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import type { UserProfile } from '../../types'
import { iosFrostedBarSx, iosTopInset } from '../../theme/iosStyles'

interface TopBarProps {
  profile: UserProfile | null
}

export function TopBar({ profile }: TopBarProps) {
  const balance = profile?.balance ?? 0

  return (
    <AppBar position="sticky" elevation={0} sx={{ ...iosFrostedBarSx, pt: iosTopInset }}>
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2, minHeight: 44, py: 0 }}>
        <Typography variant="body1" component="div" sx={{ fontWeight: 600 }}>
          Water Bets
        </Typography>
        <Box
          sx={{
            px: 1.25,
            py: 0.5,
            borderRadius: '8px',
            bgcolor: '#2C2C2E',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2, fontSize: '0.6875rem' }}>
            Balance
          </Typography>
          <Typography variant="body2" component="div" sx={{ fontWeight: 600, lineHeight: 1.2, color: 'primary.main' }}>
            ${balance.toLocaleString()}
          </Typography>
        </Box>
      </Toolbar>
      <Box sx={{ borderBottom: '0.5px solid', borderColor: 'divider' }} />
    </AppBar>
  )
}
