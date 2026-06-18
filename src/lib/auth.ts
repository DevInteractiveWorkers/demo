import {
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

import { auth } from "./firebase";

const SESSION_DURATION_DAYS = 7;

export async function login(email: string, password: string) {
  await setPersistence(auth, browserLocalPersistence);

  const credential = await signInWithEmailAndPassword(auth, email, password);

  const expiresAt = Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

  localStorage.setItem("authExpiresAt", expiresAt.toString());

  return credential;
}

export async function logout() {
  localStorage.removeItem("authExpiresAt");
  return signOut(auth);
}
