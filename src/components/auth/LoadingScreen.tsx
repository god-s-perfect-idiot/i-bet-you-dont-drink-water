import { Box, CircularProgress, Container, Typography } from '@mui/material'
import { iosLargeTitleSx, iosTopInset } from '../../theme/iosStyles'

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
        <Typography component="h1" sx={{ ...iosLargeTitleSx, mb: 1, alignSelf: 'flex-start' }}>
          I Bet You Don&apos;t Drink Water
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 6, alignSelf: 'flex-start' }}>
          Chores · stakes · leaderboard
        </Typography>
        <CircularProgress color="primary" size={32} aria-label="Loading" />
      </Container>
    </Box>
  )
}
