import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAaJpNP1w2rx_okue5Hcphkf4jLVgFlwAA',
  authDomain: 'instagram-clone-a302f.firebaseapp.com',
  projectId: 'instagram-clone-a302f',
  storageBucket: 'instagram-clone-a302f.appspot.com',
  messagingSenderId: '843388270425',
  appId: '1:843388270425:web:23bb3e4729ce053fe6be48',
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
