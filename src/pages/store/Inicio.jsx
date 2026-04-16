import { Link } from 'react-router-dom';
import './Tienda.css';

function Inicio() {
  return (
    <div className="inicio-wrapper">
      <div className="inicio-hero">
        <span className="inicio-badge">Nueva Temporada</span>
        <h1 className="inicio-titulo">
          Todo lo que <span>necesitas</span>,<br />en un solo lugar.
        </h1>
        <p className="inicio-subtitulo">
          Explora nuestra colección de productos de alta calidad con los mejores precios del mercado.
        </p>
        <Link to="/store/products" className="boton-grande">
          Ver Catálogo
        </Link>
      </div>
    </div>
  );
}

export default Inicio;
