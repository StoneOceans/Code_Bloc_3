import { Box, Button, Heading, Text, VStack, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../components/CartContext";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/offers/', { withCredentials: true });
        setOffers(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des offres :", error);
      }
    };

    fetchOffers();
  }, []);

  return (
    <VStack spacing={6} p={4}>
      <Heading>Offres Disponibles</Heading>
      {offers.map((offer) => (
        <Box key={offer.id} p={4} borderWidth="1px" borderRadius="md" w="100%">
          <HStack justifyContent="space-between">
            <VStack align="start">
              <Heading size="md">{offer.title}</Heading>
              <Text>{offer.description}</Text>
              <Text>Capacité : {offer.capacity} personne(s)</Text>
              <Text>Prix : {offer.price} €</Text>
            </VStack>
            <Button colorScheme="teal" onClick={() => addToCart(offer)}>
              Ajouter dans le panier
            </Button>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

export default Offers;
