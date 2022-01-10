import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDDMp1N4W76xlI5z0ByhTQydWjUPOOq84w",
    authDomain: "thebase-f9fd6.firebaseapp.com",
    projectId: "thebase-f9fd6",
    storageBucket: "thebase-f9fd6.appspot.com",
    messagingSenderId: "180132466699",
    appId: "1:180132466699:web:4b588cb0c4728ee90ff70e"
  };

const app = initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();
const storage = getStorage(app);

export { db, auth, storage }