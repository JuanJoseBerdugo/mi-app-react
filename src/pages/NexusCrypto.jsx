import { useState } from 'react';
import './NexusCrypto.css';

function NexusCrypto() {
  const [btcBalance, setBtcBalance] = useState(0);
  const [cashBalance, setCashBalance] = useState(10000);
  const [inversion, setInversion] = useState('');
  const [precioBTC, setPrecioBTC] = useState(65000);
  const [operacion, setOperacion] = useState('comprar');
  const [historial, setHistorial] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [error, setError] = useState('');

  const btcEnUSD = btcBalance * precioBTC;

  const ejecutarOrden = () => {
    setError('');
    const monto = parseFloat(inversion);

    if (!monto || monto <= 0) {
      setError('Ingresa un monto válido en USD.');
      return;
    }

    if (operacion === 'comprar') {
      if (monto > cashBalance) {
        setError(`Saldo insuficiente. Tienes $${cashBalance.toFixed(2)} disponibles.`);
        return;
      }
      const btcComprado = monto / precioBTC;
      setBtcBalance(prev => prev + btcComprado);
      setCashBalance(prev => prev - monto);
      setHistorial(prev => [{
        id: Date.now(),
        tipo: 'Orden de Compra',
        fecha: new Date().toLocaleString('es-CO'),
        btcAmount: btcComprado,
        signo: '+',
      }, ...prev]);
    } else {
      const btcAVender = monto / precioBTC;
      if (btcAVender > btcBalance) {
        setError(`BTC insuficiente. Tienes ${btcBalance.toFixed(8)} BTC disponibles.`);
        return;
      }
      setBtcBalance(prev => prev - btcAVender);
      setCashBalance(prev => prev + monto);
      setHistorial(prev => [{
        id: Date.now(),
        tipo: 'Orden de Venta',
        fecha: new Date().toLocaleString('es-CO'),
        btcAmount: btcAVender,
        signo: '-',
      }, ...prev]);
    }
    setInversion('');
  };

  const historialFiltrado = historial.filter(h =>
    filtro === '' || h.tipo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="nx-page">

      {/* Sub-header */}
      <div className="nx-topbar">
        <div className="nx-logo">
          <span className="nx-logo-circle">₿</span>
          <span className="nx-logo-text">NEXUS CRYPTO</span>
        </div>
        <div className="nx-topbar-right">
          <button className="nx-btn-teoria">📖 Ver Teoría</button>
          <span className="nx-usuario">👤 Juan Berdugo</span>
        </div>
      </div>

      {/* Content */}
      <div className="nx-content">

        {/* Left column */}
        <div className="nx-left">

          {/* Balance card */}
          <div className="nx-balance-card">
            <p className="nx-balance-label">SALDO EN BITCOIN (BTC)</p>
            <h2 className="nx-balance-btc">{btcBalance.toFixed(8)}</h2>
            <p className="nx-balance-unit">BTC</p>
            <p className="nx-balance-sub">
              ≈ ${btcEnUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              &nbsp;|&nbsp;
              Cash: ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <div className="nx-balance-deco" />
          </div>

          {/* Order form */}
          <div className="nx-form-card">
            <h3 className="nx-form-titulo">Operar Mercado</h3>

            <div className="nx-field">
              <label className="nx-label">Inversión (USD)</label>
              <input
                type="number"
                placeholder="Monto en Dólares"
                value={inversion}
                min="0"
                onChange={e => { setInversion(e.target.value); setError(''); }}
                className="nx-input"
              />
            </div>

            <div className="nx-field">
              <label className="nx-label">Precio Actual BTC</label>
              <input
                type="number"
                value={precioBTC}
                min="1"
                onChange={e => setPrecioBTC(Number(e.target.value))}
                className="nx-input"
              />
            </div>

            <div className="nx-field">
              <label className="nx-label">Operación</label>
              <select
                value={operacion}
                onChange={e => setOperacion(e.target.value)}
                className="nx-select"
              >
                <option value="comprar">Comprar Bitcoin</option>
                <option value="vender">Vender Bitcoin</option>
              </select>
            </div>

            {error && <p className="nx-error">{error}</p>}

            <button className="nx-btn-ejecutar" onClick={ejecutarOrden}>
              Ejecutar Orden
            </button>
          </div>
        </div>

        {/* Right column — Historial */}
        <div className="nx-right">
          <div className="nx-historial-head">
            <h3 className="nx-historial-titulo">Historial de Movimientos</h3>
            <div className="nx-historial-controles">
              <input
                type="text"
                placeholder="Buscar por categoría..."
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
                className="nx-input nx-input--search"
              />
              <button
                className="nx-btn-limpiar"
                onClick={() => { setHistorial([]); setFiltro(''); }}
              >
                Limpiar Historial
              </button>
            </div>
          </div>

          <div className="nx-historial-lista">
            {historialFiltrado.length === 0 ? (
              <p className="nx-historial-vacio">No hay movimientos aún.</p>
            ) : (
              historialFiltrado.map(h => (
                <div key={h.id} className="nx-historial-item">
                  <div className="nx-historial-izq">
                    <span className={`nx-barra ${h.signo === '+' ? 'nx-barra--compra' : 'nx-barra--venta'}`} />
                    <div>
                      <p className="nx-historial-tipo">{h.tipo}</p>
                      <p className="nx-historial-fecha">{h.fecha}</p>
                    </div>
                  </div>
                  <span className={`nx-historial-monto ${h.signo === '+' ? 'nx-historial-monto--compra' : 'nx-historial-monto--venta'}`}>
                    {h.signo}{h.btcAmount.toFixed(8)} BTC
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default NexusCrypto;
