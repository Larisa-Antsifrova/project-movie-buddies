// Importing the Firebase App (the core Firebase SDK). It is always required and must be listed first.
import firebase from 'firebase/app';

// Adding the Firebase products use in the app
import 'firebase/auth';
import 'firebase/firestore';

// Configuting Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyD8Pj5g00ZULxj-kPltwk6-ExixXS3Bltg',
  authDomain: 'movie-buddies-887c1.firebaseapp.com',
  projectId: 'movie-buddies-887c1',
  storageBucket: 'movie-buddies-887c1.appspot.com',
  messagingSenderId: '663783849320',
  appId: '1:663783849320:web:4447396883e1c7c0492add',
};

// Initializing Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
// update firestore settings
db.settings({ timestampsInSnapshots: true });

export { db, auth };
