import { useState } from 'react';

export default function Semaforo() {
  const [colorLuz, setColorLuz] = useState('rojo');

  const manejarCiclo = () => {
    setColorLuz(colorLuz === 'rojo' ? 'verde' : 'rojo');
  };

  return (
    <div className="contenedor-semaforo">
      <div className={`caja-luz ${colorLuz}`}>
        <div className="circulo-brillante"></div>
      </div>
      <button onClick={manejarCiclo}>
        {colorLuz === 'rojo' ? 'Poner Verde' : 'Poner Rojo'}
      </button>
    </div>
  );
}
