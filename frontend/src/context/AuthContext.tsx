import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

interface AuthContextType {
  user: string | null;
  login: (token: string, uid: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(localStorage.getItem("authToken"));
  const [uid, setUid] = useState<string | null>(localStorage.getItem("uid"));
  const history = useHistory();

  // 🔹 Ensure re-routing happens when the auth state changes
  useEffect(() => {
    if (user) {
      history.push("/tasklist"); // Redirect when user logs in
    }
  }, [user, history]); // 🔹 Ensure it updates when `user` changes

  const login = (token: string, uid: string) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("uid", uid);
    setUser(token);
    setUid(uid);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("uid");
    setUser(null);
    setUid(null);
    history.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const useUid = (): string | null => {
  const uid = localStorage.getItem("uid");
  return uid;
};
