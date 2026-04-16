function CryptoCard({ nombre, simbolo, precio, cambio, icono }) {
  const esSubida = cambio >= 0;

  return (
    <div className="crypto-card">
      <div className="crypto-card-header">
        <span className="crypto-card-icono">{icono}</span>
        <div>
          <p className="crypto-card-nombre">{nombre}</p>
          <p className="crypto-card-simbolo">{simbolo}</p>
        </div>
      </div>
      <div className="crypto-card-footer">
        <p className="crypto-card-precio">{precio}</p>
        <span className={esSubida ? 'subida' : 'bajada'}>
          {esSubida ? '+' : ''}{cambio}%
        </span>
      </div>
    </div>
  );
}

export default CryptoCard;
