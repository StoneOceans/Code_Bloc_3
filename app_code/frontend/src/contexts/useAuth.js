import { createContext, useContext, useEffect, useState } from "react";
import { is_authenticated, register } from "../endpoints/api";

import { useNavigate } from "react-router-dom";

import { login } from "../endpoints/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const get_authenticated = async () => {
    try {
      const success = await is_authenticated();
      setIsAuthenticated(success);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login_user = async (username, password) => {
    try {
      const response = await login(username, password);
      console.log("Login response:", response);
      if (response && response.success === true) {
        setIsAuthenticated(true);
        nav("/");
      } else {
        alert("Échec de la connexion. Vérifiez vos identifiants.");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      alert("Une erreur est survenue lors de la connexion.");
    }
  };

  const register_user = async (username, email, password, Cpassword) => {
    if (password !== Cpassword) {
      alert("Le mot de passe ne correspond pas");
      return;
    }
    try {
      const response = await register(username, email, password);
      console.log("Register response:", response);
      if (response && response.success === true) {
        alert("Succès de la création de compte");
        setIsAuthenticated(true);
        nav("/");
      } else {
        alert("Erreur lors de la création du compte");
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      alert("Erreur lors de la création du compte");
    }
  };

  useEffect(() => {
    get_authenticated();
  }, [window.location.pathname]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login_user, register_user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
