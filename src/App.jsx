import './App.css'
import Header from './components/Header'
import BarraPrecios from './components/BarraPrecios'
import Hero from './components/Hero'
import TwitterBox from './components/TwitterBox'
import Comentarios from './components/Comentarios'

function App() {
  return (
    <div>
      <Header />
      <BarraPrecios />
      <main>
        <Hero />
        <TwitterBox />
        <Comentarios />
      </main>
    </div>
  );
}

export default App;