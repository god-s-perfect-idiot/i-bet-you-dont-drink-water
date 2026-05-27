import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material'

interface IOSSegmentedControlProps {
  value: number
  labels: string[]
  onChange: (index: number) => void
  'aria-label'?: string
}

export function IOSSegmentedControl({ value, labels, onChange, 'aria-label': ariaLabel }: IOSSegmentedControlProps) {
  return (
    <Box
      sx={{
        mb: 2,
        p: 0.375,
        borderRadius: '10px',
        bgcolor: '#3A3A3C',
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
          display: 'flex',
          gap: 0.25,
          '& .MuiToggleButtonGroup-grouped': {
            border: 0,
            borderRadius: '8px !important',
            flex: 1,
            mx: 0,
          },
        }}
      >
        {labels.map((label, index) => (
          <ToggleButton
            key={label}
            value={index}
            disableRipple
            sx={{
              py: 0.875,
              px: 1.5,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.8125rem',
              color: '#FFFFFF',
              borderRadius: '8px',
              '&.Mui-selected': {
                bgcolor: '#636366',
                color: '#FFFFFF',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#636366',
                },
              },
              '&:hover': {
                bgcolor: 'transparent',
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
