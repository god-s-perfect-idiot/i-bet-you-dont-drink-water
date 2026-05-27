# I Bet You Dont Drink Water

PWA-first chores + betting game for web and Android install (Chrome Add to Home Screen).

## Stack

- React + TypeScript + Vite
- Material 3 UI (`@mui/material`)
- Firebase Auth + Firestore (chosen as cheapest starter option via Firebase Spark free tier)
- Manual PWA setup (`manifest.webmanifest` + `sw.js`)

## MVP Features

- User signup/signin (new users seeded with 10,000 fake currency)
- Todo/Chore list with expiry and completion timestamp
- Bets tab with:
  - random chore candidate expiring in next 24h (anonymous owner)
  - popular chores by biggest pool
  - user's current and settled bets
- Leaderboard tab:
  - top 20 users by net worth
  - current user rank when in top 20
- Deadline-based settlement:
  - complete before expiry => `complete` bets win
  - not complete in time => `fail` bets win
  - parimutuel payout from losing pool

## Environment

Copy `.env.example` to `.env` and fill with your Firebase project values.

## Run

```bash
npm install
npm run dev
```

## Firestore Collections

- `users`
- `chores`
- `bets`
- `walletLedger`

## Notes

- Settlement currently runs client-triggered on app load (`settleExpiredChores`). For production, move this to Cloud Functions scheduled jobs.
- Basic security rules are included in `firestore.rules` and should be tightened further before launch.
