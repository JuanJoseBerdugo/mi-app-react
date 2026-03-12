function BarraPrecios() {
  return (
    <section className="barra-precios">
      <div>
        <small style={{ color: '#848E9C' }}>BTC/USDT</small>
        <strong>$97,432.10</strong>
        <span className="subida"> +2.34%</span>
      </div>
      <div>
        <small style={{ color: '#848E9C' }}>ETH/USDT</small>
        <strong>$3,210.55</strong>
        <span className="subida"> +1.78%</span>
      </div>
      <div>
        <small style={{ color: '#848E9C' }}>BNB/USDT</small>
        <strong>$612.30</strong>
        <span className="bajada"> -0.45%</span>
      </div>
      <div>
        <small style={{ color: '#848E9C' }}>SOL/USDT</small>
        <strong>$186.74</strong>
        <span className="subida"> +4.12%</span>
      </div>
      <div>
        <small style={{ color: '#848E9C' }}>XRP/USDT</small>
        <strong>$2.1540</strong>
        <span className="subida"> +3.67%</span>
      </div>
      <div>
        <small style={{ color: '#848E9C' }}>DOGE/USDT</small>
        <strong>$0.3122</strong>
        <span className="bajada"> -0.88%</span>
      </div>
    </section>
  );
}

export default BarraPrecios;
