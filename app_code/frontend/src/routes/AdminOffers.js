import { Box, Button, Heading, Input, Text, VStack, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

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
      const response = await axios.post(
        'http://127.0.0.1:8000/api/offers/',
        newOffer,
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
    <VStack spacing={4} p={4}>
      <Heading>Administration des Offres</Heading>
      <Box p={4} borderWidth="1px" borderRadius="md" w="100%">
        <Heading size="sm">Ajouter une nouvelle offre</Heading>
        <VStack spacing={3} mt={2}>
          <Input placeholder="Titre" value={newOffer.title} onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })} />
          <Input placeholder="Description" value={newOffer.description} onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })} />
          <Input placeholder="Capacité" type="number" value={newOffer.capacity} onChange={(e) => setNewOffer({ ...newOffer, capacity: e.target.value })} />
          <Input placeholder="Prix" type="number" value={newOffer.price} onChange={(e) => setNewOffer({ ...newOffer, price: e.target.value })} />
          <Button onClick={handleAddOffer} colorScheme="green">Ajouter Offre</Button>
        </VStack>
      </Box>
      <Heading size="md">Liste des Offres</Heading>
      {offers.map((offer) => (
        <Box key={offer.id} p={4} borderWidth="1px" borderRadius="md" w="100%">
          <HStack justifyContent="space-between">
            <VStack align="start">
              <Text fontWeight="bold">{offer.title}</Text>
              <Text>{offer.description}</Text>
              <Text>Capacité : {offer.capacity}</Text>
              <Text>Prix : {offer.price} €</Text>
            </VStack>
            <Button colorScheme="blue">Modifier</Button>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

export default AdminOffers;
