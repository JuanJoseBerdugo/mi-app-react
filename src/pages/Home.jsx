import Hero from '../components/mvp/Hero';
import CryptoCard from '../components/mvp/CryptoCard';
import AccordionItem from '../components/mvp/AccordionItem';

const criptos = [
  { nombre: 'Bitcoin',  simbolo: 'BTC', precio: '$97,432.10', cambio: 2.34,  icono: '₿' },
  { nombre: 'Ethereum', simbolo: 'ETH', precio: '$3,210.55',  cambio: 1.78,  icono: 'Ξ' },
  { nombre: 'BNB',      simbolo: 'BNB', precio: '$612.30',    cambio: -0.45, icono: '◆' },
  { nombre: 'Solana',   simbolo: 'SOL', precio: '$186.74',    cambio: 4.12,  icono: '◎' },
];

const investigacion = [
  {
    pregunta: '¿Qué son las props en React y para qué sirven?',
    respuesta:
      'Son objetos que permiten pasar datos desde un componente padre a un componente hijo, funcionando como atributos o parámetros de entrada.',
  },
  {
    pregunta: '¿Qué diferencia hay entre state y props?',
    respuesta:
      'Las propiedades son inmutables y pasadas desde un componente padre como argumentos, mientras que el state (estado) es gestionado localmente dentro del propio componente y puede cambiar con el tiempo.',
  },
  {
    pregunta: '¿Por qué React utiliza una arquitectura basada en componentes?',
    respuesta:
      'Para dividir interfaces de usuario complejas en piezas pequeñas, independientes y reutilizables.',
  },
];

function Home() {
  return (
    <main>
      <Hero />

      <section className="cripto-cards-seccion">
        <h2 className="seccion-titulo">Top Criptomonedas</h2>
        <div className="cripto-cards-grid">
          {criptos.map((c) => (
            <CryptoCard key={c.simbolo} {...c} />
          ))}
        </div>
      </section>

      <section className="investigacion-seccion">
        <h2 className="seccion-titulo">📚 Investigación: React</h2>
        <div className="accordion">
          {investigacion.map((item, i) => (
            <AccordionItem key={i} pregunta={item.pregunta} respuesta={item.respuesta} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
