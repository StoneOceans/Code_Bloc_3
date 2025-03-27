import { VStack, Button, Input, FormControl, FormLabel, Text } from "@chakra-ui/react";

import { useState } from "react";

import { useAuth } from "../contexts/useAuth";
const Register = () => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [Cpassword, setCPassword] = useState('')

    const { register_user } = useAuth();

    const handleRegister = () =>{
        register_user(username,email, password, Cpassword)
    }


    return(
        <VStack minH='500px' w='70%' maxW='400px' justifyContent='start' alignItems='start'>
            <Text mb='20px' color='gray.700' fontSize='44px' fontWeight='bold'>Register</Text>
            <FormControl mb='20px'>
                <FormLabel>Username</FormLabel>
                <Input onChange={(e) => setUsername(e.target.value)} value={username} bg='white' type='email' placeholder='Your username here' />
            </FormControl>
            <FormControl mb='20px'>
                <FormLabel>Email</FormLabel>
                <Input onChange={(e) => setEmail(e.target.value)} value={email} bg='white' type='email' placeholder='Your username here' />
            </FormControl>
            <FormControl>
                <FormLabel>Password</FormLabel>
                <Input onChange={(e) => setPassword(e.target.value)} value={password}  bg='white' type='password' placeholder='Your password here' />
            </FormControl>
            <FormControl mb='20px'>
                <FormLabel>Confirm Password</FormLabel>
                <Input onChange={(e) => setCPassword(e.target.value)} value={Cpassword} bg='white' type='password' placeholder='Your username here' />
            </FormControl>
            <Button onClick={handleRegister} mb='10px' colorScheme='red' mt='20px' w='100%'>Login</Button>
        </VStack>
    )
}

export default Register;