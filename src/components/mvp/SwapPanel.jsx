import { useMemo, useState } from 'react';
import { formatCurrency } from '../../data/pokemonMarket';

const SWAP_FEE = 0.005; // keep in sync with usePortfolio

function SwapPanel({ ownedAssets, allAssets, onSwap }) {
  const [fromId, setFromId] = useState(null);
  const [toId, setToId] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [result, setResult] = useState(null);

  const assetsById = useMemo(() => {
    const map = {};
    for (const asset of allAssets) map[asset.id] = asset;
    return map;
  }, [allAssets]);

  // Derive valid selections during render (no setState-in-effect needed):
  // "from" must be something owned, "to" must be a different existing card.
  const effectiveFromId = ownedAssets.some((asset) => asset.id === fromId)
    ? fromId
    : ownedAssets[0]?.id ?? null;
  const effectiveToId =
    toId && toId !== effectiveFromId && assetsById[toId]
      ? toId
      : allAssets.find((asset) => asset.id !== effectiveFromId)?.id ?? null;

  const fromAsset = effectiveFromId ? assetsById[effectiveFromId] : null;
  const toAsset = effectiveToId ? assetsById[effectiveToId] : null;
  const ownedQty = ownedAssets.find((asset) => asset.id === effectiveFromId)?.ownedQuantity ?? 0;
  const qty = Math.max(0, Math.floor(Number(quantity) || 0));

  const preview = useMemo(() => {
    if (!fromAsset || !toAsset || !qty) return null;
    const grossValue = fromAsset.price * qty;
    const netValue = grossValue * (1 - SWAP_FEE);
    const receiveQty = Math.floor(netValue / toAsset.price);
    const residual = netValue - receiveQty * toAsset.price;
    return { grossValue, netValue, receiveQty, residual, fee: grossValue * SWAP_FEE };
  }, [fromAsset, toAsset, qty]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!fromAsset || !toAsset) return;
    const outcome = onSwap(fromAsset, toAsset, qty);
    setResult(outcome);
    if (outcome.ok) setQuantity('1');
  }

  if (!ownedAssets.length) {
    return (
      <div className="poke-x-swap">
        <div className="poke-market-state">Necesitas cartas en tu inventario para intercambiar.</div>
      </div>
    );
  }

  return (
    <form className="poke-x-swap" onSubmit={handleSubmit}>
      <div className="poke-x-swap__head">
        <h3>Intercambio carta por carta</h3>
        <span>Fee {(SWAP_FEE * 100).toFixed(1)}%</span>
      </div>

      <label className="poke-market-field">
        <span>Entregas</span>
        <select value={effectiveFromId ?? ''} onChange={(event) => setFromId(Number(event.target.value))}>
          {ownedAssets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.name} · {asset.ownedQuantity} en cartera
            </option>
          ))}
        </select>
      </label>

      <label className="poke-market-field">
        <span>Cantidad (max {ownedQty})</span>
        <input
          type="number"
          min="1"
          step="1"
          max={ownedQty}
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
      </label>

      <div className="poke-x-swap__arrow" aria-hidden="true">⇅</div>

      <label className="poke-market-field">
        <span>Recibes</span>
        <select value={effectiveToId ?? ''} onChange={(event) => setToId(Number(event.target.value))}>
          {allAssets
            .filter((asset) => asset.id !== effectiveFromId)
            .map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name} · {formatCurrency(asset.price)}
              </option>
            ))}
        </select>
      </label>

      {preview && (
        <div className="poke-x-swap__preview">
          <div>
            <span>Valor entregado</span>
            <strong>{formatCurrency(preview.grossValue)}</strong>
          </div>
          <div>
            <span>Fee</span>
            <strong>-{formatCurrency(preview.fee)}</strong>
          </div>
          <div>
            <span>Recibes</span>
            <strong className="is-up">
              {preview.receiveQty} {toAsset?.name}
            </strong>
          </div>
          {preview.residual > 1 && (
            <div>
              <span>Vuelto a saldo</span>
              <strong>{formatCurrency(preview.residual)}</strong>
            </div>
          )}
        </div>
      )}

      {result && (
        <div className={`poke-market-alert poke-market-alert--${result.ok ? 'success' : 'error'}`}>
          {result.message}
        </div>
      )}

      <button
        type="submit"
        className="poke-market-btn poke-market-btn--primary poke-market-btn--full"
        disabled={!preview || preview.receiveQty < 1 || qty > ownedQty}
      >
        Ejecutar intercambio
      </button>
    </form>
  );
}

export default SwapPanel;
