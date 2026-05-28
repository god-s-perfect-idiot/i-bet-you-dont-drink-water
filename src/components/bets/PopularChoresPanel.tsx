import dayjs from 'dayjs'
import { Box, Button, Stack, Typography } from '@mui/material'
import type { BetSide, Chore } from '../../types'
import { PanelFrame } from '../shared/PanelFrame'
import { iosListCellSx } from '../../theme/iosStyles'

interface PopularChoresPanelProps {
  userId: string
  chores: Chore[]
  myBetChoreIds: Set<string>
  onBet: (side: BetSide, chore: Chore) => Promise<void>
}

export function PopularChoresPanel({ userId, chores, myBetChoreIds, onBet }: PopularChoresPanelProps) {
  const visibleChores = chores.filter(
    (item) => item.ownerUserId !== userId && item.status === 'open' && dayjs(item.expiresAt).isAfter(dayjs()),
  )

  return (
    <PanelFrame title="Popular" badge="Largest pools">
      {visibleChores.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 3, textAlign: 'center' }}>
          No active pools right now.
        </Typography>
      ) : (
        <Stack spacing={0}>
          {visibleChores.map((item) => {
            const hasBet = myBetChoreIds.has(item.id)
            return (
              <Box key={item.id} sx={{ ...iosListCellSx, display: 'block' }}>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.25 }}>
                {item.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                Pool ${item.totalPool.toLocaleString()} · {dayjs(item.expiresAt).format('MMM D, h:mm A')}
              </Typography>
                  {hasBet ? (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Already in your bets
                    </Typography>
                  ) : (
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="contained" color="success" onClick={() => onBet('complete', item)}>
                        Complete
                      </Button>
                      <Button size="small" variant="contained" color="error" onClick={() => onBet('fail', item)}>
                        Fail
                      </Button>
                    </Stack>
                  )}
              </Box>
            )
          })}
        </Stack>
      )}
    </PanelFrame>
  )
}
