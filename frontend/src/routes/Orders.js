import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Grid,
  Spinner,
  Divider,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import axios from "axios";
import Navbar from "../components/navbar";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "https://sitedesjo.dev-data.eu/api/orders/",
          { withCredentials: true }
        );
        setOrders(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des commandes.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />
      <VStack spacing={8} p={8}>
        <Heading as="h1" size="xl" color="red.600">
          Historique des commandes
        </Heading>

        {loading ? (
          <Spinner size="xl" color="red.500" />
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : orders.length === 0 ? (
          <Text fontSize="xl" color="gray.600">
            Aucune commande trouvée.
          </Text>
        ) : (
          <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6} w="100%">
            {orders.map((order) => {
              // Extraction des titres depuis la chaîne order.items
              const titles = [];
              const regex = /'title':\s*'([^']+)'/g;
              let match;
              while ((match = regex.exec(order.items)) !== null) {
                titles.push(match[1]);
              }

              return (
                <Box
                  key={order.id}
                  p={6}
                  bg="white"
                  borderWidth="1px"
                  borderRadius="md"
                  boxShadow="lg"
                >
                  <Heading as="h2" size="md" color="red.600">
                    Commande #{order.id} - {order.type_ticket}
                  </Heading>

                  {order.created_at && (
                    <Text fontSize="sm" color="gray.500">
                      Date : {new Date(order.created_at).toLocaleString()}
                    </Text>
                  )}

                  <Divider my={2} />

                  {/* Affichage des titres extraits */}
                  <Text mb={1} fontWeight="semibold">
                    Ticket(s) :
                  </Text>
                  {titles.length > 0 ? (
                    <UnorderedList pl={4} mb={2}>
                      {titles.map((t, i) => (
                        <ListItem key={i}>{t}</ListItem>
                      ))}
                    </UnorderedList>
                  ) : (
                    <Text mb={2}>Aucun titre trouvé</Text>
                  )}

                  <Box textAlign="center" mb={2}>
                    <img
                      src={`data:image/png;base64,${order.ticket}`}
                      alt="Ticket QR Code"
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "contain",
                      }}
                    />
                  </Box>

                  <Text mt={2} fontSize="lg" color="green.600">
                    Scannez ce QR code pour accéder à votre événement.
                  </Text>
                </Box>
              );
            })}
          </Grid>
        )}
      </VStack>
    </>
  );
};

export default Orders;
