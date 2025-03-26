import { createContext, useContext, useEffect, useState } from "react";

import { is_authenticated } from "../endpoints/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading]= useState(true)

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

    useEffect(() => {
        get_authenticated();
    }, [window.location.pathname])

  return (
    <AuthContext.Provider value={{isAuthenticated, loading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
