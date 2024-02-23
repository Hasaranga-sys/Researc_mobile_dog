import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "@firebase/firestore";
import {getAuth} from 'firebase/auth'

// Import the functions you need from the SDKs you need

import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD6ZjOpii5j2jw-EbZl7uV17s5hwtW_m7Q",
  authDomain: "dg-project-534ca.firebaseapp.com",
  projectId: "dg-project-534ca",
  storageBucket: "dg-project-534ca.appspot.com",
  messagingSenderId: "250396521370",
  appId: "1:250396521370:web:b4ab29142c74a36720c023",
  measurementId: "G-EK0N97JTGC"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);
export const db = getFirestore(app);

export default app;


// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
//   }

// Initialize Firebase
// let app;
// if(firebase.apps.length ===0 ){
//   app = firebase.initializeApp(firebaseConfig);
// }else{
//   app = firebase.app();
// }
// const auth = firebase.auth();

// const analytics = getAnalytics(app);