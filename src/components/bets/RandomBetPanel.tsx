import dayjs from 'dayjs'
import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import type { BetSide, Chore } from '../../types'
import { PanelFrame } from '../shared/PanelFrame'

interface RandomBetPanelProps {
  candidate: Chore | null
  stakeOptions: number[]
  stake: number
  isPlacingBet: boolean
  onStakeChange: (value: number) => void
  onBet: (side: BetSide, chore: Chore) => Promise<void>
  onSkip: () => Promise<void>
}

export function RandomBetPanel({
  candidate,
  stakeOptions,
  stake,
  isPlacingBet,
  onStakeChange,
  onBet,
  onSkip,
}: RandomBetPanelProps) {
  return (
    <PanelFrame title="Quick Bet" badge="24h window">
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Stake amount
        </Typography>
        <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.75 }}>
          {stakeOptions.map((value) => (
            <Chip
              key={value}
              label={`$${value}`}
              color={stake === value ? 'primary' : 'default'}
              variant={stake === value ? 'filled' : 'outlined'}
              disabled={isPlacingBet}
              onClick={() => onStakeChange(value)}
              sx={
                stake === value
                  ? undefined
                  : { borderColor: 'divider', color: 'text.secondary', bgcolor: 'transparent' }
              }
            />
          ))}
        </Stack>
      </Box>

      {candidate ? (
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.25 }}>
            {candidate.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Expires {dayjs(candidate.expiresAt).format('MMM D, h:mm A')}
          </Typography>
          <Stack spacing={1}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              disabled={isPlacingBet}
              onClick={() => onBet('complete', candidate)}
            >
              {isPlacingBet ? 'Placing...' : 'Bet Complete'}
            </Button>
            <Button fullWidth variant="contained" color="error" disabled={isPlacingBet} onClick={() => onBet('fail', candidate)}>
              {isPlacingBet ? 'Placing...' : 'Bet Fail'}
            </Button>
            <Button fullWidth variant="text" color="inherit" disabled={isPlacingBet} onClick={onSkip}>
              Skip
            </Button>
          </Stack>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 3, textAlign: 'center' }}>
          No eligible chores right now.
        </Typography>
      )}
    </PanelFrame>
  )
}
