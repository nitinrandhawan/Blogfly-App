// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcQwJrQQjRSZmULCgapzXDoPrxnEAf8ks",
  authDomain: "blogfly-website.firebaseapp.com",
  projectId: "blogfly-website",
  storageBucket: "blogfly-website.appspot.com",
  messagingSenderId: "696238281039",
  appId: "1:696238281039:web:c504f57b020f2be846b53a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const provider=new GoogleAuthProvider()

const auth=getAuth()

export const authWithGoogle=async()=>{
   let user=null;
   await signInWithPopup(auth,provider).then((result)=>{ user=result.user})
   .catch((err)=> {
    console.log(err);
   })
   return user
}