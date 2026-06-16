# Play Store marketing assets

Screenshot editor scaffolded with [ParthJadhav/app-store-screenshots](https://github.com/ParthJadhav/app-store-screenshots).

## Quick start

```bash
cd play-store-assets
pnpm install   # first time only
pnpm dev       # → http://localhost:3000
```

1. Open the editor in your browser.
2. Confirm **Android Phone** is selected (toolbar).
3. Tweak headlines, layouts, and screenshots in the inspector.
4. Click **Export bundle** for 1080×1920 phone PNGs.
5. Switch device to **Feature Graphic** and export again for the 1024×500 banner.

## Source screenshots

Canonical captures live in the repo root at `app-assets/` (iPhone XR viewport from `localhost:5174`). They are copied into `public/screenshots/android/phone/en/` as `01`–`06.png`:

| File | Screen |
|------|--------|
| 01 | Chores |
| 02 | Bets (Mine) |
| 03 | Rank |
| 04 | Rewards |
| 05–06 | Reused Rank / Rewards for extra slides |

After updating `app-assets/`, re-copy into `public/screenshots/android/phone/en/` or use the editor drop target. Project state is saved in `app-store-screenshots.json`.

## Play Store sizes exported

| Asset | Resolution |
|-------|------------|
| Phone portrait | 1080 × 1920 |
| Feature graphic | 1024 × 500 |

Tablet decks are available in the device switcher if you need 7" / 10" assets later.
