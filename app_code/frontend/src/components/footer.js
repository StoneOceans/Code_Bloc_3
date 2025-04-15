import React from "react";
import {
  Box,
  Flex,
  Container,
  HStack,
  Text,
  Image,
  Stack,
  Link,
  Divider,
} from "@chakra-ui/react";

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
            src="/static/images/rings.png"
            alt="Olympic Rings"
            w="64px"
            mb={{ base: 4, md: 0 }}
          />

          <Flex direction={{ base: "column", md: "row" }} gap={{ base: 8, md: 16 }}>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Jeux Olympiques
              </Text>
              <Stack spacing={1}>
                <Link href="#">Milan Cortina 2026</Link>
                <Link href="#">Résultats & Médailles</Link>
                <Link href="#">Replays & meilleurs moments</Link>
                <Link href="#">Tous les Jeux Olympiques</Link>
              </Stack>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>
                Olympic Channel
              </Text>
              <Stack spacing={1}>
                <Link href="#">Chaînes TV</Link>
                <Link href="#">Événements en direct</Link>
                <Link href="#">Séries Originales</Link>
                <Link href="#">Enterprise</Link>
              </Stack>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>
                Infos
              </Text>
              <Stack spacing={1}>
                <Link href="#">Podcast</Link>
                <Link href="#">Thématiques</Link>
              </Stack>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>
                Explorer
              </Text>
              <Stack spacing={1}>
                <Link href="#">Athlètes</Link>
                <Link href="#">Sports</Link>
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
          <HStack spacing={4} mb={{ base: 4, md: 0 }}>
            <Text fontSize="sm">Comité International Olympique</Text>
            <Text fontSize="sm">Musée</Text>
            <Text fontSize="sm">Boutique</Text>
            <Text fontSize="sm">Nous concernant</Text>
            <Text fontSize="sm">Centre de contact</Text>
            <Text fontSize="sm">Plan du site</Text>
            <Text fontSize="sm">Carrières</Text>
          </HStack>

          <Text fontSize="sm">© 2025. All rights reserved</Text>
        </Flex>
      </Container>
    </Box>
  );
}

export default Footer;
