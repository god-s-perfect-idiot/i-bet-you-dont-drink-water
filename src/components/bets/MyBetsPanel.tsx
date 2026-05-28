import { Box, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import type { Bet } from '../../types'
import { PanelFrame } from '../shared/PanelFrame'
import { iosListCellSx } from '../../theme/iosStyles'

interface MyBetsPanelProps {
  bets: Bet[]
}

export function MyBetsPanel({ bets }: MyBetsPanelProps) {
  const openBetsCount = bets.filter((bet) => bet.status === 'open').length
  return (
    <PanelFrame title="My Bets" badge={`${openBetsCount} open`}>
      {bets.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 3, textAlign: 'center' }}>
          You haven&apos;t placed any bets yet.
        </Typography>
      ) : (
        <Stack spacing={0}>
          {bets.map((bet) => (
            (() => {
              const rightAmount =
                bet.status === 'won' ? `+$${bet.payout}` : bet.status === 'lost' ? `-$${bet.stake}` : null
              const rightColor = bet.status === 'won' ? '#16a34a' : bet.status === 'lost' ? '#dc2626' : 'text.primary'
              return (
            <Box
              key={bet.id}
              sx={{
                ...iosListCellSx,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.25 }}>
                  {bet.choreTitle?.trim() || 'Untitled chore'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                  Bet placed {dayjs(bet.createdAt).format('MMM D, YYYY h:mm A')}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                  {bet.side === 'complete' ? 'Will complete' : 'Will fail'} · ${bet.stake} stake · {bet.status}
                </Typography>
              </Box>
              {rightAmount && (
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                    color: rightColor,
                  }}
                >
                  {rightAmount}
                </Typography>
              )}
            </Box>
              )
            })()
          ))}
        </Stack>
      )}
    </PanelFrame>
  )
}
