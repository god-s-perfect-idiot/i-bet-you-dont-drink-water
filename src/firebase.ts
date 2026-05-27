import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

function readFirebaseEnv(key: string): string {
  const raw = import.meta.env[key]
  const value = typeof raw === 'string' ? raw.trim().replace(/^['"]|['"]$/g, '') : ''
  if (!value) {
    throw new Error(`Missing Firebase config: ${key}`)
  }
  return value
}

const firebaseConfig = {
  apiKey: readFirebaseEnv('VITE_FIREBASE_API_KEY'),
  authDomain: readFirebaseEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: readFirebaseEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: readFirebaseEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: readFirebaseEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: readFirebaseEnv('VITE_FIREBASE_APP_ID'),
}

if (!firebaseConfig.apiKey.startsWith('AIza')) {
  throw new Error('Invalid Firebase config: VITE_FIREBASE_API_KEY does not look like a web API key.')
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
