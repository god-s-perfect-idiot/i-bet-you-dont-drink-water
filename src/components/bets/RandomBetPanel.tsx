import dayjs from 'dayjs'
import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import type { BetSide, Chore } from '../../types'
import { PanelFrame } from '../shared/PanelFrame'

interface RandomBetPanelProps {
  candidate: Chore | null
  stakeOptions: number[]
  stake: number
  onStakeChange: (value: number) => void
  onBet: (side: BetSide, chore: Chore) => Promise<void>
  onSkip: () => Promise<void>
}

export function RandomBetPanel({ candidate, stakeOptions, stake, onStakeChange, onBet, onSkip }: RandomBetPanelProps) {
  return (
    <PanelFrame title="quick bet" badge="24h window">
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        stake amount
      </Typography>
      <Stack direction="row" spacing={0.5} sx={{ mb: 2.5, flexWrap: 'wrap', gap: 0.5 }}>
        {stakeOptions.map((value) => (
          <Chip
            key={value}
            label={`$${value}`}
            color={stake === value ? 'primary' : 'default'}
            variant={stake === value ? 'filled' : 'outlined'}
            onClick={() => onStakeChange(value)}
            sx={
              stake === value
                ? undefined
                : { borderColor: 'divider', color: 'text.secondary', bgcolor: 'transparent' }
            }
          />
        ))}
      </Stack>
      {candidate ? (
        <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
            {candidate.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            expires {dayjs(candidate.expiresAt).format('MMM D · HH:mm')}
          </Typography>
          <Stack spacing={1}>
            <Button fullWidth variant="contained" color="success" onClick={() => onBet('complete', candidate)}>
              bet complete
            </Button>
            <Button fullWidth variant="contained" color="error" onClick={() => onBet('fail', candidate)}>
              bet fail
            </Button>
            <Button fullWidth variant="outlined" color="inherit" onClick={onSkip} sx={{ borderColor: 'divider' }}>
              skip
            </Button>
          </Stack>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          no eligible chores right now.
        </Typography>
      )}
    </PanelFrame>
  )
}
