"use client";

import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "./init";

interface AuthProps {
  user?: User;
  authenticate: () => void;
  signout: () => void;
}

const AuthContext = createContext<AuthProps>({
  user: undefined,
  authenticate: () => {},
  signout: () => {},
});
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });

    return unsubscribe;
  });

  const authenticate = () => {
    const googleProvider = new GoogleAuthProvider();
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        if (result && result.user) setUser(result.user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const signout = () => {
    signOut(auth)
      .then(() => {
        setUser(undefined);
      })
      .catch((error) => console.error(error));
  };

  const authValue = { user, authenticate, signout };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
}
