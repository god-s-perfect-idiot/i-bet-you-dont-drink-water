import type { FormEvent } from 'react'
import dayjs from 'dayjs'
import { Box, Button, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material'
import type { Chore } from '../../types'
import { metroListItemSx } from '../../theme/metroStyles'

interface MyChoresPanelProps {
  chores: Chore[]
  onComplete: (choreId: string) => void
  isCreating: boolean
  newChoreTitle: string
  onTitleChange: (value: string) => void
  onCreate: (event: FormEvent<HTMLFormElement>) => Promise<void>
  onCancelCreate: () => void
}

export function MyChoresPanel({
  chores,
  onComplete,
  isCreating,
  newChoreTitle,
  onTitleChange,
  onCreate,
  onCancelCreate,
}: MyChoresPanelProps) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        {chores.length} active {chores.length === 1 ? 'chore' : 'chores'}
      </Typography>
      <List disablePadding>
        {chores.map((todo) => (
          <ListItem
            key={todo.id}
            sx={metroListItemSx}
            secondaryAction={
              todo.status === 'open' ? (
                <Button onClick={() => onComplete(todo.id)} variant="contained" color="primary" size="small">
                  done
                </Button>
              ) : null
            }
          >
            <ListItemText
              primary={todo.title}
              secondary={`${todo.status} · ${dayjs(todo.expiresAt).format('MMM D · HH:mm')}`}
              slotProps={{
                primary: { variant: 'subtitle1', sx: { fontWeight: 400 } },
                secondary: { variant: 'body2', sx: { color: 'text.secondary', textTransform: 'lowercase' } },
              }}
            />
          </ListItem>
        ))}
        {isCreating ? (
          <ListItem sx={{ ...metroListItemSx, display: 'block' }}>
            <Stack component="form" onSubmit={onCreate} spacing={2.5}>
              <TextField
                autoFocus
                fullWidth
                label="chore title"
                placeholder="drink 3 glasses of water"
                value={newChoreTitle}
                onChange={(event) => onTitleChange(event.target.value)}
                required
              />
              <Stack direction="row" spacing={1}>
                <Button type="submit" variant="contained" color="primary" disabled={!newChoreTitle.trim()}>
                  save
                </Button>
                <Button variant="text" color="inherit" onClick={onCancelCreate}>
                  cancel
                </Button>
              </Stack>
            </Stack>
          </ListItem>
        ) : null}
      </List>
      {chores.length === 0 && !isCreating ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          no chores yet. tap + to add one.
        </Typography>
      ) : null}
    </Box>
  )
}
