// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQukUTVUq4efEBmId1F0Vk314LW4Mly14",
  authDomain: "social-deduction-db.firebaseapp.com",
  databaseURL: "https://social-deduction-db-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "social-deduction-db",
  storageBucket: "social-deduction-db.firebasestorage.app",
  messagingSenderId: "305244584912",
  appId: "1:305244584912:web:7ed79dae7cc8db1145d7d5",
  measurementId: "G-L6QTH8Q4F6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// const analytics = getAnalytics(app);

export { db }