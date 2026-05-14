import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDmcEz7D_g9ICFCQAr3Kxk3gSM4mbrneNc",
  authDomain: "projectmanagement-bfe8b.firebaseapp.com",
  projectId: "projectmanagement-bfe8b",
  storageBucket: "projectmanagement-bfe8b.firebasestorage.app",
  messagingSenderId: "745266224482",
  appId: "1:745266224482:web:5495a46108cc6a7ce5603b",
  measurementId: "G-VTM9SBEF1Y"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
