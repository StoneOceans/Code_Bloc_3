import './App.css';

import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import Login from './routes/login';
import Menu from './routes/menu';
import Register from './routes/register';
import PrivateRoute from './components/private_route';

import { AuthProvider } from './contexts/useAuth';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/' element={<PrivateRoute><Menu /></PrivateRoute>} />
        </Routes>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
