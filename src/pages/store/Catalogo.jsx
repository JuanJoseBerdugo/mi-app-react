import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import './Tienda.css';

function Catalogo() {
  const { datos, cargando, error } = useFetch('https://fakestoreapi.com/products');
  const navegar = useNavigate();

  if (cargando) return <div className="tienda-estado">Cargando productos...</div>;
  if (error) return <div className="tienda-estado tienda-error">Error al cargar productos.</div>;

  return (
    <div className="catalogo-wrapper">
      <h2 className="seccion-titulo">🛒 Catálogo de Productos</h2>
      <div className="catalogo-grid">
        {datos.map((producto) => (
          <div key={producto.id} className="producto-card">
            <div className="producto-imagen-wrapper">
              <img src={producto.image} alt={producto.title} className="producto-imagen" />
            </div>
            <div className="producto-info">
              <p className="producto-categoria">{producto.category}</p>
              <h3 className="producto-nombre">{producto.title}</h3>
              <p className="producto-precio">${producto.price}</p>
              <button
                className="boton-amarillo"
                onClick={() => navegar(`/store/product/${producto.id}`)}
              >
                Ver Más
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalogo;
