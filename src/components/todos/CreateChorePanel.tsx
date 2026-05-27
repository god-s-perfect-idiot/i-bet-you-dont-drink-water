import type { FormEvent } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'

interface CreateChorePanelProps {
  open: boolean
  title: string
  onClose: () => void
  onTitleChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

export function CreateChorePanel({ open, title, onClose, onTitleChange, onSubmit }: CreateChorePanelProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 300, fontSize: '1.75rem' }}>new chore</DialogTitle>
      <Stack component="form" spacing={2} onSubmit={onSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            autoFocus
            fullWidth
            label="chore name"
            placeholder="drink 3 glasses of water"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            required
          />
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button onClick={onClose} color="inherit">
            cancel
          </Button>
          <Button type="submit" variant="contained" disabled={!title.trim()}>
            save
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  )
}
