import { Box, List, ListItem, ListItemText, Typography } from '@mui/material'
import type { LeaderboardEntry } from '../../types'
import { IOSGroupedSection } from '../ios/IOSGroupedSection'
import { iosListCellSx, paperThemeColors } from '../../theme/iosStyles'

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
          border: `3px solid ${paperThemeColors.ink}`,
          borderRadius: '22px',
          color: '#FFFFFF',
          boxShadow: `10px 10px 0 ${paperThemeColors.ink}`,
          px: { xs: 2, sm: 2.75 },
          py: { xs: 2, sm: 2.4 },
          mb: 2.5,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 2,
          backgroundColor: '#8C6A00',
          backgroundImage:
            'repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 14px, rgba(0,0,0,0.04) 14px 28px)',
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mb: 0.65,
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            Your Rank
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
              textShadow: `3px 3px 0 ${paperThemeColors.ink}`,
            }}
          >
            {userRank > 0 ? `#${userRank}` : '—'}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right', pb: 0.25 }}>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.92)',
            }}
          >
            Leaderboard
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 900,
              color: '#FECB00',
              textShadow: `2px 2px 0 ${paperThemeColors.ink}`,
              lineHeight: 1.05,
            }}
          >
            Top 20
          </Typography>
        </Box>
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
