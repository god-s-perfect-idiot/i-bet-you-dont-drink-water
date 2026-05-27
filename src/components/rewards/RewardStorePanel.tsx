import { Box, Button, Stack, Typography } from '@mui/material'
import type { UserReward } from '../../types'
import { PanelFrame } from '../shared/PanelFrame'
import { iosListCellSx } from '../../theme/iosStyles'

interface RewardStorePanelProps {
  rewards: UserReward[]
  balance: number
  onRedeem: (reward: UserReward) => Promise<void>
}

export function RewardStorePanel({ rewards, balance, onRedeem }: RewardStorePanelProps) {
  return (
    <PanelFrame title="Your rewards" badge="Spend coins to redeem">
      {rewards.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 3, textAlign: 'center' }}>
          No rewards yet. Tap + to create one, or browse Popular to add rewards from others.
        </Typography>
      ) : (
        <Stack spacing={0}>
          {rewards.map((item) => {
            const canAfford = balance >= item.cost
            return (
              <Box key={item.id} sx={{ ...iosListCellSx, display: 'block' }}>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.25 }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                  {item.cost.toLocaleString()} coins
                  {item.creatorUserId !== item.userId ? ' · From community' : ' · Yours'}
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  disabled={!canAfford}
                  onClick={() => onRedeem(item)}
                >
                  {canAfford ? 'Redeem' : 'Not enough coins'}
                </Button>
              </Box>
            )
          })}
        </Stack>
      )}
    </PanelFrame>
  )
}
