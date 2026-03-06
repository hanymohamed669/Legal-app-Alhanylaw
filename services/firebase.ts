
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// Firebase configuration
// In a real app, these should be in environment variables
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// List of authorized emails for RBAC
// In a real app, this might come from a database or environment variable
export const AUTHORIZED_EMAILS = [
  'hanymohamed669@gmail.com',
  'admin@example.com',
  // Add more authorized emails here
];

export { signInWithPopup, signOut, onAuthStateChanged };
