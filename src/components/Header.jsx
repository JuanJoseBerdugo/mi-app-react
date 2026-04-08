import { NavLink, Link } from 'react-router-dom';

function Header({ logeado, setLogeado }) {
  return (
    <header>
      <NavLink to="/" className="logo" style={{ textDecoration: 'none' }}>
        Bernu.ly
      </NavLink>

      <nav>
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-activo' : ''} end>
              Mercados
            </NavLink>
          </li>
          <li><Link to="/comprar">Comprar</Link></li>
          <li><Link to="/trading">Trading</Link></li>
          <li><Link to="/futuros">Futuros</Link></li>
          <li><Link to="/earn">Earn</Link></li>
          <li>
            <NavLink to="/ejercicios" className={({ isActive }) => isActive ? 'nav-activo' : ''}>
              Ejercicios
            </NavLink>
          </li>
          <li>
            <NavLink to="/store" className={({ isActive }) => isActive ? 'nav-activo' : ''}>
              FakeStore
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="botones-header">
        <button
          className="boton-borde"
          onClick={() => setLogeado(!logeado)}
        >
          {logeado ? 'Cerrar sesión' : 'Iniciar sesión'}
        </button>
        <button className="boton-amarillo">Registrarse</button>
      </div>
    </header>
  );
}

export default Header;
