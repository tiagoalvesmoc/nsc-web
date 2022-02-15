import React, { useEffect, useState, createContext } from "react";
import firebaseConfig from "./config";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(user);
        const uid = user.uid;

        console.log(user);
        // ...
      } else {
        // User is signed out
        // ...
        setUser(false);
      }
    });
  }, []);

  function login(email, password) {
    setLoading(true);

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        setUser(userCredential.user);
        console.log(userCredential.user);
        setLoading(false);
        // ...
      })
      .catch((error) => {
        alert(error);
        console.log(error);
        setLoading(false);
        // ..
      });
  }

  function exit() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setUser(false);
      })
      .catch((error) => {
        // An error happened.
        setUser(false);
      });
  }
  return (
    <AuthContext.Provider value={{ user, loading, login, exit }}>
      {children}
    </AuthContext.Provider>
  );
};
