// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA3U2BcwmjDJ8MbW9jUTPNvz9CXRpaMJSc",
  authDomain: "binarytool-blocky.firebaseapp.com",
  projectId: "binarytool-blocky",
  storageBucket: "binarytool-blocky.appspot.com",
  messagingSenderId: "974451494455",
  appId: "1:974451494455:web:81c73e20645ed317f9f9b2",
  measurementId: "G-1VZC1PRP1T"
};

// Initialize Firebase
export const firebase_app = initializeApp(firebaseConfig);