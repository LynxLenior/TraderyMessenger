import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "traderymessenger.firebaseapp.com",
  projectId: "traderymessenger",
  storageBucket: "traderymessenger.firebasestorage.app",
  messagingSenderId: "693590502885",
  appId: "1:693590502885:web:658531b928cc1f40b1930c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()