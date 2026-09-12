import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchCurrentUser, loginUser, logoutUser, registerUser } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const me = await fetchCurrentUser();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = async (email, password) => {
    const u = await loginUser({ email, password });
    setUser(u);
    return u;
  };

  const register = async (payload) => {
    const u = await registerUser(payload);
    setUser(u);
    return u;
  };

  const logout = async () => {
    try { await logoutUser(); } catch { /* ignore */ }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
