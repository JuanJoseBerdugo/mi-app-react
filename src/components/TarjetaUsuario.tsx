import { useState, ChangeEvent } from "react";

interface UsuarioInfo {
  id: number;
  nombre: string;
  edad: number;
}

interface PropsTarjeta {
  usuario: UsuarioInfo;
  esPremium: boolean;
  onActivar: () => void;
}

export function TarjetaUsuario({ usuario, esPremium, onActivar }: PropsTarjeta) {
  const [editando, setEditando] = useState(false);
  const [apodo, setApodo] = useState("");

  const manejarCambio = (e: ChangeEvent<HTMLInputElement>) => {
    setApodo(e.target.value);
  };

  return (
    <div>
      <h2>{usuario.nombre}</h2>
      {esPremium ? <span> 👑 VIP</span> : <button onClick={onActivar}>Ser Premium</button>}
      <input value={apodo} onChange={manejarCambio} />
    </div>
  );
}
