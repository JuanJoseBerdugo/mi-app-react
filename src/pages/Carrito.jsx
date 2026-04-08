import { useContext } from 'react';
import { CartContext } from '../CartContext';
import './Tienda.css';

function Carrito() {
  const { carrito, eliminarDelCarrito, total } = useContext(CartContext);

  if (carrito.length === 0) {
    return (
      <div className="carrito-wrapper">
        <div className="carrito-vacio">
          <span className="carrito-icono">🛒</span>
          <h2>Tu carrito está vacío</h2>
          <p>Aún no has agregado ningún producto.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-wrapper">
      <h2 className="seccion-titulo">🛒 Tu Carrito</h2>
      <div className="carrito-lista">
        {carrito.map((item) => (
          <div key={item.id} className="carrito-item">
            <img src={item.image} alt={item.title} className="carrito-item-imagen" />
            <div className="carrito-item-info">
              <p className="carrito-item-titulo">{item.title}</p>
              <p className="carrito-item-cantidad">Cantidad: {item.cantidad}</p>
            </div>
            <span className="carrito-item-precio">${(item.price * item.cantidad).toFixed(2)}</span>
            <button
              className="carrito-eliminar"
              onClick={() => eliminarDelCarrito(item.id)}
              title="Eliminar"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="carrito-total">
        <span>Total:</span>
        <span className="carrito-total-monto">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default Carrito;
