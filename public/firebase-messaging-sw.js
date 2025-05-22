importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyB9u-_5jOM-OFkFb921letwI_AWRYEgKlM",
    authDomain: "hormur-16d24.firebaseapp.com",
    projectId: "hormur-16d24",
    storageBucket: "hormur-16d24.firebasestorage.app",
    messagingSenderId: "1015715775596",
    appId: "1:1015715775596:web:dea453a7110672edca8449"
  };

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();