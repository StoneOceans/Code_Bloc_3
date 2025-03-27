import { VStack, Box, Button, Input, FormControl, FormLabel, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Cpassword, setCPassword] = useState('');
  
  const { register_user } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    const success = await register_user(username, email, password, Cpassword);
    if (success) {
      navigate('/');
    }
  }

  return (
    <VStack minH="100vh" align="center" justify="center" bg="gray.100" p={4}>
      <Box bg="white" p={8} borderRadius="lg" boxShadow="lg" w={{ base: "90%", md: "400px" }}>
        <Heading as="h2" mb={6} color="red.600" textAlign="center">
          Créer votre compte !
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
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input 
            type="email"
            placeholder="Votre adresse email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            bg="gray.50"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Mot de passe</FormLabel>
          <Input 
            type="password"
            placeholder="Votre mot de passe" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            bg="gray.50"
          />
        </FormControl>
        <FormControl mb={6}>
          <FormLabel>Confirmer le mot de passe</FormLabel>
          <Input 
            type="password"
            placeholder="Confirmez votre mot de passe" 
            value={Cpassword} 
            onChange={(e) => setCPassword(e.target.value)} 
            bg="gray.50"
          />
        </FormControl>
        <Button colorScheme="red" w="full" onClick={handleRegister}>
          S'inscrire
        </Button>
      </Box>
    </VStack>
  );
};

export default Register;
