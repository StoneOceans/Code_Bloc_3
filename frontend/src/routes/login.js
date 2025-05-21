import { VStack, Box, Button, Input, FormControl, FormLabel, Heading, Text, Link } from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login_user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    await login_user(username, password);
  };

  const handleNavigate = () => {
    navigate('/register');
  };

  return (
    <VStack minH="100vh" align="center" justify="center" bg="gray.100" p={4}>
      <Box bg="white" p={8} borderRadius="lg" boxShadow="lg" w={{ base: "90%", md: "400px" }}>
        <Heading as="h2" mb={6} color="red.600" textAlign="center">
          Se connecter
        </Heading>
        <FormControl mb={4}>
          <FormLabel>Nom d'utilisateur</FormLabel>
          <Input 
            placeholder="Votre nom d'utilisateur" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            bg="gray.50" 
          />
        </FormControl>
        <FormControl mb={6}>
          <FormLabel>Mot de passe</FormLabel>
          <Input 
            type="password" 
            placeholder="Votre mot de passe" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            bg="gray.50" 
          />
        </FormControl>
        <Button colorScheme="red" w="full" onClick={handleLogin}>
          Login
        </Button>
        <Text mt={4} textAlign="center">
          Vous n'avez pas de compte?{' '}
          <Link color="red.600" onClick={handleNavigate} fontWeight="bold">
            Créez-en un.
          </Link>
        </Text>
      </Box>
    </VStack>
  );
};

export default Login;
