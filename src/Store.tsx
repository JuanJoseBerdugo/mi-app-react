import { useState, useEffect, ChangeEvent, useContext } from "react";
import { IProducto } from "./types";
import { CartContext } from "./CartContext";

export default function Store() {
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        const dataSegura = data as IProducto[];
        setProductos(dataSegura);
      });
  }, []);

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
  };

  const productosFiltrados = productos.filter((p) =>
    p.title.toLowerCase().includes(busqueda.toLowerCase())
  );

  const _contexto = useContext(CartContext);
  if (!_contexto) throw new Error("Fuera del provider!");
  const { carrito, total } = _contexto;

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={onSearch}
      />
      <div>
        {productosFiltrados.map((producto) => (
          <div key={producto.id}>
            <img src={producto.image} alt={producto.title} width={80} />
            <h3>{producto.title}</h3>
            <p>${producto.price}</p>
            <button onClick={() => _contexto.agregarAlCarrito({ ...producto, cantidad: 1 })}>
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
        <h2>Carrito</h2>
        {carrito.length === 0 ? (
          <p>El carrito esta vacío</p>
        ) : (
          <ul>
            {carrito.map((item) => (
              <li key={item.id}>
                {item.title} - {item.cantidad} x ${item.price}
              </li>
            ))}
          </ul>
        )}
        <h3>Total: ${total.toFixed(2)}</h3>
      </div>
    </div>
  );
}
