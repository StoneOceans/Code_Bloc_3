import { VStack, Heading, Text, Button } from "@chakra-ui/react";

import { useEffect, useState } from "react";


import { get_notes, logout} from "../endpoints/api";
import { useNavigate } from "react-router-dom";


const Menu = () => {
  const [notes, setNotes] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      const notes = await get_notes();
      setNotes(notes);
    };
    fetchNotes();
  }, []);


  const handleLogout = async () =>{
    const success = await logout();
        if (success) {
            nav('/login')
        }
  }


  return (
    <VStack>
      <Heading>Welcome back User!</Heading>
      <VStack>
        {notes.map((note) => (
          <Text key={note.id}>{note.description}</Text>
        ))}
      </VStack>
      <Button onClick={handleLogout} colorScheme="red">Logout</Button>
    </VStack>
  );
};

export default Menu;
