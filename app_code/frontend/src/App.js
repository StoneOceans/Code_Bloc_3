import './App.css';

import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import Login from './routes/login';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
