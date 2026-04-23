import { useEffect, useState } from 'react';
import CryptoCard from '../components/mvp/CryptoCard';
import MarketChart from '../components/mvp/MarketChart';
import './Home.css';
import {
  applyLiveMarketSnapshot,
  buildMarketAsset,
  buildSeedTransactions,
  COINBASE_PRODUCTS,
  formatCurrency,
  formatSignedPercent,
  INITIAL_CASH_BALANCE,
  INITIAL_HOLDINGS,
  MARKET_POKEMON,
} from '../data/pokemonMarket';

const FILTERS = [
  { id: 'all', label: 'Todo el mercado' },
  { id: 'legendary', label: 'Legendarios' },
  { id: 'bullish', label: 'Alcistas' },
  { id: 'owned', label: 'En cartera' },
];

const MARKET_BATCH_SIZE = 12;
const MARKET_REFRESH_MS = 30000;
const PORTFOLIO_STORAGE_PREFIX = 'pokemon-market-portfolio::';
const PORTFOLIO_VERSION = 2; // increment to reset all stored portfolios

const tradeDateFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const marketTimeFormatter = new Intl.DateTimeFormat('es-CO', {
  timeStyle: 'short',
});

async function fetchMarketAsset(meta) {
  try {
    const [pokemonResponse, speciesResponse] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${meta.id}`),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${meta.id}`),
    ]);

    if (!pokemonResponse.ok) {
      throw new Error(`Pokemon ${meta.id} unavailable`);
    }

    const pokemon = await pokemonResponse.json();
    const species = speciesResponse.ok ? await speciesResponse.json() : null;

    return buildMarketAsset(pokemon, species, meta);
  } catch {
    return null;
  }
}

async function fetchCryptoReferenceStats() {
  const results = await Promise.all(
    COINBASE_PRODUCTS.map(async (product) => {
      try {
        const response = await fetch(`https://api.exchange.coinbase.com/products/${product.id}/stats`);

        if (!response.ok) {
          throw new Error(`Product ${product.id} unavailable`);
        }

        const payload = await response.json();

        return [
          product.id,
          {
            ...payload,
            productId: product.id,
            label: product.label,
            fetchedAt: Date.now(),
          },
        ];
      } catch {
        return null;
      }
    })
  );

  return Object.fromEntries(results.filter(Boolean));
}

function getPortfolioStorageKey(authUser) {
  return authUser?.email ? `${PORTFOLIO_STORAGE_PREFIX}${authUser.email}` : null;
}

function getDefaultPortfolio(seedTransactions) {
  return {
    cashBalance: INITIAL_CASH_BALANCE,
    holdings: INITIAL_HOLDINGS,
    transactions: seedTransactions,
  };
}

function normalizePortfolio(rawPortfolio, seedTransactions) {
  if (!rawPortfolio || typeof rawPortfolio !== 'object' || rawPortfolio.version !== PORTFOLIO_VERSION) {
    return getDefaultPortfolio(seedTransactions);
  }

  const cashBalance =
    Number.isFinite(Number(rawPortfolio.cashBalance)) && Number(rawPortfolio.cashBalance) >= 0
      ? Number(rawPortfolio.cashBalance)
      : INITIAL_CASH_BALANCE;

  const holdings =
    rawPortfolio.holdings && typeof rawPortfolio.holdings === 'object'
      ? rawPortfolio.holdings
      : INITIAL_HOLDINGS;

  const transactions =
    Array.isArray(rawPortfolio.transactions) && rawPortfolio.transactions.length
      ? rawPortfolio.transactions
      : seedTransactions;

  return {
    cashBalance,
    holdings,
    transactions,
  };
}

function Home({ authUser, onRequestLogin }) {
  const [assets, setAssets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [cashBalance, setCashBalance] = useState(INITIAL_CASH_BALANCE);
  const [holdings, setHoldings] = useState(INITIAL_HOLDINGS);
  const [tradeSide, setTradeSide] = useState('buy');
  const [quantity, setQuantity] = useState('1');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [tradeError, setTradeError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [liveMarket, setLiveMarket] = useState({});
  const [liveMarketAnchor, setLiveMarketAnchor] = useState({});
  const [marketFeedError, setMarketFeedError] = useState('');
  const [marketSyncedAt, setMarketSyncedAt] = useState(null);
  const [portfolioReady, setPortfolioReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadMarket() {
      setLoading(true);
      setLoadError('');

      try {
        const collectedAssets = [];

        for (let index = 0; index < MARKET_POKEMON.length; index += MARKET_BATCH_SIZE) {
          const batch = MARKET_POKEMON.slice(index, index + MARKET_BATCH_SIZE);
          const batchAssets = await Promise.all(batch.map(fetchMarketAsset));

          if (cancelled) {
            return;
          }

          collectedAssets.push(...batchAssets.filter(Boolean));
        }

        const readyAssets = collectedAssets.sort((assetA, assetB) => assetB.basePrice - assetA.basePrice);

        if (!readyAssets.length) {
          throw new Error('No assets loaded');
        }

        if (cancelled) {
          return;
        }

        setAssets(readyAssets);
        setSelectedId((current) => current ?? readyAssets[0].id);
      } catch {
        if (!cancelled) {
          setLoadError('No pudimos sincronizar PokeAPI en este momento. Reintenta más tarde.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMarket();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let intervalId;

    async function syncCryptoMarket(isFirstLoad) {
      try {
        const quotes = await fetchCryptoReferenceStats();

        if (cancelled || !Object.keys(quotes).length) {
          if (isFirstLoad && !cancelled) {
            setMarketFeedError('Feed cripto temporalmente no disponible. Mostrando precios base del mercado.');
          }
          return;
        }

        setLiveMarket(quotes);
        setLiveMarketAnchor((current) => (Object.keys(current).length ? current : quotes));
        setMarketFeedError('');
        setMarketSyncedAt(Date.now());
      } catch {
        if (isFirstLoad && !cancelled) {
          setMarketFeedError('Feed cripto temporalmente no disponible. Mostrando precios base del mercado.');
        }
      }
    }

    syncCryptoMarket(true);
    intervalId = window.setInterval(() => {
      syncCryptoMarket(false);
    }, MARKET_REFRESH_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setFeedback('');
    }, 2800);

    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  useEffect(() => {
    if (!assets.length) {
      return;
    }

    const seedTransactions = buildSeedTransactions(assets);
    const storageKey = getPortfolioStorageKey(authUser);
    setPortfolioReady(false);

    if (!storageKey) {
      const defaultPortfolio = getDefaultPortfolio(seedTransactions);
      setCashBalance(defaultPortfolio.cashBalance);
      setHoldings(defaultPortfolio.holdings);
      setTransactions(defaultPortfolio.transactions);
      setPortfolioReady(true);
      return;
    }

    try {
      const rawPortfolio = window.localStorage.getItem(storageKey);
      const parsedPortfolio = rawPortfolio ? JSON.parse(rawPortfolio) : null;
      const portfolio = normalizePortfolio(parsedPortfolio, seedTransactions);

      setCashBalance(portfolio.cashBalance);
      setHoldings(portfolio.holdings);
      setTransactions(portfolio.transactions);
    } catch {
      const fallbackPortfolio = getDefaultPortfolio(seedTransactions);
      setCashBalance(fallbackPortfolio.cashBalance);
      setHoldings(fallbackPortfolio.holdings);
      setTransactions(fallbackPortfolio.transactions);
    }

    setPortfolioReady(true);
  }, [authUser, assets]);

  useEffect(() => {
    const storageKey = getPortfolioStorageKey(authUser);

    if (!storageKey || !portfolioReady) {
      return;
    }

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: PORTFOLIO_VERSION,
        cashBalance,
        holdings,
        transactions,
      })
    );
  }, [authUser, portfolioReady, cashBalance, holdings, transactions]);

  const marketAssets = assets
    .map((asset) =>
      applyLiveMarketSnapshot(asset, liveMarket[asset.referenceProductId], liveMarketAnchor[asset.referenceProductId])
    )
    .map((asset) => ({
      ...asset,
      ownedQuantity: holdings[asset.id] ?? 0,
    }));

  const selectedAsset = marketAssets.find((asset) => asset.id === selectedId) ?? marketAssets[0] ?? null;
  const selectedQuantity = selectedAsset ? holdings[selectedAsset.id] ?? 0 : 0;
  const parsedQuantity = Number(quantity);
  const normalizedQuantity = Number.isFinite(parsedQuantity) ? Math.max(0, Math.floor(parsedQuantity)) : 0;
  const estimatedTotal = selectedAsset ? selectedAsset.price * normalizedQuantity : 0;
  const searchTerm = search.trim().toLowerCase();

  const filteredAssets = marketAssets.filter((asset) => {
    const matchesSearch =
      !searchTerm ||
      asset.name.toLowerCase().includes(searchTerm) ||
      asset.ticker.toLowerCase().includes(searchTerm) ||
      asset.types.some((type) => type.toLowerCase().includes(searchTerm));

    if (!matchesSearch) {
      return false;
    }

    if (activeFilter === 'legendary') {
      return asset.isLegendary || asset.isMythical;
    }

    if (activeFilter === 'bullish') {
      return asset.changePct > 0;
    }

    if (activeFilter === 'owned') {
      return asset.ownedQuantity > 0;
    }

    return true;
  });

  const collectionValue = marketAssets.reduce(
    (total, asset) => total + asset.price * (holdings[asset.id] ?? 0),
    0
  );

  const ownedAssets = marketAssets.filter((asset) => (holdings[asset.id] ?? 0) > 0);

  const handleTradeSubmit = (event) => {
    event.preventDefault();

    if (!selectedAsset) {
      return;
    }

    setTradeError('');
    setFeedback('');

    if (!authUser) {
      setTradeError('Inicia sesión para comprar o vender cartas con tu saldo guardado.');
      onRequestLogin();
      return;
    }

    if (!portfolioReady) {
      setTradeError('Estamos preparando tu cartera. Intenta de nuevo en un segundo.');
      return;
    }

    if (!normalizedQuantity) {
      setTradeError('Ingresa una cantidad de cartas válida.');
      return;
    }

    const total = selectedAsset.price * normalizedQuantity;

    if (tradeSide === 'buy') {
      if (total > cashBalance) {
        setTradeError(`Saldo insuficiente. Necesitas ${formatCurrency(total)} para ejecutar la compra.`);
        return;
      }

      setCashBalance((current) => current - total);
      setHoldings((current) => ({
        ...current,
        [selectedAsset.id]: (current[selectedAsset.id] ?? 0) + normalizedQuantity,
      }));
      setFeedback(`Compraste ${normalizedQuantity} ${selectedAsset.name} por ${formatCurrency(total)}.`);
    } else {
      if (normalizedQuantity > selectedQuantity) {
        setTradeError(`No tienes suficientes ${selectedAsset.name}. En cartera: ${selectedQuantity}.`);
        return;
      }

      setCashBalance((current) => current + total);
      setHoldings((current) => ({
        ...current,
        [selectedAsset.id]: Math.max(0, (current[selectedAsset.id] ?? 0) - normalizedQuantity),
      }));
      setFeedback(`Vendiste ${normalizedQuantity} ${selectedAsset.name} por ${formatCurrency(total)}.`);
    }

    setTransactions((current) => [
      {
        id: `trade-${Date.now()}`,
        assetId: selectedAsset.id,
        assetName: selectedAsset.name,
        assetTicker: selectedAsset.ticker,
        side: tradeSide,
        quantity: normalizedQuantity,
        unitPrice: selectedAsset.price,
        total,
        executedAt: Date.now(),
      },
      ...current,
    ]);
    setQuantity('1');
  };

  return (
    <main className="poke-market-page">

      {/* Balance top-right */}
      <div className="poke-market-page-header">
        {marketFeedError && <span className="poke-market-inline-note">{marketFeedError}</span>}
        <div className="poke-market-balance-badge">
          <span>Saldo</span>
          <strong>{formatCurrency(cashBalance)}</strong>
        </div>
      </div>

      {loadError ? (
        <section className="poke-market-section">
          <div className="poke-market-state poke-market-state--error">{loadError}</div>
        </section>
      ) : (
        <>
          {/* Detail + Trade */}
          <section className="poke-market-section poke-market-dashboard" id="trade-desk">
            <article className="poke-market-panel poke-market-panel--detail">
              {selectedAsset ? (
                <div className="poke-market-detail-grid">
                  <div
                    className={`poke-market-collector-card poke-market-collector-card--${selectedAsset.rarityTone}`}
                    style={{
                      '--card-accent': selectedAsset.palette.accent,
                      '--card-accent-alt': selectedAsset.palette.accentAlt,
                    }}
                  >
                    <div className="poke-market-collector-card__top">
                      <span>{selectedAsset.grade}</span>
                      <span>{selectedAsset.generationLabel}</span>
                    </div>
                    <div className="poke-market-collector-card__art">
                      <img src={selectedAsset.image} alt={selectedAsset.name} />
                      <span>{selectedAsset.ticker}</span>
                    </div>
                    <div className="poke-market-collector-card__body">
                      <div className="poke-market-collector-card__headline">
                        <div>
                          <h3>{selectedAsset.name}</h3>
                          <p>{selectedAsset.headline}</p>
                        </div>
                        <strong>{formatCurrency(selectedAsset.price)}</strong>
                      </div>
                      <div className="poke-market-tag-row">
                        {selectedAsset.types.map((type) => (
                          <span key={`${selectedAsset.id}-${type}`}>{type}</span>
                        ))}
                      </div>
                      <div className="poke-market-collector-card__owned">
                        <span>En cartera</span>
                        <strong>{selectedQuantity}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="poke-market-detail-stack">
                    <MarketChart asset={selectedAsset} />

                    {/* Mis activos */}
                    {ownedAssets.length > 0 && (
                      <div className="poke-market-portfolio-panel">
                        <h4 className="poke-market-portfolio-panel__title">Mis activos</h4>
                        <div className="poke-market-portfolio-list">
                          {ownedAssets.map((asset) => {
                            const qty = holdings[asset.id] ?? 0;
                            const value = asset.price * qty;
                            return (
                              <button
                                key={asset.id}
                                type="button"
                                className={`poke-market-portfolio-item ${asset.id === selectedId ? 'is-active' : ''}`}
                                onClick={() => setSelectedId(asset.id)}
                              >
                                <img src={asset.image} alt={asset.name} />
                                <div className="poke-market-portfolio-item__info">
                                  <strong>{asset.name}</strong>
                                  <span>{qty} carta{qty !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="poke-market-portfolio-item__value">
                                  <strong>{formatCurrency(value)}</strong>
                                  <span className={asset.changePct >= 0 ? 'is-up' : 'is-down'}>
                                    {formatSignedPercent(asset.changePct)}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="poke-market-state">
                  {loading ? 'Sincronizando cartas...' : 'Selecciona una carta del mercado'}
                </div>
              )}
            </article>

            <aside className="poke-market-panel poke-market-panel--trade">
              <div className="poke-market-wallet">
                <div>
                  <span>Cash</span>
                  <strong>{formatCurrency(cashBalance)}</strong>
                </div>
                <div>
                  <span>Colección</span>
                  <strong>{formatCurrency(collectionValue)}</strong>
                </div>
              </div>

              {!authUser && (
                <div className="poke-market-auth-callout">
                  <div>
                    <strong>Inicia sesión para guardar tu cartera.</strong>
                  </div>
                  <button type="button" className="poke-market-btn poke-market-btn--ghost" onClick={onRequestLogin}>
                    Iniciar sesión
                  </button>
                </div>
              )}

              {feedback && <div className="poke-market-alert poke-market-alert--success">{feedback}</div>}
              {tradeError && <div className="poke-market-alert poke-market-alert--error">{tradeError}</div>}

              <form className="poke-market-form" onSubmit={handleTradeSubmit}>
                <label className="poke-market-field">
                  <span>Activo</span>
                  <input value={selectedAsset ? `${selectedAsset.name} (${selectedAsset.ticker})` : ''} readOnly />
                </label>

                <label className="poke-market-field">
                  <span>Operación</span>
                  <select value={tradeSide} onChange={(event) => setTradeSide(event.target.value)}>
                    <option value="buy">Comprar</option>
                    <option value="sell">Vender</option>
                  </select>
                </label>

                <label className="poke-market-field">
                  <span>Cantidad</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    placeholder="Cantidad de cartas"
                  />
                </label>

                <div className="poke-market-summary">
                  <div>
                    <span>Precio unitario</span>
                    <strong>{selectedAsset ? formatCurrency(selectedAsset.price) : '--'}</strong>
                  </div>
                  <div>
                    <span>Disponibles</span>
                    <strong>{selectedQuantity}</strong>
                  </div>
                  <div>
                    <span>Total estimado</span>
                    <strong>{selectedAsset ? formatCurrency(estimatedTotal) : '--'}</strong>
                  </div>
                </div>

                <button
                  className="poke-market-btn poke-market-btn--primary poke-market-btn--full"
                  type="submit"
                  disabled={!selectedAsset || !portfolioReady}
                >
                  {authUser
                    ? tradeSide === 'buy' ? 'Ejecutar compra' : 'Ejecutar venta'
                    : 'Inicia sesión para operar'}
                </button>
              </form>
            </aside>
          </section>

          {/* Card market grid */}
          <section className="poke-market-section poke-market-panel" id="market-deck">
            <div className="poke-market-controls poke-market-controls--inline">
              <div className="poke-market-filter-group">
                {FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    className={`poke-market-filter ${activeFilter === filter.id ? 'is-active' : ''}`}
                    onClick={() => setActiveFilter(filter.id)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <input
                className="poke-market-search"
                type="search"
                placeholder="Buscar carta..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            {loading && !marketAssets.length ? (
              <div className="poke-market-state">Sincronizando cartas desde PokeAPI...</div>
            ) : filteredAssets.length ? (
              <div className="pokemon-asset-grid">
                {filteredAssets.map((asset) => (
                  <CryptoCard
                    key={asset.id}
                    asset={asset}
                    ownedQuantity={asset.ownedQuantity}
                    isActive={asset.id === selectedAsset?.id}
                    onSelect={setSelectedId}
                  />
                ))}
              </div>
            ) : (
              <div className="poke-market-state">No encontramos cartas para ese filtro.</div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default Home;
