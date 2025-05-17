import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBh9afPi_tj18SliCvYv8qtIjFypMVDg5U",
  authDomain: "sign-up-b63e5.firebaseapp.com",
  projectId: "sign-up-b63e5",
  storageBucket: "sign-up-b63e5.firebasestorage.app",
  messagingSenderId: "773604932443",
  appId: "1:773604932443:web:04779495c469a530e2b87e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);