importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyCKeVR_XLSfxohVm7-GTTGLoDVgU9pQSOU",
    authDomain: "micro-cafe-26645.firebaseapp.com",
    projectId: "micro-cafe-26645",
    storageBucket: "micro-cafe-26645.firebasestorage.app",
    messagingSenderId: "681426918933",
    appId: "1:681426918933:web:206967fb9c645e26f6b81c"
  };

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();