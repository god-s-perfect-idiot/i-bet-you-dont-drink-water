import SearchIcon from '@mui/icons-material/Search'
import { Box, InputAdornment, TextField } from '@mui/material'
import { useMemo, useState } from 'react'
import type { Reward, UserReward } from '../../types'
import { IOSSegmentedControl } from '../ios/IOSSegmentedControl'
import { PopularRewardsPanel } from './PopularRewardsPanel'
import { RewardStorePanel } from './RewardStorePanel'

interface RewardsPanelProps {
  userId: string
  balance: number
  userRewards: UserReward[]
  popularRewards: Reward[]
  onRedeem: (reward: UserReward) => Promise<void>
  onAddToStore: (reward: Reward) => Promise<void>
}

function matchesSearch(title: string, query: string): boolean {
  if (!query.trim()) return true
  return title.toLowerCase().includes(query.trim().toLowerCase())
}

export function RewardsPanel({
  userId,
  balance,
  userRewards,
  popularRewards,
  onRedeem,
  onAddToStore,
}: RewardsPanelProps) {
  const [tab, setTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const savedRewardIds = useMemo(
    () => new Set(userRewards.map((item) => item.rewardId)),
    [userRewards],
  )

  const filteredStore = useMemo(
    () => userRewards.filter((item) => matchesSearch(item.title, searchQuery)),
    [userRewards, searchQuery],
  )

  const filteredPopular = useMemo(
    () => popularRewards.filter((item) => matchesSearch(item.title, searchQuery)),
    [popularRewards, searchQuery],
  )

  return (
    <Box>
      <TextField
        fullWidth
        placeholder="Search rewards"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 2 }}
      />

      <IOSSegmentedControl
        value={tab}
        labels={['Reward Store', 'Popular']}
        onChange={setTab}
        aria-label="Rewards sections"
      />

      {tab === 0 && (
        <RewardStorePanel rewards={filteredStore} balance={balance} onRedeem={onRedeem} />
      )}
      {tab === 1 && (
        <PopularRewardsPanel
          rewards={filteredPopular}
          userId={userId}
          savedRewardIds={savedRewardIds}
          onAdd={onAddToStore}
        />
      )}
    </Box>
  )
}
