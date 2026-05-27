import type { FormEvent } from 'react'
import { Alert, Box, Button, Container, Stack, TextField, Typography } from '@mui/material'
import { MetroPivot } from '../metro/MetroPivot'
import { metroPageTitleSx } from '../../theme/metroStyles'

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
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Box sx={{ height: 4, bgcolor: 'primary.main' }} />
      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4 }}>
        <Typography component="h1" sx={{ ...metroPageTitleSx, mb: 1 }}>
          i bet you don&apos;t drink water
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          chores · stakes · leaderboard
        </Typography>

        <MetroPivot
          value={pivotIndex}
          labels={['new account', 'sign in']}
          onChange={(index) => onModeChange(index === 0 ? 'signup' : 'signin')}
          aria-label="Authentication mode"
        />

        <Stack component="form" spacing={3} onSubmit={onSubmit}>
          {authMode === 'signup' ? (
            <TextField
              label="display name"
              value={handle}
              onChange={(event) => onHandleChange(event.target.value)}
              required
              fullWidth
            />
          ) : null}
          <TextField
            label="email"
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label="password"
            type="password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
            {authMode === 'signup' ? 'create account · 10,000' : 'sign in'}
          </Button>
        </Stack>

        {message ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {message}
          </Alert>
        ) : null}
      </Container>
    </Box>
  )
}
