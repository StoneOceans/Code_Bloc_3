import { VStack, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { get_notes } from "../endpoints/api";
import Navbar from "../components/navbar";

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
      {/* Our new red-themed navbar */}
      <Navbar />

      {/* Main content below the navbar */}
      <VStack spacing={8} p={8}>
        <Heading>Bienvenue sur Jeux Olympiques France</Heading>
        <Text>
          Découvrez nos offres exclusives pour vivre l'expérience olympique.
        </Text>

        {/* Example of rendering notes if needed */}
        {notes && notes.map((note) => (
          <Text key={note.id}>{note.description}</Text>
        ))}
      </VStack>
    </>
  );
};

export default Menu;
