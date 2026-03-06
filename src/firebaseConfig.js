// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAQ-mS_E5yjUedYyWN4RqhnU-Bzuj3ffEE",
    authDomain: "stringtheory-oms.firebaseapp.com",
    projectId: "stringtheory-oms",
    storageBucket: "stringtheory-oms.firebasestorage.app",
    messagingSenderId: "85790897716",
    appId: "1:85790897716:web:8bf52e93f12c1a86a7fc61",
    measurementId: "G-G75M2QPS4C"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
