import type { FormEvent } from 'react'
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
import { forwardRef } from 'react'

const SlideUp = forwardRef(function SlideUp(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface CreateChorePanelProps {
  open: boolean
  title: string
  dueInDays: string
  onClose: () => void
  onTitleChange: (value: string) => void
  onDueInDaysChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

export function CreateChorePanel({
  open,
  title,
  dueInDays,
  onClose,
  onTitleChange,
  onDueInDaysChange,
  onSubmit,
}: CreateChorePanelProps) {
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
        New Chore
      </DialogTitle>
      <Stack component="form" spacing={0} onSubmit={onSubmit}>
        <DialogContent sx={{ pt: 0 }}>
          <TextField
            autoFocus
            fullWidth
            label="What do you need to do?"
            placeholder="Drink 3 glasses of water"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Due in how many days?"
            type="number"
            value={dueInDays}
            onChange={(event) => onDueInDaysChange(event.target.value)}
            required
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', gap: 1, px: 2, pb: 3, pt: 0 }}>
          <Button type="submit" variant="contained" fullWidth disabled={!title.trim() || !dueInDays.trim()}>
            Add Chore
          </Button>
          <Button onClick={onClose} color="inherit" fullWidth>
            Cancel
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  )
}
