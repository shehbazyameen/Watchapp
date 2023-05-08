// Import the functions you need from the SDKs you need


import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUFPW5LvDggkdbq23DO-D5G24W42_4pSY",
  authDomain: "chat-app-bc936.firebaseapp.com",
  projectId: "chat-app-bc936",
  storageBucket: "chat-app-bc936.appspot.com",
  messagingSenderId: "849704232293",
  appId: "1:849704232293:web:f84d1663aa5c8bc370ad8c",
  measurementId: "G-HLJ4X4H8ZR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;