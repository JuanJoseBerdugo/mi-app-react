import { NavLink } from 'react-router-dom';

function Header({ authUser, onOpenLogin, onOpenRegister, onLogout }) {
  return (
    <header className="site-header">
      <NavLink to="/" className="site-logo" style={{ textDecoration: 'none' }}>
        Bernu.ly
      </NavLink>

      <nav className="site-nav">
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
        {authUser && <span className="header-user-pill">{authUser.displayName}</span>}
        <button
          type="button"
          className="boton-borde"
          onClick={authUser ? onLogout : onOpenLogin}
        >
          {authUser ? 'Cerrar sesión' : 'Iniciar sesión'}
        </button>
        {!authUser && (
          <button type="button" className="boton-amarillo" onClick={onOpenRegister}>
            Registrarse
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
