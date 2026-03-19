import TwitterBox from './TwitterBox';
import Comentarios from './Comentarios';
import Carrito from './Carrito';
import Semaforo from './Semaforo';
import TodoList from './TodoList';

function Ejercicios() {
  return (
    <main className="ejercicios-page">
      <div className="ejercicios-header">
        <h2>Ejercicios Prácticos</h2>
        <p>Componentes interactivos creados con React y useState</p>
      </div>
      <div className="ejercicios-grid">
        <TwitterBox />
        <Semaforo />
        <Comentarios />
        <Carrito />
        <TodoList />
      </div>
    </main>
  );
}

export default Ejercicios;
