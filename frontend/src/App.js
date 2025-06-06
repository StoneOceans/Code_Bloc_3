import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import Login from './routes/login';
import Menu from './routes/menu';
import Register from './routes/register';
import Offers from './routes/Offers';
import AdminOffers from './routes/AdminOffers';
import Cart from './routes/Cart';
import Orders from './routes/Orders';
import PrivateRoute from './components/private_route';
import MentionsLegales from './routes/MentionsLegales';

import { AuthProvider } from './contexts/useAuth';
import { CartProvider } from './components/CartContext';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/' element={<Menu />} />
              <Route path='/mentionslegales' element={<MentionsLegales />} />
              <Route path='/offers' element={<Offers />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/orders' element={<PrivateRoute><Orders /></PrivateRoute>} />
              <Route path='/gestion/offers' element={<PrivateRoute><AdminOffers /></PrivateRoute>} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
