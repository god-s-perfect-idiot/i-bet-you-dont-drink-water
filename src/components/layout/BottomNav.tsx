import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import CasinoOutlinedIcon from '@mui/icons-material/CasinoOutlined'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import CasinoIcon from '@mui/icons-material/Casino'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import PersonIcon from '@mui/icons-material/Person'
import { iosFrostedBarSx } from '../../theme/iosStyles'

interface BottomNavProps {
  value: number
  onChange: (value: number) => void
}

const navItems = [
  { label: 'Chores', outline: <TaskAltOutlinedIcon />, filled: <TaskAltIcon /> },
  { label: 'Bets', outline: <CasinoOutlinedIcon />, filled: <CasinoIcon /> },
  { label: 'Rank', outline: <EmojiEventsOutlinedIcon />, filled: <EmojiEventsIcon /> },
  { label: 'Rewards', outline: <CardGiftcardOutlinedIcon />, filled: <CardGiftcardIcon /> },
  { label: 'Me', outline: <PersonOutlineOutlinedIcon />, filled: <PersonIcon /> },
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
        ...iosFrostedBarSx,
        borderTop: '0.5px solid',
        pb: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <BottomNavigation showLabels value={value} onChange={(_, next) => onChange(next)}>
        {navItems.map((item, index) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={value === index ? item.filled : item.outline}
          />
        ))}
      </BottomNavigation>
    </Paper>
  )
}
