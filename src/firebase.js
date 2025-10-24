import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, update } from "firebase/database";

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA4emZ7G2Tx9SRWoZ5rVeTwScVvuipqK4E",
  authDomain: "fir-demo-e7e9f.firebaseapp.com",
  databaseURL:
    "https://fir-demo-e7e9f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fir-demo-e7e9f",
  storageBucket: "fir-demo-e7e9f.firebasestorage.app",
  messagingSenderId: "888236515869",
  appId: "1:888236515869:web:a7280f017a26ed5e685cf4",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

export { ref, onValue, push, update };
