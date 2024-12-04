"use client";

import { createContext, useState, ReactNode } from "react";

export type AuthProviderType = {
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
};

interface AuthContextType {
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
}

const authProvider = {
  user: null,
  login: (username: string) => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(authProvider);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  const login = (username: string) => {
    setUser(username);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
