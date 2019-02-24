import * as firebase from "firebase";

const devConfig = {
  apiKey: "AIzaSyCxsIsHEq2QZOdSmrCG5LpQeqY-wQW5_u4",
  authDomain: "helpnet-3a519.firebaseapp.com",
  databaseURL: "https://helpnet-3a519.firebaseio.com",
  projectId: "helpnet-3a519",
  storageBucket: "helpnet-3a519.appspot.com",
  messagingSenderId: "550379662303"
};

const prodConfig = {
  apiKey: "AIzaSyCca1EtJhC4p9OzuIppUuCFeMTFGb2d1L8",
  authDomain: "helpnet-prod.firebaseapp.com",
  databaseURL: "https://helpnet-prod.firebaseio.com",
  projectId: "helpnet-prod",
  storageBucket: "helpnet-prod.appspot.com",
  messagingSenderId: "162656923160"
};

const isDevMode = true;

export const firebaseApp = firebase.initializeApp(
  isDevMode ? devConfig : prodConfig
);
