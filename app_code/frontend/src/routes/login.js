import { VStack, Button, Input, FormControl, FormLabel, Text } from "@chakra-ui/react";

import { useState } from "react";

import { useAuth } from "../contexts/useAuth";

import { useNavigate } from "react-router-dom";


const Login = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const {login_user} = useAuth();
    const nav = useNavigate();

    const handleLogin = () =>{
        login_user(username, password)
    }

    const handleNavigate = () =>{
        nav('/register')
    }


    return(
        <VStack minH='500px' w='70%' maxW='400px' justifyContent='start' alignItems='start'>
            <Text mb='20px' color='gray.700' fontSize='44px' fontWeight='bold'>Login</Text>
            <FormControl mb='20px'>
                <FormLabel>Username</FormLabel>
                <Input onChange={(e) => setUsername(e.target.value)} value={username} bg='white' type='email' placeholder='Your username here' />
            </FormControl>
            <FormControl>
                <FormLabel>Password</FormLabel>
                <Input onChange={(e) => setPassword(e.target.value)} value={password}  bg='white' type='password' placeholder='Your password here' />
            </FormControl>
            <Button onClick={handleLogin} mb='10px' colorScheme='red' mt='20px' w='100%'>Login</Button>
            <Text onClick={handleNavigate}>Vous n'avez pas de compte? Créez-en un.</Text>
        </VStack>
    )
}

export default Login;