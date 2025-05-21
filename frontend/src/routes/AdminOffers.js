import { Box, Button, Heading, Input, Text, VStack, HStack, Grid, Divider } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [newOffer, setNewOffer] = useState({
    title: '', description: '', capacity: '', price: ''
  });

  // ─── Récupère la liste des offres
  const fetchOffers = async () => {
    try {
      const { data } = await axios.get(
        'https://sitedesjo.dev-data.eu/api/offers/',
        { withCredentials: true }
      );
      setOffers(data);
    } catch (err) {
      console.error("Erreur récupération offres :", err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // ─── Ajout d’une offre
  const handleAddOffer = async () => {
    try {
      const payload = {
        ...newOffer,
        capacity: Number(newOffer.capacity),
        price: Number(newOffer.price),
      };
      await axios.post(
        'https://sitedesjo.dev-data.eu/api/offers/',
        payload,
        { withCredentials: true }
      );
      alert('Offre ajoutée !');
      setNewOffer({ title: '', description: '', capacity: '', price: '' });
      fetchOffers();
    } catch (err) {
      console.error("Erreur ajout offre :", err);
      alert("Erreur lors de l'ajout");
    }
  };

  // ─── Suppression d’une offre
  const handleDeleteOffer = async (id) => {
    if (!window.confirm("Supprimer cette offre ?")) return;
    try {
      await axios.delete(
        `https://sitedesjo.dev-data.eu/api/offers/${id}/`,
        { withCredentials: true }
      );
      fetchOffers();
    } catch (err) {
      console.error("Erreur suppression offre :", err);
      alert("Impossible de supprimer");
    }
  };

  return (
    <>
      <Navbar />
      <VStack spacing={8} p={8} bg="gray.50" minH="100vh">
        <Heading color="red.600" textAlign="center">
          Administration des Offres
        </Heading>

        {/* Formulaire d’ajout */}
        <Box p={6} borderWidth="1px" borderRadius="md" bg="white" w="100%" maxW="800px" boxShadow="lg">
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
              placeholder="Prix (€)"
              type="number"
              value={newOffer.price}
              onChange={(e) => setNewOffer({ ...newOffer, price: e.target.value })}
            />
            <Button onClick={handleAddOffer} colorScheme="green" size="md">
              Ajouter Offre
            </Button>
          </VStack>
        </Box>

        {/* Liste des offres */}
        <Heading size="lg" color="red.500">
          Liste des Offres
        </Heading>
        <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6} w="100%" maxW="1200px">
          {offers.map((offer) => (
            <Box key={offer.id} p={6} borderWidth="1px" borderRadius="md" bg="white" boxShadow="md">
              <VStack align="start" spacing={3}>
                <Heading size="md" color="red.600">{offer.title}</Heading>
                <Text>{offer.description}</Text>
                <Text>Capacité : {offer.capacity} personne(s)</Text>
                <Text fontWeight="bold" color="teal.500">Prix : {offer.price} €</Text>
                <Divider />
                <HStack justify="flex-end" w="100%">
                  <Button size="sm" colorScheme="red" onClick={() => handleDeleteOffer(offer.id)}>
                    Supprimer
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
