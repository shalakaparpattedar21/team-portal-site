// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDh9wWnjOp6RE6_-UeZpvCBOVung9eZ73o",
  authDomain: "tmrt-159f5.firebaseapp.com",
  projectId: "tmrt-159f5",
  storageBucket: "tmrt-159f5.appspot.com",
  messagingSenderId: "31456916866",
  appId: "1:31456916866:web:da12f86aac06ad85ed8b9b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

// Message display utility
function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Sign Up
const signUp = document.getElementById('submitSignUp');
if (signUp) {
  signUp.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        const userData = {
          email: email,
          firstName: firstName,
          lastName: lastName
        };

        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
          .then(() => {
            showMessage('Account Created Successfully', 'signUpMessage');
            setTimeout(() => {
              window.location.href = 'index.html';
            }, 2000);
          })
          .catch((error) => {
            console.error("Error writing document:", error);
            showMessage('Database error occurred', 'signUpMessage');
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          showMessage('Email Address Already Exists !!!', 'signUpMessage');
        } else {
          showMessage('Unable to create user', 'signUpMessage');
        }
      });
  });
}

// Sign In
const signIn = document.getElementById('submitSignIn');
if (signIn) {
  signIn.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        showMessage('Login Successful', 'signInMessage');
        setTimeout(() => {
          window.location.href = 'homepage.html';
        }, 2000);
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-credential') {
          showMessage('Incorrect Email or Password', 'signInMessage');
        } else {
          showMessage('Account does not Exist', 'signInMessage');
        }
      });
  });
}
