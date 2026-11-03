import {
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

import { auth } from "./firebase";
import { SESSION_DURATION_MS } from "./auth-config";

export async function login(email: string, password: string) {
  await setPersistence(auth, browserLocalPersistence);

  const credential = await signInWithEmailAndPassword(auth, email, password);

  const expiresAt = Date.now() + SESSION_DURATION_MS;

  localStorage.setItem("authExpiresAt", expiresAt.toString());

  return credential;
}

export async function logout() {
  localStorage.removeItem("authExpiresAt");
  return signOut(auth);
}
