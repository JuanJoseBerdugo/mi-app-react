function Header({ activeTab, onTabChange }) {
  return (
    <header>
      <p className="logo" onClick={() => onTabChange('mvp')} style={{ cursor: 'pointer' }}>
        Bernu.ly
      </p>

      <nav>
        <ul>
          <li>
            <a href="#" className={activeTab === 'mvp' ? 'nav-activo' : ''} onClick={(e) => { e.preventDefault(); onTabChange('mvp'); }}>
              Mercados
            </a>
          </li>
          <li><a href="#">Comprar</a></li>
          <li><a href="#">Trading</a></li>
          <li><a href="#">Futuros</a></li>
          <li><a href="#">Earn</a></li>
          <li>
            <a href="#" className={activeTab === 'ejercicios' ? 'nav-activo' : ''} onClick={(e) => { e.preventDefault(); onTabChange('ejercicios'); }}>
              Ejercicios
            </a>
          </li>
        </ul>
      </nav>

      <div className="botones-header">
        <button className="boton-borde">Iniciar sesión</button>
        <button className="boton-amarillo">Registrarse</button>
      </div>
    </header>
  );
}

export default Header;
