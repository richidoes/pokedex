import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB6yh7UNb7g34cQQau2LvOHmaeBWbtclgY",
  authDomain: "pokedex-56112.firebaseapp.com",
  projectId: "pokedex-56112",
  storageBucket: "pokedex-56112.appspot.com",
  messagingSenderId: "202554467294",
  appId: "1:202554467294:web:e10c3c83f2c14db01e334f",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { auth, db, firebase, storage };
