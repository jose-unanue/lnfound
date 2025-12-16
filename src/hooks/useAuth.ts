interface AuthUser {
  email: string;
  token: string;
  expiresAt: number;
}

export const useAuth = (): AuthUser | null => {
  const tokenString = localStorage.getItem("lnfound_token");
  if (!tokenString) return null;

  try {
    const tokenData: AuthUser = JSON.parse(tokenString);
    return tokenData.expiresAt > Date.now() ? tokenData : null;
  } catch {
    return null;
  }
};
