import { COINBASE_PRODUCTS, formatPreciseCurrency, formatSignedPercent } from '../../data/pokemonMarket';

function buildItems(quotes) {
  return COINBASE_PRODUCTS.map((product) => {
    const stat = quotes[product.id];
    const open = Number(stat?.open) || 0;
    const last = Number(stat?.last) || 0;
    const changePct = open && last ? ((last - open) / open) * 100 : null;

    return {
      id: product.id,
      symbol: product.symbol,
      label: product.label,
      last,
      changePct,
    };
  });
}

function CryptoTicker({ quotes }) {
  const items = buildItems(quotes);
  const hasLive = items.some((item) => item.last > 0);
  // Duplicate the row so the marquee can scroll seamlessly.
  const marquee = [...items, ...items];

  return (
    <div className="poke-x-ticker" aria-label="Cotizaciones cripto en vivo">
      <div className="poke-x-ticker__tag">
        <span className={`poke-x-ticker__dot ${hasLive ? 'is-live' : ''}`} aria-hidden="true" />
        {hasLive ? 'EN VIVO' : 'BASE'}
      </div>
      <div className="poke-x-ticker__viewport">
        <div className={`poke-x-ticker__track ${hasLive ? 'is-animated' : ''}`}>
          {marquee.map((item, index) => (
            <span className="poke-x-ticker__item" key={`${item.id}-${index}`}>
              <strong>{item.symbol}</strong>
              <span className="poke-x-ticker__price">
                {item.last ? formatPreciseCurrency(item.last) : '—'}
              </span>
              {item.changePct !== null && (
                <span className={item.changePct >= 0 ? 'is-up' : 'is-down'}>
                  {formatSignedPercent(item.changePct)}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CryptoTicker;
