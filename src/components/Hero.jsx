import MercadosPopulares from './MercadosPopulares';

function Hero() {
  return (
    <section className="hero">
      <div>
        <h1>Compra y vende<br /><span>criptomonedas</span><br />con confianza</h1>
        <p>El exchange con mayor volumen del mundo. Opera Bitcoin, Ethereum, BNB y mas de 350 criptomonedas con las comisiones mas bajas del mercado.</p>
        <div className="hero-botones">
          <button className="boton-grande">Empezar ahora</button>
          <button className="boton-grande-borde">Ver mercados</button>
        </div>
      </div>

      <MercadosPopulares />
    </section>
  );
}

export default Hero;
