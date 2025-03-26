import { Heading } from "@chakra-ui/react";

import { useAuth } from "../contexts/useAuth";

import { useNavigate } from "react-router-dom";

const PrivateRoute = ({children}) => {
    const{ isAuthenticated, loading } = useAuth();

    if (loading){
        return <Heading>Veuillez patienter...</Heading>
    }

    if (isAuthenticated) {
        return children
    } else {
        navigator('/login')
    }
}

export default PrivateRoute;