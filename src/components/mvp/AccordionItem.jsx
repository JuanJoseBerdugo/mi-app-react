import { useState } from 'react';

function AccordionItem({ pregunta, respuesta }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="accordion-item">
      <button className="accordion-btn" onClick={() => setAbierto(!abierto)}>
        <span>{pregunta}</span>
        <span className={`accordion-icono ${abierto ? 'abierto' : ''}`}>▼</span>
      </button>
      {abierto && (
        <div className="accordion-contenido">
          <p>{respuesta}</p>
        </div>
      )}
    </div>
  );
}

export default AccordionItem;
