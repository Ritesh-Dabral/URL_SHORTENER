import app from 'firebase/app';
import "firebase/auth";

var firebaseConfig = {
    apiKey: process.env.APIKEY.toString(),
    authDomain: process.env.AUTHDOMAIN.toString(),
    databaseURL: process.env.DATABASEURL.toString(),
    projectId: process.env.PROJECTID.toString(),
    storageBucket: process.env.STORAGEBUCKET.toString(),
    messagingSenderId: process.env.MESSAGINGSENDERID.toString(),
    appId: process.env.APPID.toString(),
    measurementId: process.env.MEASUREMENTID.toString()
};

app.initializeApp(firebaseConfig);
export const auth = app.auth();