import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBte_O2rLWu3fKNHNfNK0jl8nqo60Snpnw",
  authDomain: "carrent-2556e.firebaseapp.com",
  databaseURL: "https://carrent-2556e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "carrent-2556e",
  storageBucket: "carrent-2556e.firebasestorage.app",
  messagingSenderId: "603882535805",
  appId: "1:603882535805:web:3f7c050c197bbfb2e02a14",
  measurementId: "G-VC40WHPD85"
};

// Prevent duplicate initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Prevent duplicate auth initialization
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (e) {
  auth = getAuth(app);
}

const database = getDatabase(app);
const storage = getStorage(app);

export { auth, database, storage };