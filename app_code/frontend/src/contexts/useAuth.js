import { createContext, useContext, useEffect, useState } from "react";

import { is_authenticated, register } from "../endpoints/api";

import { useNavigate } from "react-router-dom";

import { login } from "../endpoints/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading]= useState(true)
    const nav = useNavigate();

    const get_authenticated = async () => {
        try {
            const success = await is_authenticated();
            setIsAuthenticated(success)
        } catch {
            setIsAuthenticated(false)
        } finally {
            setLoading(false)
        }
    }

    const login_user = async(username,password) => {
        const success = await login(username, password);
        if (success) {
            setIsAuthenticated(true)
            nav('/')
        }
    }

    const register_user  = async(username,email,password, Cpassword) => {
        if (password === Cpassword) {
            try{
                await register(username,email,password);
                alert('Succés de la création de compte')

            }
            catch {
                alert('Erreur lors de la création du compte')
            }
        } else {
            alert('Le mot de passe ne correspond pas')
        }

    }

    useEffect(() => {
        get_authenticated();
    }, [window.location.pathname])

  return (
    <AuthContext.Provider value={{isAuthenticated, loading, login_user, register_user}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
