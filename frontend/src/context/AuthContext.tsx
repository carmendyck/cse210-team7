import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

interface AuthContextType {
  user: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(localStorage.getItem("authToken"));
  const history = useHistory();

  // 🔹 Ensure re-routing happens when the auth state changes
  useEffect(() => {
    if (user) {
      history.push("/tasklist"); // Redirect when user logs in
    }
  }, [user, history]); // 🔹 Ensure it updates when `user` changes

  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    setUser(token);
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
