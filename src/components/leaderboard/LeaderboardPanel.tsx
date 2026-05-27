import { Box, List, ListItem, ListItemText, Typography } from '@mui/material'
import type { LeaderboardEntry } from '../../types'
import { metroListItemSx } from '../../theme/metroStyles'

interface LeaderboardPanelProps {
  leaderboard: LeaderboardEntry[]
  userRank: number
}

const rankAccents = ['#0078D7', '#00ABA9', '#8764B8', '#FF8C00', '#E81123']

export function LeaderboardPanel({ leaderboard, userRank }: LeaderboardPanelProps) {
  return (
    <Box>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          p: 2,
          mb: 2,
        }}
      >
        <Typography variant="caption" sx={{ opacity: 0.85, display: 'block', mb: 0.5 }}>
          your rank
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 200 }}>
          {userRank > 0 ? `#${userRank}` : 'unranked'}
        </Typography>
      </Box>

      <Typography variant="subtitle2" sx={{ color: 'primary.main', mb: 1 }}>
        top 20
      </Typography>

      <List disablePadding>
        {leaderboard.map((entry, index) => (
          <ListItem
            key={entry.id}
            sx={{
              ...metroListItemSx,
              borderLeft: '4px solid',
              borderLeftColor: rankAccents[index % rankAccents.length],
              pl: 1.5,
            }}
          >
            <ListItemText
              primary={`${index + 1}. ${entry.handle}`}
              secondary={`$${entry.balance.toLocaleString()}`}
              slotProps={{
                primary: { variant: 'subtitle1', sx: { fontWeight: 400 } },
                secondary: { variant: 'body2', sx: { color: 'text.secondary' } },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
