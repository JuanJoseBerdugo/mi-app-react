import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header'
import AuthModal from './components/AuthModal'
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

const AUTH_STORAGE_KEY = 'pokemon-market-auth-user';

function getStoredAuthUser() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);

    return rawAuth ? JSON.parse(rawAuth) : null;
  } catch {
    return null;
  }
}

function App() {
  const [authUser, setAuthUser] = useState(getStoredAuthUser);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const logeado = Boolean(authUser);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (authUser) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [authUser]);

  const openAuthModal = (mode) => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const handleAuthSubmit = ({ email, displayName }) => {
    setAuthUser({
      email,
      displayName,
      loggedAt: Date.now(),
    });
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    setAuthUser(null);
    setAuthModalOpen(false);
  };

  return (
    <CartProvider>
    <BrowserRouter>
      <Header
        authUser={authUser}
        onOpenLogin={() => openAuthModal('login')}
        onOpenRegister={() => openAuthModal('register')}
        onLogout={handleLogout}
      />
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

        {/* MVP — mercado de cartas Pokémon */}
        <Route
          path="/mvp"
          element={<Home authUser={authUser} onRequestLogin={() => openAuthModal('login')} />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {authModalOpen && (
        <AuthModal
          key={authModalMode}
          isOpen={authModalOpen}
          mode={authModalMode}
          onClose={closeAuthModal}
          onSubmit={handleAuthSubmit}
        />
      )}
    </BrowserRouter>
    </CartProvider>
  );
}

export default App;
