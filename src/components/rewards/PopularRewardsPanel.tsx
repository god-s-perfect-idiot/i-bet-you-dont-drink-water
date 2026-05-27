import { Box, Button, Stack, Typography } from '@mui/material'
import type { Reward } from '../../types'
import { PanelFrame } from '../shared/PanelFrame'
import { iosListCellSx } from '../../theme/iosStyles'

interface PopularRewardsPanelProps {
  rewards: Reward[]
  userId: string
  savedRewardIds: Set<string>
  onAdd: (reward: Reward) => Promise<void>
}

export function PopularRewardsPanel({
  rewards,
  userId,
  savedRewardIds,
  onAdd,
}: PopularRewardsPanelProps) {
  const communityRewards = rewards.filter((item) => item.creatorUserId !== userId)

  return (
    <PanelFrame title="Popular" badge="Sorted by subscribers">
      {communityRewards.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 3, textAlign: 'center' }}>
          No community rewards yet. Be the first to create one!
        </Typography>
      ) : (
        <Stack spacing={0}>
          {communityRewards.map((item) => {
            const alreadySaved = savedRewardIds.has(item.id)
            return (
              <Box key={item.id} sx={{ ...iosListCellSx, display: 'block' }}>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.25 }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                  {item.cost.toLocaleString()} coins · {item.subscriberCount.toLocaleString()} subscribers
                </Typography>
                <Button
                  size="small"
                  variant={alreadySaved ? 'outlined' : 'contained'}
                  color="primary"
                  disabled={alreadySaved}
                  onClick={() => onAdd(item)}
                >
                  {alreadySaved ? 'In your store' : 'Add to store'}
                </Button>
              </Box>
            )
          })}
        </Stack>
      )}
    </PanelFrame>
  )
}
