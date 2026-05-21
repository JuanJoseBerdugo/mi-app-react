import CryptoCard from './CryptoCard';
import { formatCurrency, formatSignedPercent } from '../../data/pokemonMarket';

function InventoryView({ ownedAssets, totals, selectedId, onSelect }) {
  if (!ownedAssets.length) {
    return (
      <section className="poke-market-section poke-market-panel">
        <div className="poke-market-state">
          Tu inventario esta vacio. Ve a <strong>&nbsp;Mercado&nbsp;</strong> y compra tu primera carta.
        </div>
      </section>
    );
  }

  const sortedByValue = [...ownedAssets].sort((a, b) => b.value - a.value);

  return (
    <>
      <section className="poke-market-section poke-x-inv-summary">
        <article className="poke-market-metric">
          <span>Valor de coleccion</span>
          <strong>{formatCurrency(totals.collectionValue)}</strong>
          <small>{totals.totalCards} cartas · {ownedAssets.length} especies</small>
        </article>
        <article className="poke-market-metric">
          <span>Costo base</span>
          <strong>{formatCurrency(totals.costBasis)}</strong>
          <small>Inversion acumulada</small>
        </article>
        <article className="poke-market-metric">
          <span>Ganancia / perdida</span>
          <strong className={totals.pnl >= 0 ? 'is-up' : 'is-down'}>
            {totals.pnl >= 0 ? '+' : ''}{formatCurrency(totals.pnl)}
          </strong>
          <small className={totals.pnl >= 0 ? 'is-up' : 'is-down'}>
            {formatSignedPercent(totals.pnlPct)} sobre costo
          </small>
        </article>
        <article className="poke-market-metric">
          <span>Carta estrella</span>
          <strong>{totals.topAsset?.name ?? '—'}</strong>
          <small>{totals.topAsset ? formatCurrency(totals.topAsset.value) : 'Sin datos'}</small>
        </article>
      </section>

      <section className="poke-market-section poke-market-panel">
        <div className="poke-x-section-head">
          <div>
            <h2 className="poke-x-section-title">Distribucion de cartera</h2>
            <p className="poke-x-section-sub">Peso de cada carta sobre el valor total.</p>
          </div>
        </div>
        <div className="poke-x-alloc">
          {sortedByValue.map((asset) => {
            const pct = totals.collectionValue ? (asset.value / totals.collectionValue) * 100 : 0;
            return (
              <button
                type="button"
                key={asset.id}
                className="poke-x-alloc__row"
                onClick={() => onSelect(asset.id)}
              >
                <img src={asset.image} alt={asset.name} />
                <div className="poke-x-alloc__info">
                  <strong>{asset.name}</strong>
                  <span>{asset.ownedQuantity} · {formatCurrency(asset.value)}</span>
                </div>
                <div className="poke-x-alloc__bar">
                  <span style={{ width: `${Math.max(4, pct)}%`, background: asset.palette.accent }} />
                </div>
                <strong className="poke-x-alloc__pct">{pct.toFixed(1)}%</strong>
              </button>
            );
          })}
        </div>
      </section>

      <section className="poke-market-section poke-market-panel">
        <div className="poke-x-section-head">
          <div>
            <h2 className="poke-x-section-title">Mis cartas</h2>
            <p className="poke-x-section-sub">Toca una carta para operarla.</p>
          </div>
        </div>
        <div className="pokemon-asset-grid">
          {ownedAssets.map((asset) => (
            <div className="poke-x-inv-card" key={asset.id}>
              <CryptoCard
                asset={asset}
                ownedQuantity={asset.ownedQuantity}
                isActive={asset.id === selectedId}
                onSelect={onSelect}
              />
              <div className="poke-x-inv-card__stats">
                <div>
                  <span>Valor</span>
                  <strong>{formatCurrency(asset.value)}</strong>
                </div>
                <div>
                  <span>Costo prom.</span>
                  <strong>{asset.gifted ? 'Airdrop' : formatCurrency(asset.avgCost)}</strong>
                </div>
                <div>
                  <span>P&amp;L</span>
                  <strong className={asset.pnl >= 0 ? 'is-up' : 'is-down'}>
                    {asset.gifted ? `+${formatCurrency(asset.value)}` : `${asset.pnl >= 0 ? '+' : ''}${formatCurrency(asset.pnl)}`}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default InventoryView;
