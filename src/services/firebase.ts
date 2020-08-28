import * as firebase from 'firebase';

// TODO: fill in your firebase config
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    // databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    appId: process.env.REACT_APP_FIREBASE_SENDER_ID
};

firebase.initializeApp(firebaseConfig);

export default firebase;