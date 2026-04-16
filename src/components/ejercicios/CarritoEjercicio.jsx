import { useState } from 'react';

const cartItems = [
  { id: 1, nombre: 'Ia Para Vibe-Dugo', precio: 2.00 },
  { id: 2, nombre: 'Manos Para Vivalex', precio: 200.00 },
  { id: 3, nombre: 'Queso Para La Ratica', precio: 85.00 },
];

function CarritoEjercicio() {
  const [pagado, setPagado] = useState(false);
  const total = cartItems.reduce((acc, item) => acc + item.precio, 0);

  return (
    <section className="carrito-seccion">
      <div className="carrito-caja">
        {pagado ? (
          <div className="carrito-gracias">
            <span>✅</span>
            <h2>¡Gracias por tu compra!</h2>
            <p>Tu pedido esta siendo procesado</p>
          </div>
        ) : (
          <>
            <h2 className="carrito-titulo">Tu Carrito</h2>
            <hr className="carrito-hr" />
            <ul className="carrito-lista">
              {cartItems.map((item) => (
                <li key={item.id} className="carrito-item">
                  <span>{item.nombre}</span>
                  <span>${item.precio.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="carrito-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="carrito-btn-pagar" onClick={() => setPagado(true)}>
               Pagar Ahora
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default CarritoEjercicio;
