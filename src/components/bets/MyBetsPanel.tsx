import { Box, Stack, Typography } from '@mui/material'
import type { Bet } from '../../types'
import { PanelFrame } from '../shared/PanelFrame'

interface MyBetsPanelProps {
  bets: Bet[]
}

export function MyBetsPanel({ bets }: MyBetsPanelProps) {
  return (
    <PanelFrame title="my bets" badge={`${bets.length} open`}>
      <Stack spacing={0}>
        {bets.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            you haven&apos;t placed any bets yet.
          </Typography>
        ) : (
          bets.map((bet) => (
            <Box
              key={bet.id}
              sx={{
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': { borderBottom: 'none' },
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                {bet.side === 'complete' ? 'will complete' : 'will fail'} · ${bet.stake}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'lowercase' }}>
                {bet.status}
                {bet.payout ? ` · payout $${bet.payout}` : ''}
              </Typography>
            </Box>
          ))
        )}
      </Stack>
    </PanelFrame>
  )
}
