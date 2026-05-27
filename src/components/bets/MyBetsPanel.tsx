import { Box, Stack, Typography } from '@mui/material'
import type { Bet } from '../../types'
import { PanelFrame } from '../shared/PanelFrame'
import { iosListCellSx } from '../../theme/iosStyles'

interface MyBetsPanelProps {
  bets: Bet[]
}

export function MyBetsPanel({ bets }: MyBetsPanelProps) {
  return (
    <PanelFrame title="My Bets" badge={`${bets.length} open`}>
      {bets.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 3, textAlign: 'center' }}>
          You haven&apos;t placed any bets yet.
        </Typography>
      ) : (
        <Stack spacing={0}>
          {bets.map((bet) => (
            <Box key={bet.id} sx={iosListCellSx}>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.25 }}>
                {bet.side === 'complete' ? 'Will complete' : 'Will fail'} · ${bet.stake}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                {bet.status}
                {bet.payout ? ` · Payout $${bet.payout}` : ''}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </PanelFrame>
  )
}
