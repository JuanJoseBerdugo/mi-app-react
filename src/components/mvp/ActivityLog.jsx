import { useMemo, useState } from 'react';
import { formatCurrency } from '../../data/pokemonMarket';

const FILTERS = [
  { id: 'all', label: 'Todo' },
  { id: 'buy', label: 'Compras' },
  { id: 'sell', label: 'Ventas' },
  { id: 'swap', label: 'Swaps' },
];

const SIDE_META = {
  buy: { label: 'Compra', cls: 'is-buy', sign: '-' },
  sell: { label: 'Venta', cls: 'is-sell', sign: '+' },
  swap_out: { label: 'Swap salida', cls: 'is-swap-out', sign: '→' },
  swap_in: { label: 'Swap entrada', cls: 'is-swap-in', sign: '←' },
};

const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function ActivityLog({ transactions }) {
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return transactions;
    if (filter === 'swap') return transactions.filter((tx) => tx.side.startsWith('swap'));
    return transactions.filter((tx) => tx.side === filter);
  }, [transactions, filter]);

  return (
    <section className="poke-market-section poke-market-panel">
      <div className="poke-x-section-head">
        <div>
          <h2 className="poke-x-section-title">Actividad de trading</h2>
          <p className="poke-x-section-sub">Historial de ordenes ejecutadas en tu cuenta.</p>
        </div>
        <div className="poke-market-filter-group">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`poke-market-filter ${filter === item.id ? 'is-active' : ''}`}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length ? (
        <div className="poke-x-activity-list">
          {filtered.map((tx) => {
            const meta = SIDE_META[tx.side] ?? SIDE_META.buy;
            return (
              <article className="poke-x-activity-row" key={tx.id}>
                <div className={`poke-x-activity-badge ${meta.cls}`}>{meta.label}</div>
                <div className="poke-x-activity-main">
                  <strong>{tx.assetName}</strong>
                  <span>{tx.assetTicker} · {tx.quantity} carta{tx.quantity !== 1 ? 's' : ''} @ {formatCurrency(tx.unitPrice)}</span>
                </div>
                <div className="poke-x-activity-meta">
                  <strong className={meta.cls}>{meta.sign} {formatCurrency(tx.total)}</strong>
                  <span>{dateFormatter.format(tx.executedAt)}</span>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="poke-market-state">Aun no hay movimientos en esta categoria.</div>
      )}
    </section>
  );
}

export default ActivityLog;
