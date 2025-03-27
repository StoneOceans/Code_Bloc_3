import { Box, Button, Heading, Text, VStack, HStack } from "@chakra-ui/react";
import { useCart } from '../components/CartContext';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  return (
    <VStack spacing={4} p={4}>
      <Heading>Panier</Heading>
      {cart.length === 0 ? (
        <Text>Votre panier est vide.</Text>
      ) : (
        cart.map((item) => (
          <Box key={item.id} p={4} borderWidth="1px" borderRadius="md" w="100%">
            <HStack justifyContent="space-between">
              <VStack align="start">
                <Text fontWeight="bold">{item.title}</Text>
                <Text>{item.description}</Text>
                <Text>Prix : {item.price} €</Text>
              </VStack>
              <Button colorScheme="red" onClick={() => removeFromCart(item.id)}>
                Supprimer
              </Button>
            </HStack>
          </Box>
        ))
      )}
      {cart.length > 0 && (
        <Button colorScheme="blue" onClick={clearCart}>
          Vider le panier
        </Button>
      )}
    </VStack>
  );
};

export default Cart;
