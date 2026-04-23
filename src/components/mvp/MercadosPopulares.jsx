function MercadosPopulares() {
  return (
    <aside className="mercados-populares">
      <h3>Mercados populares</h3>

      <div className="fila-moneda">
        <div>
          <p><strong>Bitcoin</strong></p>
          <p style={{ color: '#848E9C', fontSize: '0.8rem' }}>BTC</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p>$97,432.10</p>
          <p className="subida"> +2.34%</p>
        </div>
      </div>

      <div className="fila-moneda">
        <div>
          <p><strong>Ethereum</strong></p>
          <p style={{ color: '#848E9C', fontSize: '0.8rem' }}>ETH</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p>$3,210.55</p>
          <p className="subida"> +1.78%</p>
        </div>
      </div>

      <div className="fila-moneda">
        <div>
          <p><strong>BNB</strong></p>
          <p style={{ color: '#848E9C', fontSize: '0.8rem' }}>BNB</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p>$612.30</p>
          <p className="bajada"> -0.45%</p>
        </div>
      </div>

    </aside>
  );
}

export default MercadosPopulares;
