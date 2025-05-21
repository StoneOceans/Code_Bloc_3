import React from "react";
import { Box, Heading, Text, VStack, Link, Button } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

const MentionsLegales = () => {
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  return (
    <>
      <Navbar />
      <Box maxW="800px" mx="auto" py={16} px={4}>
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          mb={4}
          onClick={handleBack}
        >
          Retour
        </Button>

        <Heading mb={6} color="red.600">Mentions légales</Heading>
        <VStack align="start" spacing={6}>
          <Box>
            <Heading size="md">1. Éditeur du site</Heading>
            <Text>
              • Raison sociale : InfoEvent SAS<br />
              • Adresse : 12 avenue des Jeux, 75007 Paris<br />
              • Directeur de publication : José Dupont<br />
            </Text>
          </Box>

          <Box>
            <Heading size="md">2. Hébergeur</Heading>
            <Text>
              • Nom : Cloud <br />
              • Adresse : 2 rue Kellermann, 59100 Roubaix<br />
              • Téléphone : +33 1 23 45 10 07
            </Text>
          </Box>

          <Box>
            <Heading size="md">3. Contact</Heading>
            <Text>
              Pour toute question, contactez-nous :{' '}
              <Link href="mailto:support@infoevent.fr" color="teal.500">
                support@infoevent.fr
              </Link><br />
              Service client : +33 1 23 45 67 89
            </Text>
          </Box>

          <Box>
            <Heading size="md">4. Propriété intellectuelle</Heading>
            <Text>
              L’ensemble des contenus (textes, images, logos, vidéos) présents sur ce site est la propriété d’InfoEvent ou de ses partenaires et est protégé par le droit d’auteur. Toute reproduction, modification ou diffusion sans autorisation préalable est strictement interdite.
            </Text>
          </Box>

          <Box>
            <Heading size="md">5. Données personnelles & cookies</Heading>
            <Text>
              Conformément au RGPD, vous disposez d’un droit d’accès, de rectification et de suppression de vos données. Pour toute demande, écrivez à :{' '}
              <Link href="mailto:rgpd@infoevent.fr" color="teal.500">
                rgpd@infoevent.fr
              </Link>.<br />
              Ce site utilise des cookies pour améliorer votre expérience et mesurer l’audience.{' '}
              <Link href="/politique-cookies" color="teal.500">
                En savoir plus sur notre politique cookies
              </Link>.
            </Text>
          </Box>
        </VStack>
      </Box>
    </>
  );
};

export default MentionsLegales;
