import dayjs from 'dayjs'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import {
  Box,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { TransitionGroup } from 'react-transition-group'
import type { Chore } from '../../types'
import { IOSGroupedSection } from '../ios/IOSGroupedSection'
import { iosListCellSx, paperThemeColors } from '../../theme/iosStyles'

interface MyChoresPanelProps {
  chores: Chore[]
  onComplete: (choreId: string) => void
}

export function MyChoresPanel({ chores, onComplete }: MyChoresPanelProps) {
  const activeChores = chores.filter((todo) => todo.status === 'open')
  const completedChores = chores.filter((todo) => todo.status === 'completed')
  const completeColor = '#16a34a'
  const failColor = '#D32F2F'

  return (
    <Stack spacing={0}>
      <IOSGroupedSection
        title="Active Chores"
        bare={activeChores.length === 0}
        footer={
          activeChores.length === 0
            ? 'All done. Create another chore to keep the streak alive.'
            : `${activeChores.length} open · complete one for +50 coins`
        }
      >
        {activeChores.length === 0 ? (
          <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No active chores
            </Typography>
          </Box>
        ) : (
          <TransitionGroup component={List} style={{ padding: 0 }}>
            {activeChores.map((todo) => (
              <Collapse key={todo.id} timeout={300}>
                <ListItem
                  sx={{ ...iosListCellSx, alignItems: 'flex-start' }}
                >
                  {(() => {
                    const totalPool = todo.totalPool
                    const completePercent = totalPool > 0 ? Math.round((todo.totalOnComplete / totalPool) * 100) : 50
                    return (
                      <Stack direction="row" spacing={1.25} sx={{ width: '100%' }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <ListItemText
                            primary={
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {todo.title}
                                </Typography>
                                <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 0.5 }}>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: 'text.secondary', textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                                  >
                                    {dayjs(todo.expiresAt).format('MMM D, h:mm A')}
                                  </Typography>
                                  {totalPool > 0 ? (
                                    <Box
                                      sx={{
                                        flex: 1,
                                        minWidth: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        pl: 0.5,
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          position: 'relative',
                                          width: '100%',
                                          maxWidth: 112,
                                          height: 9,
                                          borderRadius: 999,
                                          overflow: 'hidden',
                                          border: `2px solid ${paperThemeColors.ink}`,
                                          bgcolor: failColor,
                                          boxShadow: `2px 2px 0 ${paperThemeColors.ink}`,
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            height: '100%',
                                            width: `${completePercent}%`,
                                            bgcolor: completeColor,
                                            transition: 'width 250ms ease',
                                          }}
                                        />
                                      </Box>
                                    </Box>
                                  ) : null}
                                </Stack>
                              </Box>
                            }
                            slotProps={{
                              primary: { component: 'div' },
                            }}
                          />
                        </Box>
                        <Button
                          aria-label="Mark complete"
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckCircleOutlinedIcon fontSize="small" />}
                          onClick={() => onComplete(todo.id)}
                          sx={{ flexShrink: 0, alignSelf: 'center', borderRadius: 999, px: 1.25 }}
                        >
                          +50
                        </Button>
                      </Stack>
                    )
                  })()}
                </ListItem>
              </Collapse>
            ))}
          </TransitionGroup>
        )}
      </IOSGroupedSection>

      <Collapse in={completedChores.length > 0} timeout={350} unmountOnExit>
        <IOSGroupedSection title="Past chores" bare>
          <TransitionGroup component={List} style={{ padding: 0 }}>
            {completedChores.map((todo) => {
              const expiredAfterDueDate =
                todo.completedAt !== null && dayjs(todo.completedAt).isAfter(dayjs(todo.expiresAt))
              const strikeColor = expiredAfterDueDate ? 'error.main' : 'text.primary'
              return (
                <Collapse key={todo.id} timeout={350}>
                  <ListItem
                    sx={{
                      px: 2,
                      py: 0.375,
                      minHeight: 0,
                      alignItems: 'center',
                      '&:not(:last-child)': {
                        borderBottom: '0.5px solid',
                        borderColor: 'divider',
                      },
                      '& .MuiListItemText-primary': {
                        color: strikeColor,
                        textDecoration: 'line-through',
                      },
                    }}
                  >
                    <ListItemText
                      primary={todo.title}
                      slotProps={{
                        primary: { variant: 'body2', sx: { fontWeight: 400, lineHeight: 1.35 } },
                      }}
                    />
                  </ListItem>
                </Collapse>
              )
            })}
          </TransitionGroup>
        </IOSGroupedSection>
      </Collapse>
    </Stack>
  )
}
