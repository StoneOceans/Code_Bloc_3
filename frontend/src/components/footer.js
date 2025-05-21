import React from "react";
import {
  Box,
  Flex,
  Container,
  HStack,
  Text,
  Image,
  Stack,
  Link as ChakraLink,
  Divider,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

function Footer() {
  return (
    <Box as="footer" bg="black" color="white" py={8}>
      <Container maxW="6xl">
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="start"
        >
          <Image
            src="/images/rings.png"
            alt="Olympic Rings"
            w="64px"
            mb={{ base: 4, md: 0 }}
          />

          <Flex
            direction={{ base: "column", md: "row" }}
            gap={{ base: 8, md: 16 }}
          >
            <Box>
              <Text fontWeight="bold" mb={2}>
                Jeux Olympiques
              </Text>
              <Stack spacing={1}>
                <ChakraLink href="#" _hover={{ textDecoration: "underline" }}>
                  Milan Cortina 2026
                </ChakraLink>
                <ChakraLink href="#">Résultats & Médailles</ChakraLink>
                <ChakraLink href="#">Replays & meilleurs moments</ChakraLink>
                <ChakraLink href="#">Tous les Jeux Olympiques</ChakraLink>
              </Stack>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>
                Olympic Channel
              </Text>
              <Stack spacing={1}>
                <ChakraLink href="#">Chaînes TV</ChakraLink>
                <ChakraLink href="#">Événements en direct</ChakraLink>
                <ChakraLink href="#">Séries Originales</ChakraLink>
                <ChakraLink href="#">Enterprise</ChakraLink>
              </Stack>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>
                Infos
              </Text>
              <Stack spacing={1}>
                <ChakraLink href="#">Podcast</ChakraLink>
                <ChakraLink href="#">Thématiques</ChakraLink>
              </Stack>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>
                Explorer
              </Text>
              <Stack spacing={1}>
                <ChakraLink href="#">Athlètes</ChakraLink>
                <ChakraLink href="#">Sports</ChakraLink>
              </Stack>
            </Box>
          </Flex>
        </Flex>

        <Divider my={6} borderColor="gray.700" />

        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "center", md: "start" }}
          textAlign={{ base: "center", md: "left" }}
        >
          <HStack spacing={4} mb={{ base: 4, md: 0 }} wrap="wrap">
            {[
              "Comité International Olympique",
              "Musée",
              "Boutique",
              "Nous concernant",
              "Centre de contact",
              "Plan du site",
              "Carrières",
            ].map((label) => (
              <Text key={label} fontSize="sm">
                {label}
              </Text>
            ))}
          </HStack>

          <Text fontSize="sm" color="gray.400">
            © 2024 Info Event —{" "}
            <ChakraLink
              as={RouterLink}
              to="/mentionslegales"
              color="red.500"
              _hover={{ textDecoration: "underline" }}
            >
              Mentions légales
            </ChakraLink>
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}

export default Footer;
