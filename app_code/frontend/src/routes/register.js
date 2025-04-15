import { 
  VStack, 
  Box, 
  Button, 
  Input, 
  FormControl, 
  FormLabel, 
  Heading,
  Alert,
  AlertIcon,
  FormErrorMessage,
  useToast
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register_user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if ((name === 'password' || name === 'confirmPassword') && errors.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'L\'email est invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Les mots de passe ne correspondent pas' });
      return;
    }
  
    setIsSubmitting(true);
    
    try {
      const result = await register_user(
        formData.username,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      
      if (result.success) {
        toast({
          title: "Compte créé",
          description: "Vous êtes maintenant inscrit.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate('/login');
      } else {
        const formattedErrors = {};
        if (result.errors) {
          Object.keys(result.errors).forEach(key => {
            formattedErrors[key] = Array.isArray(result.errors[key]) 
              ? result.errors[key].join(' ') 
              : result.errors[key];
          });
        }
        setErrors(formattedErrors);
  
        toast({
          title: "Erreur d'inscription",
          description: result.error || "Une erreur est survenue",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      navigate('/login');
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VStack as="form" onSubmit={handleSubmit} minH="100vh" align="center" justify="center" bg="gray.100" p={4}>
      <Box bg="white" p={8} borderRadius="lg" boxShadow="lg" w={{ base: "90%", md: "400px" }}>
        <Heading as="h2" mb={6} color="red.600" textAlign="center">
          Créer votre compte !
        </Heading>
        
        {errors.general && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {errors.general}
          </Alert>
        )}

        <FormControl mb={4} isInvalid={!!errors.username}>
          <FormLabel>Nom d'utilisateur</FormLabel>
          <Input 
            name="username"
            placeholder="Votre nom d'utilisateur" 
            value={formData.username} 
            onChange={handleChange}
            bg="gray.50"
          />
          <FormErrorMessage>{errors.username}</FormErrorMessage>
        </FormControl>

        <FormControl mb={4} isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input 
            name="email"
            type="email"
            placeholder="Votre adresse email" 
            value={formData.email} 
            onChange={handleChange}
            bg="gray.50"
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl mb={4} isInvalid={!!errors.password}>
          <FormLabel>Mot de passe</FormLabel>
          <Input 
            name="password"
            type="password"
            placeholder="Votre mot de passe" 
            value={formData.password} 
            onChange={handleChange}
            bg="gray.50"
          />
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>

        <FormControl mb={6} isInvalid={!!errors.confirmPassword}>
          <FormLabel>Confirmer le mot de passe</FormLabel>
          <Input 
            name="confirmPassword"
            type="password"
            placeholder="Confirmez votre mot de passe" 
            value={formData.confirmPassword} 
            onChange={handleChange}
            bg="gray.50"
          />
          <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
        </FormControl>

        <Button 
          colorScheme="red" 
          w="full" 
          type="submit"
          isLoading={isSubmitting}
          loadingText="En cours..."
        >
          S'inscrire
        </Button>
      </Box>
    </VStack>
  );
};

export default Register;
