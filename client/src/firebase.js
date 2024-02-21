// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
// console.log(apiKey);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-5bc38.firebaseapp.com",
  projectId: "mern-blog-5bc38",
  storageBucket: "mern-blog-5bc38.appspot.com",
  messagingSenderId: "171080495282",
  appId: "1:171080495282:web:64885aac04bde69d8f99ab"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);