import { createContext, useState, useEffect } from "react";
import { logoutUser } from "../services/authService";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      await API.get("/auth/check");
      setIsAuthenticated(true);

    } catch (err) {


      if (err.response?.status === 401) {
        setIsAuthenticated(false);
      } else {
        console.error("Auth check network/server error:", err.message);
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async() => {
      await checkSession();
    // setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log(err);
    }
    setIsAuthenticated(false);
  };


  if (loading) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkSession }}>

      {children}
    </AuthContext.Provider>
  );
};
