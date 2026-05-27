import { Box, CircularProgress, Container, Typography } from '@mui/material'
import { metroPageTitleSx } from '../../theme/metroStyles'

export function LoadingScreen() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Box sx={{ height: 4, bgcolor: 'primary.main' }} />
      <Container
        maxWidth="sm"
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 4 }}
      >
        <Typography component="h1" sx={{ ...metroPageTitleSx, mb: 1, alignSelf: 'flex-start' }}>
          i bet you don&apos;t drink water
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 6, alignSelf: 'flex-start' }}>
          chores · stakes · leaderboard
        </Typography>
        <CircularProgress color="primary" size={40} aria-label="Loading" />
      </Container>
    </Box>
  )
}
