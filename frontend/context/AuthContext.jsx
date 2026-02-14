import { createContext, useState } from "react";

import { logoutUser } from "../services/authService"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken")
  );

  const login = (token,refreshToken,id) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    setIsAuthenticated(true);
  };

  const logout = async() => {
  try {
    await logoutUser(); // backend removes refresh token
  } catch (err) {
    console.log(err);
  }

  // clear client storage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  setIsAuthenticated(false);

    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};