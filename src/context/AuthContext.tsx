"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { SESSION_DURATION_MS } from "@/lib/auth-config";

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
}>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          document.cookie =
            "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

          localStorage.removeItem("authExpiresAt");

          setUser(null);
          setLoading(false);
          return;
        }

        const expiresAt = localStorage.getItem("authExpiresAt");

        if (expiresAt && Date.now() > Number(expiresAt)) {
          await signOut(auth);

          document.cookie =
            "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

          localStorage.removeItem("authExpiresAt");

          setUser(null);
          setLoading(false);
          return;
        }

        const token = await firebaseUser.getIdToken();

        const maxAge = Math.floor(SESSION_DURATION_MS / 1000);

        document.cookie = [
          `auth-token=${token}`,
          "path=/",
          `max-age=${maxAge}`,
          "samesite=lax",
        ].join("; ");

        if (!expiresAt) {
          localStorage.setItem(
            "authExpiresAt",
            (Date.now() + SESSION_DURATION_MS).toString(),
          );
        }

        setUser(firebaseUser);
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
