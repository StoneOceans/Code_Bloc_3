import React, { useEffect, useState } from "react";
import { VStack, Box, Heading, Text, Image, Divider, Flex , Button} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { get_notes } from "../endpoints/api";

const MotionImage = motion(Image);

const Menu = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const notesData = await get_notes();
      setNotes(notesData);
    };
    fetchNotes();
  }, []);

  return (
    <>
      <Navbar />

      <Box position="relative" overflow="hidden">
        <MotionImage
          src="/images/PARIS.png"
          alt="Paris"
          w="100vw"
          h="80vh"
          objectFit="cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </Box>

      <VStack spacing={10} p={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" color="red.500">
            Bienvenue sur Jeux Olympiques France
          </Heading>
          <Text fontSize="lg" mt={4}>
            Découvrez ici nos offres exclusives pour vivre la meilleur expérience olympique !!
          </Text>
        </Box>

        <Box textAlign="center">
          <Button 
            as="a"
            href="#sitesEmblematiques"
            size="lg"
            variant="solid"
            colorScheme="red"
            bgGradient="linear(to-r, red.500, red.700)"
            _hover={{ bgGradient: "linear(to-r, red.600, red.800)", transform: "scale(1.05)" }}
            transition="all 0.3s ease"
          >
            En savoir plus !
          </Button>
        </Box>


        <Box id="sitesEmblematiques" p={4}>
          <Heading as="h2" size="lg" color="red.600" mb={4}>
            Des sites emblématiques
          </Heading>
          <Text fontSize="md" mb={4}>
            Paris 2024 a transformé les sites les plus emblématiques de la Ville Lumière en enceintes sportives, comme le monde ne les avait jamais vus auparavant. De la compétition de volleyball de plage sous la Tour Eiffel aux sports équestres dans l’ombre du Château de Versailles, en passant par l’escrime au Grand Palais, plusieurs des lieux les plus connus de Paris sont devenus l’épicentre des compétitions olympiques. Des millions de spectateurs ont ainsi pu découvrir la capitale française sous un nouveau jour.
          </Text>
          <Divider mb={4} />
          <Heading as="h2" size="lg" color="red.600" mb={4}>
            La parité de genre sur le terrain
          </Heading>
          <Text fontSize="md">
            Conformément à son slogan « des Jeux grands ouverts », Paris 2024 ont été les premiers Jeux Olympiques de l’histoire à atteindre la parité de genre. Sur les 10 500 places de quota disponibles pour les athlètes, le Comité International Olympique en a distribué un nombre égal aux athlètes féminins et masculins. Parallèlement, la cérémonie d’ouverture a vu 96 % des comités nationaux olympiques choisir deux athlètes - une femme et un homme - pour porter le drapeau de leur pays respectif.
          </Text>
        </Box>

        <Box p={4}>
          <Heading as="h2" size="xl" color="blue.600" mb={6}>
            Natation
          </Heading>
          <Flex 
            direction={{ base: "column", md: "row" }} 
            align="center"
            justify="center"
            gap={8}
          >
            <Image 
              src="/images/natation.jpg" 
              alt="Natation" 
              maxW={{ base: "100%", md: "500px" }}
              borderRadius="md"
              boxShadow="2xl"
            />
            <Text fontSize="lg" maxW="600px">
              La natation est l’une des disciplines les plus attendues des Jeux Olympiques car elle combine vitesse, technique et endurance. Les épreuves se déroulent en piscine olympique pour le crawl, le dos, la brasse et le papillon, ainsi qu’en eau libre pour le marathon. Les nageurs et nageuses, issus de tous les continents, rivalisent pour des performances spectaculaires, suscitant l’enthousiasme du public.
            </Text>
          </Flex>
        </Box>

        <Box p={4}>
          <Heading as="h2" size="xl" color="green.600" mb={6}>
            Athlétisme
          </Heading>
          <Flex 
            direction={{ base: "column", md: "row" }} 
            align="center"
            justify="center"
            gap={8}
          >
            <Image 
              src="/images/athletisme.jpg" 
              alt="Athlétisme" 
              maxW={{ base: "100%", md: "500px" }}
              borderRadius="md"
              boxShadow="2xl"
            />
            <Text fontSize="lg" maxW="600px">
              L’athlétisme est le cœur historique des Jeux Olympiques, rassemblant les épreuves de course, de saut et de lancer. Au stade, les athlètes s’affrontent dans des épreuves variées, du 100 mètres au marathon, en passant par le saut en hauteur et le lancer de disque. C’est une discipline qui célèbre la polyvalence et la performance pure, offrant chaque fois des moments de grande intensité.
            </Text>
          </Flex>
        </Box>

        {notes.length > 0 && (
          <Box p={4}>
            <Heading as="h2" size="lg" color="purple.600" mb={4}>
              Notes
            </Heading>
            {notes.map((note) => (
              <Text key={note.id} fontSize="md" mb={2}>
                {note.description}
              </Text>
            ))}
          </Box>
        )}
      </VStack>

      <Footer />
    </>
  );
};

export default Menu;
