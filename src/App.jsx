import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import BarraPrecios from './components/BarraPrecios'
import Ejercicios from './components/Ejercicios'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Inicio from './pages/Inicio'
import Catalogo from './pages/Catalogo'
import DetalleProducto from './pages/DetalleProducto'
import Carrito from './pages/Carrito'
import GuardianRuta from './components/GuardianRuta'
import StoreLayout from './components/StoreLayout'
import { CartProvider } from './CartContext'
import Store from './Store'
import Pokedex from './pages/Pokedex'
import RickAndMorty from './pages/RickAndMorty'

function App() {
  const [logeado, setLogeado] = useState(false);

  return (
    <CartProvider>
    <BrowserRouter>
      <Header logeado={logeado} setLogeado={setLogeado} />
      <BarraPrecios />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ejercicios" element={<Ejercicios />} />
        <Route path="/tienda" element={<Store />} />

        {/* FakeStore — todas las rutas comparten StoreLayout (MiniCarrito flotante) */}
        <Route path="/store" element={<StoreLayout />}>
          <Route index element={<Inicio />} />
          <Route path="products" element={<Catalogo />} />
          <Route path="product/:id" element={<DetalleProducto />} />
          <Route
            path="cart"
            element={
              <GuardianRuta logeado={logeado}>
                <Carrito />
              </GuardianRuta>
            }
          />
        </Route>

        <Route path="/pokedex" element={<Pokedex />} />
        <Route path="/rickandmorty" element={<RickAndMorty />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </CartProvider>
  );
}

export default App;