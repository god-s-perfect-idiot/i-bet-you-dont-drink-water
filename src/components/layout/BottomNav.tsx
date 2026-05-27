import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import TaskIcon from '@mui/icons-material/Task'
import CasinoIcon from '@mui/icons-material/Casino'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import StorefrontIcon from '@mui/icons-material/Storefront'
import PersonIcon from '@mui/icons-material/Person'

interface BottomNavProps {
  value: number
  onChange: (value: number) => void
}

const navItems = [
  { label: 'chores', icon: <TaskIcon /> },
  { label: 'bets', icon: <CasinoIcon /> },
  { label: 'rank', icon: <EmojiEventsIcon /> },
  { label: 'store', icon: <StorefrontIcon /> },
  { label: 'me', icon: <PersonIcon /> },
] as const

export function BottomNav({ value, onChange }: BottomNavProps) {
  return (
    <Paper
      square
      elevation={0}
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        bgcolor: 'background.default',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <BottomNavigation showLabels value={value} onChange={(_, next) => onChange(next)}>
        {navItems.map((item) => (
          <BottomNavigationAction key={item.label} label={item.label} icon={item.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  )
}
