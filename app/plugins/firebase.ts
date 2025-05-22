// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCKeVR_XLSfxohVm7-GTTGLoDVgU9pQSOU",
    authDomain: "micro-cafe-26645.firebaseapp.com",
    projectId: "micro-cafe-26645",
    storageBucket: "micro-cafe-26645.firebasestorage.app",
    messagingSenderId: "681426918933",
    appId: "1:681426918933:web:206967fb9c645e26f6b81c"
};

// Initialize Firebase
let firebaseApp
const apps = getApps()
if (!apps.length) {
    firebaseApp = initializeApp(firebaseConfig)
} else {
    firebaseApp = apps[0]
}


export default defineNuxtPlugin(() => {
    return {
        provide: {
            firebase: firebaseApp
        }
    }
})