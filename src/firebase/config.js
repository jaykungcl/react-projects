import { initializeApp} from 'firebase/app'
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDmDnxYi6PtsSAbpn4mxzrOE5SlONHhQyk",
    authDomain: "mymoney-103dd.firebaseapp.com",
    projectId: "mymoney-103dd",
    storageBucket: "mymoney-103dd.appspot.com",
    messagingSenderId: "1055702817806",
    appId: "1:1055702817806:web:1a5a56b7ebdcb6d356f05f"
};

// initialize firebase
initializeApp(firebaseConfig);

// initialize firestore + auth
const db = getFirestore();
const auth = getAuth();

export { db, auth }