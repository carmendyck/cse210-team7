import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

interface AuthContextType {
  user: string | null;
  uid: string | null;
  login: (token: string, uid: string, isNewSignup?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(localStorage.getItem("authToken"));
  const [uid, setUid] = useState<string | null>(localStorage.getItem("uid"));
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (user && location.pathname === '/login') {
      history.push("/tasklist");
    }
  }, [user, history, location]);

  const login = (token: string, uid: string, isNewSignup = false) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("uid", uid);
    setUser(token);
    setUid(uid);

    if (!isNewSignup) {
      history.push("/tasklist");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("uid");
    setUser(null);
    setUid(null);
    history.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, uid, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
