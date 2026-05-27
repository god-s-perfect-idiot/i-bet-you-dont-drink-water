import type { FormEvent } from 'react'
import { forwardRef } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
  TextField,
} from '@mui/material'
import type { TransitionProps } from '@mui/material/transitions'

const SlideUp = forwardRef(function SlideUp(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface CreateRewardPanelProps {
  open: boolean
  title: string
  cost: string
  onClose: () => void
  onTitleChange: (value: string) => void
  onCostChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

export function CreateRewardPanel({
  open,
  title,
  cost,
  onClose,
  onTitleChange,
  onCostChange,
  onSubmit,
}: CreateRewardPanelProps) {
  const parsedCost = Number(cost)
  const isValid = title.trim().length > 0 && Number.isFinite(parsedCost) && parsedCost > 0

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slots={{ transition: SlideUp }}
      slotProps={{
        paper: {
          sx: {
            position: 'fixed',
            bottom: 0,
            m: 0,
            width: '100%',
            maxWidth: '100%',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.0625rem', textAlign: 'center', pb: 1 }}>
        New Reward
      </DialogTitle>
      <Stack component="form" spacing={0} onSubmit={onSubmit}>
        <DialogContent sx={{ pt: 0 }}>
          <Stack spacing={2}>
            <TextField
              autoFocus
              fullWidth
              label="What do you want to earn?"
              placeholder="1 hour of videogames"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Cost (coins)"
              placeholder="500"
              type="number"
              slotProps={{ htmlInput: { min: 1, step: 1 } }}
              value={cost}
              onChange={(event) => onCostChange(event.target.value)}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', gap: 1, px: 2, pb: 3, pt: 0 }}>
          <Button type="submit" variant="contained" fullWidth disabled={!isValid}>
            Create Reward
          </Button>
          <Button onClick={onClose} color="inherit" fullWidth>
            Cancel
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  )
}
