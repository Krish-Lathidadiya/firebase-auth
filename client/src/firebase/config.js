import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbmwWb8ONRethUSctlXjORBbRYNQ2LHpU",
  authDomain: "login-demo-9515b.firebaseapp.com",
  projectId: "login-demo-9515b",
  storageBucket: "login-demo-9515b.appspot.com",
  messagingSenderId: "763439343823",
  appId: "1:763439343823:web:741f22ad874eca93bbefba",
  measurementId: "G-8EETTPPCMZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
const analytics = getAnalytics(app);
export default app;
