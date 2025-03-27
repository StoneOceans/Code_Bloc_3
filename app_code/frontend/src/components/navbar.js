import { Flex, Heading, HStack, Button } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { logout } from "../endpoints/api";

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/login");
    }
  };

  return (
    <Flex
      as="nav"
      bg="red.600"
      color="white"
      align="center"
      justify="space-between"
      px={8}
      py={4}
    >
      <Heading size="md">Jeux Olympiques FR</Heading>

      <HStack spacing={6}>
        <Button
          as={RouterLink}
          to="/offers"
          variant="solid"
          bg="white"
          color="red.600"
          _hover={{ bg: "gray.200" }}
        >
          Offres
        </Button>

        <Button
          as={RouterLink}
          to="/cart"
          variant="solid"
          bg="white"
          color="red.600"
          _hover={{ bg: "gray.200" }}
        >
          Panier
        </Button>

        {isAuthenticated ? (
          <Button
            variant="solid"
            bg="white"
            color="red.600"
            _hover={{ bg: "gray.200" }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <Button
            as={RouterLink}
            to="/login"
            variant="solid"
            bg="white"
            color="red.600"
            _hover={{ bg: "gray.200" }}
          >
            Se Connecter
          </Button>
        )}
      </HStack>
    </Flex>
  );
};

export default Navbar;
