import { useState, useContext } from 'react';
import { CartContext } from '../CartContext';

function MiniCarrito() {
  const [abierto, setAbierto] = useState(false);
  const { carrito, eliminarDelCarrito, total, totalItems } = useContext(CartContext);

  return (
    <>
      <button
        className="mini-carrito-btn"
        onClick={() => setAbierto(!abierto)}
        title="Ver carrito"
      >
        🛒
        {totalItems > 0 && (
          <span className="mini-carrito-badge">{totalItems}</span>
        )}
      </button>

      {abierto && (
        <div className="mini-carrito-overlay" onClick={() => setAbierto(false)} />
      )}

      <div className={`mini-carrito-drawer ${abierto ? 'mini-carrito-drawer--abierto' : ''}`}>
        <div className="mini-carrito-header">
          <h3>🛒 Tu Carrito</h3>
          <button className="mini-carrito-cerrar" onClick={() => setAbierto(false)}>✕</button>
        </div>

        {carrito.length === 0 ? (
          <p className="mini-carrito-vacio">No hay productos aún.</p>
        ) : (
          <>
            <div className="mini-carrito-lista">
              {carrito.map((item) => (
                <div key={item.id} className="mini-carrito-item">
                  <img src={item.image} alt={item.title} className="mini-carrito-img" />
                  <div className="mini-carrito-info">
                    <p className="mini-carrito-titulo">{item.title}</p>
                    <p className="mini-carrito-precio">
                      ${(item.price * item.cantidad).toFixed(2)}
                      <span className="mini-carrito-cantidad"> x{item.cantidad}</span>
                    </p>
                  </div>
                  <button
                    className="mini-carrito-eliminar"
                    onClick={() => eliminarDelCarrito(item.id)}
                    title="Eliminar"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
            <div className="mini-carrito-total">
              <span>Total</span>
              <span className="mini-carrito-total-monto">${total.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default MiniCarrito;
