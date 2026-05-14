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
import { supabase } from './lib/supabase'
import { getPokemonProfile } from './services/ProfileService'

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const logeado = Boolean(authUser);

  useEffect(() => {
    let isMounted = true;

    async function syncSession(session) {
      if (!session?.user) {
        if (isMounted) {
          setAuthUser(null);
        }
        return;
      }

      const profile = await getPokemonProfile(session.user);

      if (isMounted) {
        setAuthUser(profile);
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      syncSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncSession(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const openAuthModal = (mode) => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const handleAuthSubmit = async ({ email, password, displayName }) => {
    if (authModalMode === 'register') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            xp_rank: 1000,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (!data.session) {
        return {
          notice: 'Cuenta creada. Revisa tu correo para confirmar el acceso antes de iniciar sesion.',
        };
      }

      const profile = await getPokemonProfile(data.user);
      setAuthUser(profile);
      setAuthModalOpen(false);
      return null;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    const profile = await getPokemonProfile(data.user);
    setAuthUser(profile);
    setAuthModalOpen(false);
    return null;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
          element={
            <Home
              authUser={authUser}
              onRequestLogin={() => openAuthModal('login')}
              onProfileUpdated={setAuthUser}
            />
          }
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
