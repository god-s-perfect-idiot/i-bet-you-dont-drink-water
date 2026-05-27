import dayjs from 'dayjs'
import { Box, Button, Stack, Typography } from '@mui/material'
import type { BetSide, Chore } from '../../types'
import { PanelFrame } from '../shared/PanelFrame'

interface PopularChoresPanelProps {
  chores: Chore[]
  onBet: (side: BetSide, chore: Chore) => Promise<void>
}

export function PopularChoresPanel({ chores, onBet }: PopularChoresPanelProps) {
  return (
    <PanelFrame title="popular" badge="largest pools">
      <Stack spacing={0}>
        {chores.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            no active pools right now.
          </Typography>
        ) : (
          chores.map((item) => (
            <Box
              key={item.id}
              sx={{
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': { borderBottom: 'none' },
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                pool ${item.totalPool.toLocaleString()} · {dayjs(item.expiresAt).format('MMM D · HH:mm')}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button size="small" variant="contained" color="success" onClick={() => onBet('complete', item)}>
                  complete
                </Button>
                <Button size="small" variant="contained" color="error" onClick={() => onBet('fail', item)}>
                  fail
                </Button>
              </Stack>
            </Box>
          ))
        )}
      </Stack>
    </PanelFrame>
  )
}
