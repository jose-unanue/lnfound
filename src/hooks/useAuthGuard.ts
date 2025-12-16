// src/hooks/useAuthGuard.ts
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "firebase/auth";
import { auth } from "../firebase/firebase";

interface AuthUser {
  uid: string;
  email: string | null;
  token: string;
  expiresAt: number;
}

const TOKEN_KEY = "lnfound_token";

export default function useAuthGuard(): AuthUser | null {
  const [user, setUser] = useState<AuthUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenString = localStorage.getItem(TOKEN_KEY);

    if (!tokenString) {
      navigate("/login");
      return;
    }

    try {
      const tokenData: AuthUser = JSON.parse(tokenString);
      const now = Date.now();

      if (!tokenData.token || tokenData.expiresAt < now) {
        localStorage.removeItem(TOKEN_KEY);
        navigate("/login");
        return;
      }

      setUser(tokenData);
    } catch (err) {
      localStorage.removeItem(TOKEN_KEY);
      navigate("/login");
    }
  }, [navigate]);

  // Also keep Firebase's auth in sync
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser: User | null) => {
      if (!firebaseUser) {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return user;
}
