// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCi6AUp_5wJhLo8qM64BFpIma8d5Q-KqSc",
  authDomain: "ln-found.firebaseapp.com",
  projectId: "ln-found",
  storageBucket: "ln-found.firebasestorage.app",
  messagingSenderId: "338639228452",
  appId: "1:338639228452:web:5bb911cdc931b0c303d2b1",
  measurementId: "G-4VC1X0TSMX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
export const storage = getStorage(app);
export { db };
