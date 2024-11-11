import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check sessionStorage for username
    const storedUser = sessionStorage.getItem("username");
    if (storedUser) {
      setUser(storedUser);
      navigate("/"); // Redirect to home if user is already logged in
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const login = async (username) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        setUser(username);
        sessionStorage.setItem("username", username);
        navigate("/");
      } else {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      setUser(null);
      sessionStorage.removeItem("username");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
