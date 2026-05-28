import { Box, CircularProgress, Container, Typography } from '@mui/material'
import { iosLargeTitleSx, iosTopInset, paperThemeColors } from '../../theme/iosStyles'

export function LoadingScreen() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        pt: iosTopInset,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
          px: 2,
        }}
      >
        <Typography component="h1" sx={{ ...iosLargeTitleSx, textAlign: 'center' }}>
          Chore. Bet. Repeat.
        </Typography>
        <Box
          sx={{
            mt: 3.5,
            px: 1.5,
            py: 1,
            borderRadius: 999,
            border: `3px solid ${paperThemeColors.ink}`,
            boxShadow: `4px 4px 0 ${paperThemeColors.ink}`,
            bgcolor: '#FFFFFF',
          }}
        >
          <CircularProgress color="primary" size={28} aria-label="Loading" />
        </Box>
      </Container>
    </Box>
  )
}
