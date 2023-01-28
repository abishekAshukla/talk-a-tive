import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDUn6wXA0ZMFMix_ll--dpHrJRHRP_hVWc",
    authDomain: "talk-a-tive-989c9.firebaseapp.com",
    projectId: "talk-a-tive-989c9",
    storageBucket: "talk-a-tive-989c9.appspot.com",
    messagingSenderId: "949014061275",
    appId: "1:949014061275:web:fc3f49361f5695a3776cfe"
};

const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);