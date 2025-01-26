import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCblep2F44R6hI9j-q4zh8EWUTms43_OJI",
  authDomain: "traderymessenger.firebaseapp.com",
  projectId: "traderymessenger",
  storageBucket: "traderymessenger.firebasestorage.app",
  messagingSenderId: "693590502885",
  appId: "1:693590502885:web:658531b928cc1f40b1930c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore()