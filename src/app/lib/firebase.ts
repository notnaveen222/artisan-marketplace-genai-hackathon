import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCumBaydA7ecSNqBsDmpyf_QP5477SLL-4",
  authDomain: "artisan-marketplace-555ce.firebaseapp.com",
  projectId: "artisan-marketplace-555ce",
  storageBucket: "artisan-marketplace-555ce.appspot.com",
  messagingSenderId: "155655562551",
  appId: "1:155655562551:web:86d8a7ab8c0bbb61e6b2",
  measurementId: "G-VQ2WMMH254",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore instance
export const db = getFirestore(app);
