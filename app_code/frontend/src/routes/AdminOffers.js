import { Box, Button, Heading, Input, Text, VStack, HStack, Grid, Divider } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [newOffer, setNewOffer] = useState({ title: '', description: '', capacity: '', price: '' });

  const fetchOffers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/offers/', { withCredentials: true });
      setOffers(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des offres :", error);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleAddOffer = async () => {
    try {
      const offerData = {
        ...newOffer,
        capacity: Number(newOffer.capacity),
        price: Number(newOffer.price),
      };
      await axios.post(
        'http://127.0.0.1:8000/api/offers/',
        offerData,
        { withCredentials: true }
      );
      alert('Offre ajoutée avec succès');
      setNewOffer({ title: '', description: '', capacity: '', price: '' });
      fetchOffers();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'offre :", error);
      alert("Erreur lors de l'ajout de l'offre");
    }
  };

  return (
    <>
      <Navbar />
      <VStack spacing={8} p={8} bg="gray.50" minH="100vh">
        <Heading color="red.600" textAlign="center">
          Administration des Offres
        </Heading>

        <Box 
          p={6} 
          borderWidth="1px" 
          borderRadius="md" 
          bg="white" 
          w="100%" 
          maxW="800px" 
          boxShadow="lg"
        >
          <Heading size="md" mb={4} color="red.500">
            Ajouter une nouvelle offre
          </Heading>
          <VStack spacing={4}>
            <Input 
              placeholder="Titre" 
              value={newOffer.title} 
              onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })} 
            />
            <Input 
              placeholder="Description" 
              value={newOffer.description} 
              onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })} 
            />
            <Input 
              placeholder="Capacité" 
              type="number" 
              value={newOffer.capacity} 
              onChange={(e) => setNewOffer({ ...newOffer, capacity: e.target.value })} 
            />
            <Input 
              placeholder="Prix" 
              type="number" 
              value={newOffer.price} 
              onChange={(e) => setNewOffer({ ...newOffer, price: e.target.value })} 
            />
            <Button onClick={handleAddOffer} colorScheme="green" size="md">
              Ajouter Offre
            </Button>
          </VStack>
        </Box>

        <Heading size="lg" color="red.500">
          Liste des Offres
        </Heading>

        <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6} w="100%" maxW="1200px">
          {offers.map((offer) => (
            <Box 
              key={offer.id} 
              p={6} 
              borderWidth="1px" 
              borderRadius="md" 
              bg="white" 
              boxShadow="md"
            >
              <VStack align="start" spacing={3}>
                <Heading size="md" color="red.600">
                  {offer.title}
                </Heading>
                <Text>{offer.description}</Text>
                <Text>Capacité : {offer.capacity} personne(s)</Text>
                <Text fontWeight="bold" color="teal.500">
                  Prix : {offer.price} €
                </Text>
                <Divider />
                <HStack justifyContent="flex-end" w="100%">
                  <Button colorScheme="blue" size="sm">
                    Modifier
                  </Button>
                </HStack>
              </VStack>
            </Box>
          ))}
        </Grid>
      </VStack>
    </>
  );
};

export default AdminOffers;
