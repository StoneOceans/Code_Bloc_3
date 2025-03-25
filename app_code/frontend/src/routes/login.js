import { VStack, Button, Input, FormControl, FormLabel, Text } from "@chakra-ui/react";

import { useState } from "react";

const Login = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = () =>{
        
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
            <Button mb='10px' colorScheme='red' mt='20px' w='100%'>Login</Button>
        </VStack>
    )
}

export default Login;