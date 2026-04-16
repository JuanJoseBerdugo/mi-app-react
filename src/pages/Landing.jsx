import { Link } from 'react-router-dom';

function Landing() {
  return (
    <main className="landing-page">
      <div className="landing-content">
        <h1 className="landing-titulo">
          Bienvenido a <span>Bernu.ly</span>
        </h1>
        <p className="landing-subtitulo">¿A dónde quieres ir?</p>

        <div className="landing-cards">
          <Link to="/ejercicios" className="landing-card landing-card--ejercicios">
            <span className="landing-card-icono">🧪</span>
            <h2>Ejercicios</h2>
            <p>Componentes prácticos e interactivos creados con React</p>
            <span className="landing-card-arrow">→</span>
          </Link>

          <Link to="/mvp" className="landing-card landing-card--mvp">
            <span className="landing-card-icono">₿</span>
            <h2>MVP</h2>
            <p>Plataforma de criptomonedas — el entregable final</p>
            <span className="landing-card-arrow">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Landing;
