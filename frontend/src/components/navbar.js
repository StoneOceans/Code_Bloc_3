import { Flex, Heading, HStack, Button, Icon, Link } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { logout } from "../endpoints/api";
import { GiMedal } from "react-icons/gi";


const Navbar = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  
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
      bgGradient="linear(to-r, red.400, red.500, red.600)"
      color="white"
      align="center"
      justify="space-between"
      px={8}
      py={4}
      boxShadow="md"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
        <HStack>
          <Icon as={GiMedal} w={8} h={8} />
          <Heading size="md" fontWeight="bold">
            Jeux Olympiques FR
          </Heading>
        </HStack>
      </Link>
      
      <HStack spacing={6}>
        <Button
          as={RouterLink}
          to="/"
          variant="ghost"
          color="white"
          _hover={{ bg: "whiteAlpha.300", color: "blackAlpha.700" }}
        >
          Menu
        </Button>
        <Button
          as={RouterLink}
          to="/offers"
          variant="ghost"
          color="white"
          _hover={{ bg: "whiteAlpha.300", color: "blackAlpha.700" }}
        >
          Offres
        </Button>
        <Button
          as={RouterLink}
          to="/cart"
          variant="ghost"
          color="white"
          _hover={{ bg: "whiteAlpha.300", color: "blackAlpha.700" }}
        >
          Panier
        </Button>
        {isAuthenticated && (
          <Button
            as={RouterLink}
            to="/orders"
            variant="ghost"
            color="white"
            _hover={{ bg: "whiteAlpha.300", color: "blackAlpha.700" }}
          >
            Commandes
          </Button>
        )}

        {isAuthenticated && isAdmin && (
          <Button
            as={RouterLink}
            to="/gestion/offers"
            variant="ghost"
            color="yellow.300"
            _hover={{ bg: 'whiteAlpha.300', color: 'blackAlpha.700' }}
          >
            Admin Offres
          </Button>
        )}

      </HStack>

      <HStack spacing={4}>
        {!isAuthenticated && (
          <Button
            as={RouterLink}
            to="/login"
            variant="ghost"
            color="white"
            _hover={{ bg: "whiteAlpha.300", color: "blackAlpha.700" }}
          >
            Se Connecter
          </Button>
        )}
        {isAuthenticated && (
          <Button
            variant="ghost"
            color="white"
            _hover={{ bg: "whiteAlpha.300", color: "blackAlpha.700" }}
            onClick={handleLogout}
          >
            Se Déconnecter
          </Button>
        )}
      </HStack>
    </Flex>
  );
};

export default Navbar;
