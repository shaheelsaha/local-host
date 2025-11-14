

// FIX: Refactor to Firebase v8 compat syntax to address module resolution error.
// FIX: Update Firebase compat imports to match the import map, resolving the `firebase.auth is not a function` error by changing `firebase/compat/*` to `firebase/*`.
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';


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