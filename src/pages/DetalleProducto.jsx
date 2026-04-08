import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { CartContext } from '../CartContext';
import './Tienda.css';

function DetalleProducto() {
  const { id } = useParams();
  const { datos, cargando, error } = useFetch(`https://fakestoreapi.com/products/${id}`);
  const { agregarAlCarrito } = useContext(CartContext);
  const [agregado, setAgregado] = useState(false);

  if (cargando) return <div className="tienda-estado">Cargando producto...</div>;
  if (error) return <div className="tienda-estado tienda-error">Error al cargar el producto.</div>;

  const handleAgregar = () => {
    agregarAlCarrito({
      id: datos.id,
      title: datos.title,
      price: datos.price,
      image: datos.image,
      cantidad: 1,
    });
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  return (
    <div className="detalle-wrapper">
      <div className="detalle-container">
        <div className="detalle-imagen-wrapper">
          <img src={datos.image} alt={datos.title} className="detalle-imagen" />
        </div>
        <div className="detalle-info">
          <p className="producto-categoria">{datos.category}</p>
          <h2 className="detalle-titulo">{datos.title}</h2>
          <p className="detalle-descripcion">{datos.description}</p>
          <div className="detalle-footer">
            <span className="detalle-precio">${datos.price}</span>
            <div className="detalle-rating">
              <span>⭐ {datos.rating?.rate}</span>
              <span className="detalle-votos">({datos.rating?.count} votos)</span>
            </div>
          </div>
          <button
            className={`boton-grande ${agregado ? 'boton-agregado' : ''}`}
            onClick={handleAgregar}
          >
            {agregado ? '✓ Añadido al carrito' : 'Añadir al Carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetalleProducto;
