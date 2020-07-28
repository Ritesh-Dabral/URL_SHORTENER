import app from 'firebase/app';
import "firebase/auth";

var firebaseConfig = {
    apiKey: "AIzaSyBfOyPe8LrkD_7u4y27IHdeZV_oauv8tXE",
    authDomain: "shortify-8debc.firebaseapp.com",
    databaseURL: "https://shortify-8debc.firebaseio.com",
    projectId: "shortify-8debc",
    storageBucket: "shortify-8debc.appspot.com",
    messagingSenderId: "409334062945",
    appId: "1:409334062945:web:62d912e97899eb7facef20",
    measurementId: "G-31G35G4FJF"
};

app.initializeApp(firebaseConfig);
export const auth = app.auth();