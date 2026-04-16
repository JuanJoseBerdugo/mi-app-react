import { useState } from 'react';
import { Link } from 'react-router-dom';
import TwitterBox from '../components/ejercicios/TwitterBox';
import Semaforo from '../components/ejercicios/Semaforo';
import Comentarios from '../components/ejercicios/Comentarios';
import CarritoEjercicio from '../components/ejercicios/CarritoEjercicio';
import TodoList from '../components/ejercicios/TodoList';

const ejercicios = [
  {
    id: 'twitter',
    titulo: 'Twitter Box',
    descripcion: 'Mini clon de Twitter con contador de caracteres y feed de tweets.',
    icono: '🐦',
    componente: <TwitterBox />,
  },
  {
    id: 'semaforo',
    titulo: 'Semáforo',
    descripcion: 'Componente de semáforo interactivo que alterna entre rojo y verde.',
    icono: '🚦',
    componente: <Semaforo />,
  },
  {
    id: 'comentarios',
    titulo: 'Comentarios',
    descripcion: 'Sistema de comentarios con avatares, likes y formulario.',
    icono: '💬',
    componente: <Comentarios />,
  },
  {
    id: 'carrito',
    titulo: 'Carrito de Compras',
    descripcion: 'Carrito estático con lista de productos y pago simulado.',
    icono: '🛒',
    componente: <CarritoEjercicio />,
  },
  {
    id: 'todolist',
    titulo: 'Lista de Tareas',
    descripcion: 'TodoList con categorías, filtros y eliminación de tareas.',
    icono: '✅',
    componente: <TodoList />,
  },
  {
    id: 'nexuscrypto',
    titulo: 'Nexus Crypto',
    descripcion: 'Simulador de trading: compra y vende Bitcoin, historial de movimientos.',
    icono: '₿',
    componente: null,
    ruta: '/nexuscrypto',
  },
  {
    id: 'fakestore',
    titulo: 'FakeStore (Tienda)',
    descripcion: 'Tienda con catálogo, detalle de producto, carrito y rutas protegidas.',
    icono: '🏪',
    componente: null,
    ruta: '/store',
  },
  {
    id: 'pokedex',
    titulo: 'Pokédex',
    descripcion: 'Lista paginada de Pokémon consumiendo la PokeAPI.',
    icono: '⚡',
    componente: null,
    ruta: '/pokedex',
  },
  {
    id: 'rickandmorty',
    titulo: 'Rick & Morty',
    descripcion: 'Buscador de personajes con la API de Rick & Morty.',
    icono: '🛸',
    componente: null,
    ruta: '/rickandmorty',
  },
];

function EjerciciosPanel() {
  const [abierto, setAbierto] = useState(null);

  const toggle = (id) => {
    setAbierto(abierto === id ? null : id);
  };

  return (
    <main className="ejercicios-panel-page">
      <div className="ejercicios-panel-header">
        <h2>Ejercicios Prácticos</h2>
        <p>Haz clic en cualquier ejercicio para verlo en acción</p>
      </div>

      <div className="ejercicios-panel-lista">
        {ejercicios.map((ej) => (
          <div key={ej.id} className="ejercicio-panel-item">
            <button
              className={`ejercicio-panel-btn ${abierto === ej.id ? 'ejercicio-panel-btn--activo' : ''}`}
              onClick={() => ej.componente ? toggle(ej.id) : null}
            >
              <div className="ejercicio-panel-info">
                <span className="ejercicio-panel-icono">{ej.icono}</span>
                <div>
                  <h3>{ej.titulo}</h3>
                  <p>{ej.descripcion}</p>
                </div>
              </div>
              {ej.componente ? (
                <span className={`ejercicio-panel-flecha ${abierto === ej.id ? 'ejercicio-panel-flecha--abierta' : ''}`}>
                  ▼
                </span>
              ) : (
                <Link to={ej.ruta} className="ejercicio-panel-link" onClick={(e) => e.stopPropagation()}>
                  Ir →
                </Link>
              )}
            </button>

            {ej.componente && abierto === ej.id && (
              <div className="ejercicio-panel-contenido">
                {ej.componente}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

export default EjerciciosPanel;
