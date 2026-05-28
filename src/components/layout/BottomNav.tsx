import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material'
import { alpha } from '@mui/material/styles'
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
import { iosTabBarSx, paperThemeColors } from '../../theme/iosStyles'

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

const navHighlightColors = [
  paperThemeColors.yellow,
  paperThemeColors.blue,
  '#FF8A00',
  '#8B5CF6',
  '#26A69A',
] as const

export function BottomNav({ value, onChange }: BottomNavProps) {
  const tabCount = navItems.length
  const activeIndex = Math.max(0, Math.min(value, tabCount - 1))
  const activeColor = navHighlightColors[activeIndex]

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 18px)',
        maxWidth: 500,
        bottom: 8,
        zIndex: (theme) => theme.zIndex.appBar,
        ...iosTabBarSx,
        border: `3px solid ${paperThemeColors.ink}`,
        borderRadius: '16px',
        pb: 'calc(env(safe-area-inset-bottom, 0px) + 2px)',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            left: 4,
            top: 4,
            width: `calc((100% - 8px) / ${tabCount})`,
            height: 'calc(100% - 8px)',
            borderRadius: '10px',
            bgcolor: alpha(activeColor, 0.4),
            border: `2px solid ${paperThemeColors.ink}`,
            boxShadow: `2px 2px 0 ${paperThemeColors.ink}`,
            pointerEvents: 'none',
            zIndex: 0,
            transform: `translateX(calc(${activeIndex} * 100%)) rotate(${activeIndex % 2 === 0 ? '-2deg' : '2deg'})`,
            transition: 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, next) => onChange(next)}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            px: 0.5,
            py: 0.5,
          }}
        >
          {navItems.map((item, index) => (
            <BottomNavigationAction
              key={item.label}
              value={index}
              label={item.label}
              icon={value === index ? item.filled : item.outline}
              sx={{
                minWidth: 0,
                maxWidth: 'none',
                flex: 1,
                borderRadius: '10px',
                zIndex: 1,
                transition: 'color 180ms ease, transform 120ms ease',
                '& .MuiBottomNavigationAction-label': {
                  mt: 0.25,
                  fontSize: '0.66rem',
                  lineHeight: 1.1,
                },
                '&.Mui-selected': {
                  '& .MuiBottomNavigationAction-label': {
                    fontWeight: 700,
                  },
                },
                '&:active': {
                  transform: 'translate(2px, 2px)',
                },
              }}
            />
          ))}
        </BottomNavigation>
      </Box>
    </Paper>
  )
}
