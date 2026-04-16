import { NavLink } from 'react-router-dom';

function Header({ logeado, setLogeado }) {
  return (
    <header>
      <NavLink to="/" className="logo" style={{ textDecoration: 'none' }}>
        Bernu.ly
      </NavLink>

      <nav>
        <ul>
          <li>
            <NavLink to="/ejercicios" className={({ isActive }) => isActive ? 'nav-activo' : ''}>
              Ejercicios
            </NavLink>
          </li>
          <li>
            <NavLink to="/mvp" className={({ isActive }) => isActive ? 'nav-activo' : ''}>
              MVP
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
