// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/functions';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: "AIzaSyCWs3K51Zky-sCbXlSslO-_isdvDlsIBOw",
    authDomain: "meatforyou-8eda1.firebaseapp.com",
    projectId: "meatforyou-8eda1",
    storageBucket: "meatforyou-8eda1.appspot.com",
    messagingSenderId: "75554304010",
    appId: "1:75554304010:web:c017ab328369a0e707eff3",
    measurementId: "G-PB9L0MCW9P"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

// firebase.functions().useEmulator("http://localhost", 5000)

export const Firebase = firebase