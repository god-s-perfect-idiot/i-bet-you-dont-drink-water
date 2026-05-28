import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { paperThemeColors } from '../../theme/iosStyles'

interface IOSSegmentedControlProps {
  value: number
  labels: string[]
  onChange: (index: number) => void
  'aria-label'?: string
}

export function IOSSegmentedControl({ value, labels, onChange, 'aria-label': ariaLabel }: IOSSegmentedControlProps) {
  const tabWidthPercent = 100 / labels.length

  return (
    <Box
      sx={{
        mb: 2.25,
        p: 0.5,
        borderRadius: '14px',
        border: `3px solid ${paperThemeColors.ink}`,
        boxShadow: `4px 4px 0 ${paperThemeColors.ink}`,
        bgcolor: '#F0EDED',
      }}
    >
      <ToggleButtonGroup
        exclusive
        fullWidth
        value={value}
        onChange={(_, next) => {
          if (next !== null) onChange(next as number)
        }}
        aria-label={ariaLabel}
        sx={{
          position: 'relative',
          display: 'flex',
          gap: 0.25,
          p: 0.25,
          '& .MuiToggleButtonGroup-grouped': {
            border: 0,
            borderRadius: '8px !important',
            flex: 1,
            mx: 0,
          },
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: 2,
            left: 2,
            width: `calc(${tabWidthPercent}% - 2px)`,
            height: 'calc(100% - 4px)',
            borderRadius: '10px',
            bgcolor: '#0A84FF',
            border: `2px solid ${paperThemeColors.ink}`,
            boxShadow: `2px 2px 0 ${paperThemeColors.ink}`,
            transform: `translateX(${value * 100}%)`,
            transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
            zIndex: 0,
          }}
        />
        {labels.map((label, index) => (
          <ToggleButton
            key={label}
            value={index}
            disableRipple
            sx={{
              position: 'relative',
              zIndex: 1,
              py: 0.875,
              px: 1.5,
              textTransform: 'uppercase',
              fontWeight: 700,
              fontSize: '0.8125rem',
              color: paperThemeColors.ink,
              borderRadius: '10px',
              transition: 'color 200ms ease, background-color 200ms ease',
              '&.Mui-selected': {
                bgcolor: 'transparent',
                color: '#FFFFFF',
                fontWeight: 700,
                '&:hover': {
                  bgcolor: 'transparent',
                },
              },
              '&:hover': {
                bgcolor: '#EAE7E7',
              },
            }}
          >
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  )
}
