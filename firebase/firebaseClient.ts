// firebase/firebaseClient.ts
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

let authInstance: Auth;
let dbInstance: Firestore;

if (typeof window !== "undefined") {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
} else {
  // Server/SSR build: export placeholders to avoid initializing Firebase
  authInstance = undefined as unknown as Auth;
  dbInstance = undefined as unknown as Firestore;
}

export const auth = authInstance;
export const db = dbInstance;
