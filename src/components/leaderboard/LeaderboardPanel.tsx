import { Box, List, ListItem, ListItemText, Typography } from '@mui/material'
import type { LeaderboardEntry } from '../../types'
import { IOSGroupedSection } from '../ios/IOSGroupedSection'
import { iosListCellSx } from '../../theme/iosStyles'

interface LeaderboardPanelProps {
  leaderboard: LeaderboardEntry[]
  userRank: number
}

const medalColors = ['#FFD60A', '#C7C7CC', '#AC8E68']

export function LeaderboardPanel({ leaderboard, userRank }: LeaderboardPanelProps) {
  return (
    <Box>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)',
          borderRadius: '12px',
          color: '#FFFFFF',
          p: 2.5,
          mb: 2.5,
        }}
      >
        <Typography variant="caption" sx={{ opacity: 0.85, display: 'block', mb: 0.5 }}>
          Your Rank
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {userRank > 0 ? `#${userRank}` : 'Unranked'}
        </Typography>
      </Box>

      <IOSGroupedSection title="Top 20">
        <List disablePadding>
          {leaderboard.map((entry, index) => (
            <ListItem
              key={entry.id}
              sx={{
                ...iosListCellSx,
                ...(index < 3 ? { bgcolor: 'rgba(255,255,255,0.03)' } : {}),
              }}
            >
              <Typography
                component="span"
                sx={{
                  width: 28,
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  color: index < 3 ? medalColors[index] : 'text.secondary',
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </Typography>
              <ListItemText
                primary={entry.handle}
                secondary={`$${entry.balance.toLocaleString()}`}
                sx={{ ml: 1 }}
                slotProps={{
                  primary: { variant: 'body1', sx: { fontWeight: 500 } },
                  secondary: { variant: 'caption', sx: { color: 'text.secondary' } },
                }}
              />
            </ListItem>
          ))}
        </List>
      </IOSGroupedSection>
    </Box>
  )
}
