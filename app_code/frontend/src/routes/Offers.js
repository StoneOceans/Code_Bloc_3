import { Box, Button, Heading, Text, VStack, Grid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../components/CartContext";
import Navbar from "../components/navbar";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/offers/",
          { withCredentials: true }
        );
        setOffers(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des offres :", error);
      }
    };

    fetchOffers();
  }, []);

  return (
    <>
      <Navbar />
      <VStack spacing={8} p={8}>
        <Heading as="h1" size="xl" color="red.600">
          Offres Disponibles
        </Heading>
        <Grid
          templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
          gap={6}
          w="100%"
        >
          {offers.map((offer) => (
            <Box
              key={offer.id}
              p={6}
              borderWidth="1px"
              borderRadius="md"
              bg="white"
              boxShadow="lg"
              transition="transform 0.2s, box-shadow 0.2s"
              _hover={{ transform: "scale(1.02)", boxShadow: "2xl" }}
            >
              <VStack align="start" spacing={4}>
                <Heading size="md" color="red.600">
                  {offer.title}
                </Heading>
                <Text>{offer.description}</Text>
                <Text>Capacité : {offer.capacity} personne(s)</Text>
                <Text fontWeight="bold" color="teal.500">
                  Prix : {offer.price} €
                </Text>
                <Button
                  colorScheme="teal"
                  alignSelf="flex-end"
                  onClick={() => addToCart(offer)}
                >
                  Ajouter dans le panier
                </Button>
              </VStack>
            </Box>
          ))}
        </Grid>
      </VStack>
    </>
  );
};

export default Offers;
