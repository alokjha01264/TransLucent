
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "translucent-c58f2.firebaseapp.com",
  projectId: "translucent-c58f2",
  storageBucket: "translucent-c58f2.firebasestorage.app",
  messagingSenderId: "191890135809",
  appId: "1:191890135809:web:0c5e18ec07a6026fc8d900"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()