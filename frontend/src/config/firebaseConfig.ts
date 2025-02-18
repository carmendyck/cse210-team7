// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwAzbU2ljj00CmBsf_8eMiCFezzbGIL0U",
  authDomain: "tritoncal.firebaseapp.com",
  projectId: "tritoncal",
  storageBucket: "tritoncal.firebasestorage.app",
  messagingSenderId: "664414670353",
  appId: "1:664414670353:web:ebe446705fd5a2d815abb0",
  measurementId: "G-99TRKYBB1V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default firebaseConfig;