import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBV5EyTC1Kthn8dJgM6WtWs7q6W-MyL3Qg",
  authDomain: "attendance-56f80.firebaseapp.com",
  databaseURL: "https://attendance-56f80-default-rtdb.firebaseio.com",
  projectId: "attendance-56f80",
  storageBucket: "attendance-56f80.appspot.com",
  messagingSenderId: "1016887169608",
  appId: "1:1016887169608:web:7535b62831293ae60c7e7d",
  measurementId: "G-4EY5F6J5H5"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };