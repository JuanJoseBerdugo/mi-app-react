
import { useState } from "react";

export function TarjetaUsuario({ usuario, esPremium, onActivar }) {
  const [editando, setEditando] = useState(false);
  const [apodo, setApodo] = useState("");

  const manejarCambio = (e) => {
    setApodo(e.target.value);
  };

  return (
    <div>
      <h2>{usuario.nombre}</h2>
      {esPremium ? <span> 👑 VIP</span> : <button onClick={onActivar}>Ser Premium</button>}
      <input value={apodo} onChange={manejarCambio} />
    </div>
  )
}
