import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "tradery-messenger-5e90e.firebaseapp.com",
    projectId: "tradery-messenger-5e90e",
    storageBucket: "tradery-messenger-5e90e.firebasestorage.app",
    messagingSenderId: "19382326863",
    appId: "1:19382326863:web:fff4f5b0813885b44d7c3a",
  };
  

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()