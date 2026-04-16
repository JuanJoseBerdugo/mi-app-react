import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import BarraPrecios from './components/mvp/BarraPrecios'
import Landing from './pages/Landing'
import EjerciciosPanel from './pages/EjerciciosPanel'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Inicio from './pages/store/Inicio'
import Catalogo from './pages/store/Catalogo'
import DetalleProducto from './pages/store/DetalleProducto'
import Carrito from './pages/store/Carrito'
import GuardianRuta from './components/store/GuardianRuta'
import StoreLayout from './components/store/StoreLayout'
import { CartProvider } from './CartContext'
import Store from './Store'
import Pokedex from './pages/Pokedex'
import RickAndMorty from './pages/RickAndMorty'
import NexusCrypto from './pages/NexusCrypto'

function App() {
  const [logeado, setLogeado] = useState(false);

  return (
    <CartProvider>
    <BrowserRouter>
      <Header logeado={logeado} setLogeado={setLogeado} />
      <Routes>
        {/* Landing — página principal */}
        <Route path="/" element={<Landing />} />

        {/* Ejercicios — prácticas */}
        <Route path="/ejercicios" element={<EjerciciosPanel />} />
        <Route path="/tienda" element={<Store />} />

        {/* FakeStore — ejercicio con rutas anidadas */}
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
        <Route path="/nexuscrypto" element={<NexusCrypto />} />

        {/* MVP — entregable de criptomonedas */}
        <Route path="/mvp" element={
          <>
            <BarraPrecios />
            <Home />
          </>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </CartProvider>
  );
}

export default App;