// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: config.public.firebase.apiKey,
        authDomain: config.public.firebase.authDomain,
        projectId: config.public.firebase.projectId,
        storageBucket: config.public.firebase.storageBucket,
        messagingSenderId: config.public.firebase.messagingSenderId,
        appId: config.public.firebase.appId
    };

    // Initialize Firebase
    let firebaseApp
    const apps = getApps()
    if (!apps.length) {
        firebaseApp = initializeApp(firebaseConfig)
    } else {
        firebaseApp = apps[0]
    }

    return {
        provide: {
            firebase: firebaseApp
        }
    }
})