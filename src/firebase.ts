import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAnFooUv9-_s_HhBWiq-LbsKDdoDnLOBqM",
    authDomain: "survey-app-220b1.firebaseapp.com",
    projectId: "survey-app-220b1",
    storageBucket: "survey-app-220b1.appspot.com",
    messagingSenderId: "432136118279",
    appId: "1:432136118279:web:b1db0ee882d2b886ee8aa2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };