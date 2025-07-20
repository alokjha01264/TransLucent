
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "newtranslucent-f2fbb.firebaseapp.com",
  projectId: "newtranslucent-f2fbb",
  storageBucket: "newtranslucent-f2fbb.firebasestorage.app",
  messagingSenderId: "240158764148",
  appId: "1:240158764148:web:2e40b3003f8b928eacf521"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()