import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  
}

// Firebase configuration (you can use this firebase key so we can use the same firebase database)
// EXPO_PUBLIC_FIREBASE_API_KEY="AIzaSyBVVZTzrGZ3i1duA2gEk189gVm4X6mBq_8"
// EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN= "mobile-project-studentplanner.firebaseapp.com"
// EXPO_PUBLIC_FIREBASE_PROJECT_ID= "mobile-project-studentplanner"
// EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET= "mobile-project-studentplanner.firebasestorage.app"
// EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID= "660254105014"
// EXPO_PUBLIC_FIREBASE_APP_ID= "1:660254105014:web:4e11418dfbf30731223517"

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);