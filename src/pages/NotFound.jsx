import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="notfound-wrapper">
      <div className="notfound-glow" />

      <div className="notfound-container">
        <div className="notfound-code">
          <span className="notfound-4">4</span>
          <span className="notfound-0">
            <span className="notfound-coin">₿</span>
          </span>
          <span className="notfound-4">4</span>
        </div>

        <h1 className="notfound-titulo">Página No Encontrada</h1>
        <p className="notfound-subtitulo">
          Esta ruta no existe en el mercado.<br />
          La dirección que buscas ha sido <span className="notfound-highlight">delistada</span>.
        </p>

        <div className="notfound-stats">
          <div className="notfound-stat">
            <span className="notfound-stat-label">Estado</span>
            <span className="notfound-stat-valor bajada">● Error 404</span>
          </div>
          <div className="notfound-stat">
            <span className="notfound-stat-label">Ruta</span>
            <span className="notfound-stat-valor">{window.location.pathname}</span>
          </div>
          <div className="notfound-stat">
            <span className="notfound-stat-label">Mercado</span>
            <span className="notfound-stat-valor subida">● Activo</span>
          </div>
        </div>

        <Link to="/" className="notfound-boton">
          Volver al Mercado
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
