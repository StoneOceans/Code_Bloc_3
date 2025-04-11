import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Spinner,
  Divider,
  Stack,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { FaMoneyCheckAlt, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { useCart } from "../components/CartContext";
import Navbar from "../components/navbar";
import { useAuth } from "../contexts/useAuth";

const MotionBox = motion(Box);

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();

  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + parseFloat(item.price || 0), 0);
  }, [cart]);

  const handlePaymentClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter d'abord pour procéder au paiement.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else {
      onOpen();
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert("Paiement réussi !");
      clearCart();
      onClose();
    }, 3000);
  };

  return (
    <>
      <Navbar />
      <Flex
        direction="column"
        align="center"
        justify="center"
        bgGradient="linear(to-b, gray.50, white)"
        minH="100vh"
        py={10}
        px={4}
      >
        <Heading mb={6} color="red.500" textAlign="center">
          <Icon as={FaMoneyCheckAlt} mr={2} /> Votre Panier
        </Heading>

        {cart.length === 0 ? (
          <Text fontSize="xl" color="gray.600">
            Votre panier est vide.
          </Text>
        ) : (
          <VStack spacing={4} w="full" maxW="600px">
            {cart.map((item) => (
              <MotionBox
                key={item.id}
                p={4}
                w="full"
                bg="white"
                borderWidth="1px"
                borderRadius="md"
                shadow="sm"
                borderColor="red.100"
                whileHover={{ scale: 1.02, boxShadow: "2xl" }}
                transition="all 0.2s ease-in-out"
              >
                <HStack justifyContent="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" fontSize="lg" color="red.600">
                      {item.title}
                    </Text>
                    <Text color="gray.700">{item.description}</Text>
                    <Text fontWeight="semibold" color="red.500">
                      Prix : {item.price} €
                    </Text>
                  </VStack>
                  <Button
                    colorScheme="red"
                    variant="outline"
                    size="sm"
                    leftIcon={<DeleteIcon />}
                    onClick={() => removeFromCart(item.id)}
                  >
                    Supprimer
                  </Button>
                </HStack>
              </MotionBox>
            ))}

            <Divider />

            <Stack spacing={4} w="full">
              <HStack justifyContent="space-between">
                <Text fontSize="xl" fontWeight="semibold">
                  Total
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="red.600">
                  {totalPrice.toFixed(2)} €
                </Text>
              </HStack>
              <HStack spacing={4} justifyContent="center">
                <Button
                  colorScheme="red"
                  variant="solid"
                  leftIcon={<FaTrash />}
                  onClick={clearCart}
                >
                  Vider le panier
                </Button>
                <Button
                  colorScheme="red"
                  variant="solid"
                  leftIcon={<FaMoneyCheckAlt />}
                  onClick={handlePaymentClick}
                >
                  Procéder au paiement
                </Button>
              </HStack>
              {isProcessing && (
                <HStack justifyContent="center">
                  <Spinner color="red.500" />
                  <Text>Traitement du paiement en cours...</Text>
                </HStack>
              )}
            </Stack>
          </VStack>
        )}
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Paiement</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="cardNumber" mb={3}>
              <FormLabel>Numéro de carte</FormLabel>
              <Input placeholder="0000 0000 0000 0000" />
            </FormControl>
            <FormControl id="expiry" mb={3}>
              <FormLabel>Date d'expiration</FormLabel>
              <Input placeholder="MM/AA" />
            </FormControl>
            <FormControl id="cvv">
              <FormLabel>CVV</FormLabel>
              <Input placeholder="123" />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Annuler
            </Button>
            <Button 
              colorScheme="red" 
              onClick={handlePayment}
              isLoading={isProcessing}
              loadingText="Traitement..."
            >
              Confirmer Paiement
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Cart;
