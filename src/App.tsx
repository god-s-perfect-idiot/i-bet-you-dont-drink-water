import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import dayjs from 'dayjs'
import AddIcon from '@mui/icons-material/Add'
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from './firebase'
import {
  addRewardToStore,
  completeTodo,
  createReward,
  createTodo,
  ensureUserProfile,
  getRandomCandidate,
  placeBet,
  redeemReward,
  settleExpiredChores,
  settleOpenBetsForUser,
  subscribeLeaderboard,
  subscribeMyBets,
  subscribePopularChores,
  subscribePopularRewards,
  subscribeProfile,
  subscribeTodos,
  subscribeUserRewards,
  updateUserHandle,
} from './firestore'
import type { Bet, BetSide, Chore, LeaderboardEntry, Reward, UserProfile, UserReward } from './types'
import { AuthPanel } from './components/auth/AuthPanel'
import { LoadingScreen } from './components/auth/LoadingScreen'
import { TopBar } from './components/layout/TopBar'
import { BottomNav } from './components/layout/BottomNav'
import { IOSPageHeader } from './components/ios/IOSPageHeader'
import { IOSSegmentedControl } from './components/ios/IOSSegmentedControl'
import { IOSGroupedSection } from './components/ios/IOSGroupedSection'
import { MyChoresPanel } from './components/todos/MyChoresPanel'
import { CreateChorePanel } from './components/todos/CreateChorePanel'
import { RandomBetPanel } from './components/bets/RandomBetPanel'
import { PopularChoresPanel } from './components/bets/PopularChoresPanel'
import { MyBetsPanel } from './components/bets/MyBetsPanel'
import { LeaderboardPanel } from './components/leaderboard/LeaderboardPanel'
import { CreateRewardPanel } from './components/rewards/CreateRewardPanel'
import { RewardsPanel } from './components/rewards/RewardsPanel'
import { debugLog } from './debugLog'
import { iosBottomInset, sectionStackSx } from './theme/iosStyles'

const stakeOptions = [50, 100, 250, 500]

const pageTitles = ['Chores', 'Bets', 'Rank', 'Rewards', 'Profile'] as const

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
  const [todoDueInDays, setTodoDueInDays] = useState('1')
  const [stake, setStake] = useState(100)
  const [betsTab, setBetsTab] = useState(0)
  const [userRewards, setUserRewards] = useState<UserReward[]>([])
  const [popularRewards, setPopularRewards] = useState<Reward[]>([])
  const [isCreatingReward, setIsCreatingReward] = useState(false)
  const [rewardTitle, setRewardTitle] = useState('')
  const [rewardCost, setRewardCost] = useState('500')
  const [message, setMessage] = useState<string | null>(null)
  const [accountName, setAccountName] = useState('')
  const [pendingCompletedChoreIds, setPendingCompletedChoreIds] = useState<Set<string>>(new Set())
  const visibleTodos = useMemo<Chore[]>(
    () =>
      todos.map((todo) =>
        pendingCompletedChoreIds.has(todo.id) && todo.status === 'open'
          ? {
              ...todo,
              status: 'completed' as const,
              completedAt: todo.completedAt ?? new Date().toISOString(),
            }
          : todo,
      ),
    [todos, pendingCompletedChoreIds],
  )
  const activeChoresCount = useMemo(() => visibleTodos.filter((todo) => todo.status === 'open').length, [visibleTodos])
  const myBetChoreIds = useMemo(() => new Set(myBets.map((bet) => bet.choreId)), [myBets])

  useEffect(() => {
    debugLog('app', 'build marker 2026-05-28-fix-open-chore-settlement-v2')
  }, [])

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
    debugLog('settle', 'auth bootstrap settle start', { userId })
    const initialExpiredSettle = settleExpiredChores()
    void initialExpiredSettle
      .then(() => {
        debugLog('settle', 'initial settleExpiredChores finished', { userId })
      })
      .catch((error) => {
        debugLog('settle', 'initial settleExpiredChores failed', {
          userId,
          error: error instanceof Error ? error.message : String(error),
        })
      })
    const initialOpenBetsSettle = settleOpenBetsForUser(userId)
    void initialOpenBetsSettle
      .then(() => {
        debugLog('settle', 'initial settleOpenBetsForUser finished', { userId })
      })
      .catch((error) => {
        debugLog('settle', 'initial settleOpenBetsForUser failed', {
          userId,
          error: error instanceof Error ? error.message : String(error),
        })
      })
    const settleInterval = setInterval(() => {
      debugLog('settle', 'interval settle tick start', { userId })
      const intervalExpiredSettle = settleExpiredChores()
      void intervalExpiredSettle
        .then(() => {
          debugLog('settle', 'interval settleExpiredChores finished', { userId })
        })
        .catch((error) => {
          debugLog('settle', 'interval settleExpiredChores failed', {
            userId,
            error: error instanceof Error ? error.message : String(error),
          })
        })
      const intervalOpenBetsSettle = settleOpenBetsForUser(userId)
      void intervalOpenBetsSettle
        .then(() => {
          debugLog('settle', 'interval settleOpenBetsForUser finished', { userId })
        })
        .catch((error) => {
          debugLog('settle', 'interval settleOpenBetsForUser failed', {
            userId,
            error: error instanceof Error ? error.message : String(error),
          })
        })
    }, 60_000)
    const unsubscribers = [
      subscribeProfile(userId, setProfile),
      subscribeTodos(userId, setTodos),
      subscribePopularChores(setPopularChores),
      subscribeMyBets(userId, setMyBets),
      subscribeLeaderboard(setLeaderboard),
      subscribeUserRewards(userId, setUserRewards),
      subscribePopularRewards(setPopularRewards),
    ]
    void loadCandidate(userId)
    return () => {
      debugLog('settle', 'auth bootstrap cleanup', { userId })
      clearInterval(settleInterval)
      unsubscribers.forEach((cancel) => cancel())
    }
  }, [userId])

  useEffect(() => {
    queueMicrotask(() => {
      setAccountName(profile?.handle ?? '')
    })
  }, [profile?.handle])

  useEffect(() => {
    if (pendingCompletedChoreIds.size === 0) {
      return
    }
    setPendingCompletedChoreIds((previous) => {
      const remaining = new Set(previous)
      for (const chore of todos) {
        if (chore.status === 'completed') {
          remaining.delete(chore.id)
        }
      }
      return remaining.size === previous.size ? previous : remaining
    })
  }, [todos, pendingCompletedChoreIds.size])

  useEffect(() => {
    if (!userId || activeNav !== 1 || betsTab !== 0) {
      return
    }
    void loadCandidate(userId)
  }, [activeNav, betsTab, userId])

  const userRank = useMemo(() => leaderboard.findIndex((row) => row.id === userId) + 1, [leaderboard, userId])

  async function loadCandidate(uid: string): Promise<void> {
    debugLog('app', 'loadCandidate start', { uid })
    const next = await getRandomCandidate(uid)
    setCandidate(next)
    debugLog('app', 'loadCandidate done', {
      uid,
      candidateId: next?.id ?? null,
      candidateStatus: next?.status ?? null,
      candidateExpiresAt: next?.expiresAt ?? null,
      candidateSettledAt: next?.settledAt ?? null,
    })
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
    const dueInDays = Number.parseInt(todoDueInDays, 10)
    if (!Number.isFinite(dueInDays) || dueInDays < 1) {
      setMessage('Please enter a valid due time in days.')
      return
    }
    await createTodo(userId, todoTitle, dayjs().add(dueInDays, 'day').toISOString())
    setTodoTitle('')
    setTodoDueInDays('1')
    setIsCreatingChore(false)
  }

  async function onPlaceBet(side: BetSide, selected: Chore): Promise<void> {
    if (!userId) return
    if (selected.ownerUserId === userId) {
      setMessage('You cannot bet on your own chore.')
      return
    }
    if (myBetChoreIds.has(selected.id)) {
      setMessage('You already placed a bet on this chore.')
      return
    }
    try {
      debugLog('app', 'onPlaceBet start', {
        userId,
        choreId: selected.id,
        choreStatus: selected.status,
        side,
        stake,
      })
      await placeBet(userId, selected, side, stake)
      await loadCandidate(userId)
      setMessage('Bet placed successfully.')
      debugLog('app', 'onPlaceBet done', { userId, choreId: selected.id, side, stake })
    } catch (error) {
      debugLog('app', 'onPlaceBet failed', {
        userId,
        choreId: selected.id,
        error: error instanceof Error ? error.message : String(error),
      })
      setMessage(error instanceof Error ? error.message : 'Could not place bet')
    }
  }

  async function onCreateReward(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (!userId) return
    setMessage(null)
    try {
      await createReward(userId, rewardTitle, Number(rewardCost))
      setRewardTitle('')
      setRewardCost('500')
      setIsCreatingReward(false)
      setMessage('Reward created and added to your store.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not create reward')
    }
  }

  async function onAddRewardToStore(reward: Reward): Promise<void> {
    if (!userId) return
    setMessage(null)
    try {
      await addRewardToStore(userId, reward)
      setMessage('Reward added to your store.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not add reward')
    }
  }

  async function onRedeemReward(userReward: UserReward): Promise<void> {
    if (!userId) return
    setMessage(null)
    try {
      await redeemReward(userId, userReward)
      setMessage(`Redeemed "${userReward.title}" for ${userReward.cost.toLocaleString()} coins.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not redeem reward')
    }
  }

  async function onSaveAccountName(): Promise<void> {
    if (!userId) return
    setMessage(null)
    try {
      await updateUserHandle(userId, accountName)
      setMessage('Display name updated.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not update display name')
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
    <Box sx={{ pb: `calc(${iosBottomInset} + 18px)`, minHeight: '100vh', bgcolor: 'background.default' }}>
      <TopBar profile={profile} />

      <Container maxWidth="sm" disableGutters sx={{ px: 2.5, py: 1.75 }}>
        <IOSPageHeader
          title={pageTitles[activeNav]}
          subtitle={
            activeNav === 0
              ? `${activeChoresCount} active`
              : activeNav === 1
                ? 'Place your stakes'
                : activeNav === 2
                  ? userRank > 0
                    ? `You're #${userRank}`
                    : 'Climb the board'
                  : activeNav === 3
                    ? 'Spend coins on real-world perks'
                    : activeNav === 4
                      ? profile?.handle ?? 'Player'
                      : undefined
          }
          action={
            activeNav === 0 || activeNav === 3 ? (
              <IconButton
                color="primary"
                aria-label={activeNav === 0 ? 'Add chore' : 'Add reward'}
                onClick={() => (activeNav === 0 ? setIsCreatingChore(true) : setIsCreatingReward(true))}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  width: 42,
                  height: 42,
                  borderRadius: 999,
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            ) : undefined
          }
        />

        {activeNav === 0 && (
          <Stack spacing={0} sx={sectionStackSx}>
            <MyChoresPanel
              chores={visibleTodos}
              onComplete={async (choreId) => {
                const target = todos.find((todo) => todo.id === choreId)
                debugLog('app', 'onComplete chore clicked', {
                  userId,
                  choreId,
                  targetStatus: target?.status,
                  expiresAt: target?.expiresAt,
                  settledAt: target?.settledAt,
                })
                if (!target || target.status !== 'open') {
                  debugLog('app', 'onComplete ignored (not open)', { choreId, targetStatus: target?.status })
                  return
                }
                setPendingCompletedChoreIds((previous) => {
                  const next = new Set(previous)
                  next.add(choreId)
                  return next
                })
                try {
                  await completeTodo(userId, choreId)
                  setMessage('Chore completed. +50 coins earned.')
                  debugLog('app', 'onComplete success', { userId, choreId })
                } catch (error) {
                  setPendingCompletedChoreIds((previous) => {
                    const next = new Set(previous)
                    next.delete(choreId)
                    return next
                  })
                  debugLog('app', 'onComplete failed', {
                    userId,
                    choreId,
                    error: error instanceof Error ? error.message : String(error),
                  })
                  setMessage(error instanceof Error ? error.message : 'Could not complete chore')
                }
              }}
            />
          </Stack>
        )}

        {activeNav === 1 && (
          <Stack spacing={0} sx={sectionStackSx}>
            <IOSSegmentedControl
              value={betsTab}
              labels={['Quick', 'Popular', 'Mine']}
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
            {betsTab === 1 && (
              <PopularChoresPanel userId={userId} chores={popularChores} myBetChoreIds={myBetChoreIds} onBet={onPlaceBet} />
            )}
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
            <RewardsPanel
              userId={userId}
              balance={profile?.balance ?? 0}
              userRewards={userRewards}
              popularRewards={popularRewards}
              onRedeem={onRedeemReward}
              onAddToStore={onAddRewardToStore}
            />
          </Stack>
        )}

        {activeNav === 4 && (
          <Stack sx={sectionStackSx} spacing={0}>
            <IOSGroupedSection title="Account">
              <Box sx={{ px: 2, py: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Signed in as
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile?.handle ?? 'Player'}
                </Typography>
              </Box>
            </IOSGroupedSection>

            <IOSGroupedSection title="Display Name" footer="This name appears on the leaderboard.">
              <Box sx={{ px: 2, py: 1.5 }}>
                <TextField
                  placeholder="Your name"
                  value={accountName}
                  onChange={(event) => setAccountName(event.target.value)}
                  fullWidth
                  hiddenLabel
                />
              </Box>
            </IOSGroupedSection>

            <Box sx={{ px: 2, py: 1 }}>
              <Button variant="contained" color="primary" fullWidth onClick={() => void onSaveAccountName()}>
                Save Changes
              </Button>
            </Box>

            <Box sx={{ px: 2, pt: 1 }}>
              <Button variant="text" color="error" fullWidth onClick={() => signOut(auth)}>
                Sign Out
              </Button>
            </Box>
          </Stack>
        )}
      </Container>

      <CreateChorePanel
        open={isCreatingChore}
        title={todoTitle}
        dueInDays={todoDueInDays}
        onClose={() => {
          setIsCreatingChore(false)
          setTodoTitle('')
          setTodoDueInDays('1')
        }}
        onTitleChange={setTodoTitle}
        onDueInDaysChange={setTodoDueInDays}
        onSubmit={onCreateTodo}
      />

      <CreateRewardPanel
        open={isCreatingReward}
        title={rewardTitle}
        cost={rewardCost}
        onClose={() => {
          setIsCreatingReward(false)
          setRewardTitle('')
          setRewardCost('500')
        }}
        onTitleChange={setRewardTitle}
        onCostChange={setRewardCost}
        onSubmit={onCreateReward}
      />

      <Snackbar
        open={message !== null}
        autoHideDuration={3500}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {message ? (
          <Alert severity="info" onClose={() => setMessage(null)} sx={{ width: '100%', maxWidth: 360 }}>
            {message}
          </Alert>
        ) : undefined}
      </Snackbar>

      <BottomNav value={activeNav} onChange={setActiveNav} />
    </Box>
  )
}

export default App
