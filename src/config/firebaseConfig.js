import firebase from "firebase";

let firebaseConfig = {
  apiKey: "AIzaSyCPN44fEPC_l66ilUDSuuRjNgoTfMT1Jy4",
  authDomain: "quize-18a3c.firebaseapp.com",
  projectId: "quize-18a3c",
  storageBucket: "quize-18a3c.appspot.com",
  messagingSenderId: "778853875575",
  appId: "1:778853875575:web:a4b35f80663aa8a762eb72",
  measurementId: "G-8S9F4NFMQD",
};
let auth, app;
let db;
// Initialize Firebase
try {
  app = firebase.initializeApp(firebaseConfig);
  firebase.analytics();
} catch {}
auth = firebase.auth(app);
db = firebase.firestore(app);

export { auth, db };
