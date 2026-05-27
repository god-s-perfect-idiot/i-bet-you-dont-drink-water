import dayjs from 'dayjs'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import { Box, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material'
import type { Chore } from '../../types'
import { IOSGroupedSection } from '../ios/IOSGroupedSection'
import { iosListCellSx } from '../../theme/iosStyles'

interface MyChoresPanelProps {
  chores: Chore[]
  onComplete: (choreId: string) => void
}

export function MyChoresPanel({ chores, onComplete }: MyChoresPanelProps) {
  return (
    <IOSGroupedSection
      title="Active Chores"
      footer={chores.length === 0 ? 'Tap + to add your first chore.' : `${chores.length} open · expires in 2 hours`}
    >
      {chores.length === 0 ? (
        <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No chores yet
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {chores.map((todo) => (
            <ListItem
              key={todo.id}
              sx={iosListCellSx}
              secondaryAction={
                todo.status === 'open' ? (
                  <IconButton
                    edge="end"
                    aria-label="Mark complete"
                    onClick={() => onComplete(todo.id)}
                    sx={{ color: 'success.main' }}
                  >
                    <CheckCircleOutlinedIcon />
                  </IconButton>
                ) : null
              }
            >
              <ListItemText
                primary={todo.title}
                secondary={dayjs(todo.expiresAt).format('MMM D, h:mm A')}
                slotProps={{
                  primary: { variant: 'body1', sx: { fontWeight: 400 } },
                  secondary: { variant: 'caption', sx: { color: 'text.secondary', textTransform: 'capitalize' } },
                }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </IOSGroupedSection>
  )
}
