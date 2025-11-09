
// FIX: Refactor to Firebase v8 compat syntax to address module resolution error.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfAmediQHvqtb42H_wvqc2iFTVtJnlnR4",
  authDomain: "studio-7638670629-b2831.firebaseapp.com",
  databaseURL: "https://studio-7638670629-b2831-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "studio-7638670629-b2831",
  storageBucket: "studio-7638670629-b2831.firebasestorage.app",
  messagingSenderId: "846565674927",
  appId: "1:846565674927:web:3e5307bd919c5ade69295a",
  measurementId: "G-2P869HPRJZ"
};


// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const googleProvider = new firebase.auth.GoogleAuthProvider();