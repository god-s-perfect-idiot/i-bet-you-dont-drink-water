import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import dayjs from 'dayjs'
import AddIcon from '@mui/icons-material/Add'
import { Alert, Box, Button, Container, IconButton, Stack, TextField, Typography } from '@mui/material'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from './firebase'
import {
  completeTodo,
  createTodo,
  ensureUserProfile,
  getRandomCandidate,
  placeBet,
  purchaseStoreItem,
  settleExpiredChores,
  subscribeLeaderboard,
  subscribeMyBets,
  subscribePopularChores,
  subscribeProfile,
  subscribeTodos,
  updateUserHandle,
} from './firestore'
import type { Bet, BetSide, Chore, LeaderboardEntry, UserProfile } from './types'
import { AuthPanel } from './components/auth/AuthPanel'
import { LoadingScreen } from './components/auth/LoadingScreen'
import { TopBar } from './components/layout/TopBar'
import { BottomNav } from './components/layout/BottomNav'
import { MetroPageHeader } from './components/metro/MetroPageHeader'
import { MetroPivot } from './components/metro/MetroPivot'
import { MyChoresPanel } from './components/todos/MyChoresPanel'
import { RandomBetPanel } from './components/bets/RandomBetPanel'
import { PopularChoresPanel } from './components/bets/PopularChoresPanel'
import { MyBetsPanel } from './components/bets/MyBetsPanel'
import { LeaderboardPanel } from './components/leaderboard/LeaderboardPanel'
import { StorePanel } from './components/store/StorePanel'
import { metroBottomInset, sectionStackSx } from './theme/metroStyles'

const stakeOptions = [50, 100, 250, 500]

const pageTitles = ['chores', 'bets', 'rank', 'store', 'me'] as const

function App() {
  const [activeNav, setActiveNav] = useState(0)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [handle, setHandle] = useState('')
  const [authReady, setAuthReady] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [todos, setTodos] = useState<Chore[]>([])
  const [popularChores, setPopularChores] = useState<Chore[]>([])
  const [myBets, setMyBets] = useState<Bet[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [candidate, setCandidate] = useState<Chore | null>(null)
  const [isCreatingChore, setIsCreatingChore] = useState(false)
  const [todoTitle, setTodoTitle] = useState('')
  const [stake, setStake] = useState(100)
  const [betsTab, setBetsTab] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [accountName, setAccountName] = useState('')

  useEffect(
    () =>
      onAuthStateChanged(auth, (firebaseUser) => {
        setUserId(firebaseUser?.uid ?? null)
        setAuthReady(true)
      }),
    [],
  )

  useEffect(() => {
    if (!userId) {
      return undefined
    }
    void settleExpiredChores()
    const unsubscribers = [
      subscribeProfile(userId, setProfile),
      subscribeTodos(userId, setTodos),
      subscribePopularChores(setPopularChores),
      subscribeMyBets(userId, setMyBets),
      subscribeLeaderboard(setLeaderboard),
    ]
    void loadCandidate(userId)
    return () => {
      unsubscribers.forEach((cancel) => cancel())
    }
  }, [userId])

  useEffect(() => {
    setAccountName(profile?.handle ?? '')
  }, [profile?.handle])

  const userRank = useMemo(() => leaderboard.findIndex((row) => row.id === userId) + 1, [leaderboard, userId])

  async function loadCandidate(uid: string): Promise<void> {
    const next = await getRandomCandidate(uid)
    setCandidate(next)
  }

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setMessage(null)
    try {
      if (authMode === 'signup') {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await ensureUserProfile(result.user.uid, handle.trim() || `Player-${result.user.uid.slice(0, 4)}`)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Authentication failed')
    }
  }

  async function onCreateTodo(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (!userId) return
    await createTodo(userId, todoTitle, dayjs().add(2, 'hour').toISOString())
    setTodoTitle('')
    setIsCreatingChore(false)
  }

  async function onPlaceBet(side: BetSide, selected: Chore): Promise<void> {
    if (!userId) return
    try {
      await placeBet(userId, selected, side, stake)
      await loadCandidate(userId)
      setMessage('Bet placed successfully.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not place bet')
    }
  }

  async function onBuyStoreItem(productId: string, title: string): Promise<void> {
    if (!userId) return
    setMessage(null)
    try {
      await purchaseStoreItem(userId, productId)
      setMessage(`You bought ${title}. Enjoy!`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not complete purchase')
    }
  }

  async function onSaveAccountName(): Promise<void> {
    if (!userId) return
    setMessage(null)
    try {
      await updateUserHandle(userId, accountName)
      setMessage('User name updated.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not update user name')
    }
  }

  if (!authReady) {
    return <LoadingScreen />
  }

  if (!userId) {
    return (
      <AuthPanel
        authMode={authMode}
        email={email}
        password={password}
        handle={handle}
        message={message}
        onModeChange={setAuthMode}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onHandleChange={setHandle}
        onSubmit={handleAuthSubmit}
      />
    )
  }

  return (
    <Box sx={{ pb: `calc(${metroBottomInset} + 12px)` }}>
      <TopBar profile={profile} />

      <Container maxWidth="sm" disableGutters sx={{ px: 1.5, py: 1 }}>
        <MetroPageHeader
          title={pageTitles[activeNav]}
          subtitle={
            activeNav === 0
              ? `${todos.length} active`
              : activeNav === 1
                ? 'place your stakes'
                : activeNav === 2
                  ? userRank > 0
                    ? `you are #${userRank}`
                    : 'climb the board'
                  : activeNav === 3
                    ? `$${(profile?.balance ?? 0).toLocaleString()} to spend`
                    : profile?.handle ?? 'player'
          }
          action={
            activeNav === 0 && !isCreatingChore ? (
              <IconButton
                color="primary"
                aria-label="Add chore"
                onClick={() => setIsCreatingChore(true)}
                sx={{
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: 0,
                  width: 48,
                  height: 48,
                }}
              >
                <AddIcon />
              </IconButton>
            ) : undefined
          }
        />

        {message ? (
          <Alert severity="info" sx={{ mb: 2 }} onClose={() => setMessage(null)}>
            {message}
          </Alert>
        ) : null}

        {activeNav === 0 && (
          <Stack spacing={0} sx={sectionStackSx}>
            <MyChoresPanel
              chores={todos}
              onComplete={(choreId) => void completeTodo(userId, choreId)}
              isCreating={isCreatingChore}
              newChoreTitle={todoTitle}
              onTitleChange={setTodoTitle}
              onCreate={onCreateTodo}
              onCancelCreate={() => {
                setIsCreatingChore(false)
                setTodoTitle('')
              }}
            />
          </Stack>
        )}

        {activeNav === 1 && (
          <Stack spacing={0} sx={sectionStackSx}>
            <MetroPivot
              value={betsTab}
              labels={['quick', 'popular', 'mine']}
              onChange={setBetsTab}
              aria-label="Bets sections"
            />

            {betsTab === 0 && (
              <RandomBetPanel
                candidate={candidate}
                stakeOptions={stakeOptions}
                stake={stake}
                onStakeChange={setStake}
                onBet={onPlaceBet}
                onSkip={async () => loadCandidate(userId)}
              />
            )}
            {betsTab === 1 && <PopularChoresPanel chores={popularChores} onBet={onPlaceBet} />}
            {betsTab === 2 && <MyBetsPanel bets={myBets} />}
          </Stack>
        )}

        {activeNav === 2 && (
          <Stack sx={sectionStackSx}>
            <LeaderboardPanel leaderboard={leaderboard} userRank={userRank} />
          </Stack>
        )}

        {activeNav === 3 && (
          <Stack sx={sectionStackSx}>
            <StorePanel balance={profile?.balance ?? 0} onBuy={onBuyStoreItem} />
          </Stack>
        )}

        {activeNav === 4 && (
          <Stack sx={sectionStackSx} spacing={2}>
            <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                signed in as
              </Typography>
              <Typography variant="subtitle1">{profile?.handle ?? 'player'}</Typography>
            </Box>

            <TextField
              label="display name"
              value={accountName}
              onChange={(event) => setAccountName(event.target.value)}
              fullWidth
            />

            <Stack direction="row" spacing={1}>
              <Button variant="contained" color="primary" onClick={() => void onSaveAccountName()} sx={{ flex: 1 }}>
                save
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setAccountName(profile?.handle ?? '')}
                sx={{ flex: 1, borderColor: 'divider' }}
              >
                reset
              </Button>
            </Stack>

            <Button variant="text" color="error" onClick={() => signOut(auth)} sx={{ alignSelf: 'flex-start' }}>
              sign out
            </Button>
          </Stack>
        )}
      </Container>

      <BottomNav value={activeNav} onChange={setActiveNav} />
    </Box>
  )
}

export default App
