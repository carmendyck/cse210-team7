import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

interface AuthContextType {
  user: string | null;
  login: (token: string, isNewSignup?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(localStorage.getItem("authToken"));
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (user && location.pathname === '/login') {
      history.push("/tasklist");
    }
  }, [user, history, location]);

  const login = (token: string, isNewSignup = false) => {
    localStorage.setItem("authToken", token);
    setUser(token);
    
    if (!isNewSignup) {
      history.push("/tasklist");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
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