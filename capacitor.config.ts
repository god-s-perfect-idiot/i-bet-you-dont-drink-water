import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.eotc.chorebet',
  appName: 'Water Bets',
  webDir: 'dist',
  android: {
    allowMixedContent: true,
  },
}

export default config
