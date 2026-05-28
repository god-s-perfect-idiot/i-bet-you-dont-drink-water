import type { FormEvent } from 'react'
import { Alert, Box, Button, Container, Snackbar, Stack, TextField, Typography } from '@mui/material'
import { IOSSegmentedControl } from '../ios/IOSSegmentedControl'
import { IOSGroupedSection } from '../ios/IOSGroupedSection'
import { iosLargeTitleSx, iosTopInset, paperThemeColors } from '../../theme/iosStyles'

type AuthMode = 'signin' | 'signup'

interface AuthPanelProps {
  authMode: AuthMode
  email: string
  password: string
  handle: string
  message: string | null
  onModeChange: (mode: AuthMode) => void
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onHandleChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

export function AuthPanel(props: AuthPanelProps) {
  const {
    authMode,
    email,
    password,
    handle,
    message,
    onModeChange,
    onEmailChange,
    onPasswordChange,
    onHandleChange,
    onSubmit,
  } = props

  const pivotIndex = authMode === 'signup' ? 0 : 1

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
      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4, px: 2 }}>
        <Typography component="h1" sx={{ ...iosLargeTitleSx, mb: 1 }}>
          I Bet You Don&apos;t Drink Water
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 3,
            alignSelf: 'flex-start',
            px: 1.25,
            py: 0.5,
            borderRadius: 999,
            border: `2px solid ${paperThemeColors.ink}`,
            bgcolor: '#FFFFFF',
            boxShadow: `2px 2px 0 ${paperThemeColors.ink}`,
          }}
        >
          Chore. Bet. Repeat.
        </Typography>

        <IOSSegmentedControl
          value={pivotIndex}
          labels={['Sign Up', 'Sign In']}
          onChange={(index) => onModeChange(index === 0 ? 'signup' : 'signin')}
          aria-label="Authentication mode"
        />

        <Stack component="form" spacing={2} onSubmit={onSubmit}>
          <IOSGroupedSection>
            <Stack spacing={2} sx={{ p: 2 }}>
              {authMode === 'signup' ? (
                <TextField
                  label="Display name"
                  value={handle}
                  onChange={(event) => onHandleChange(event.target.value)}
                  required
                  fullWidth
                />
              ) : null}
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(event) => onEmailChange(event.target.value)}
                required
                fullWidth
                autoComplete="email"
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                required
                fullWidth
                autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
              />
            </Stack>
          </IOSGroupedSection>

          <Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={{ mt: 0.5 }}>
            {authMode === 'signup' ? 'Create Account · $10,000' : 'Sign In'}
          </Button>
        </Stack>

        <Snackbar open={message !== null} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          {message ? <Alert severity="error">{message}</Alert> : undefined}
        </Snackbar>
      </Container>
    </Box>
  )
}
