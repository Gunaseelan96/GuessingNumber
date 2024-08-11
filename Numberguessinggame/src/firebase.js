
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDqcdFMnOtf-c5NcMYnMkYtVjZDt9DgK5I",
  authDomain: "gamee-83114.firebaseapp.com",
  projectId: "gamee-83114",
  storageBucket: "gamee-83114.appspot.com",
  messagingSenderId: "1043570331178",
  appId: "1:1043570331178:web:ed2ac00e3ba887e338bd53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebase = getFirestore(app);
