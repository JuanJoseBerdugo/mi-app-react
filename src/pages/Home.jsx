import { useEffect, useMemo, useState } from 'react';
import CryptoCard from '../components/mvp/CryptoCard';
import MarketChart from '../components/mvp/MarketChart';
import ProfileSettings from '../components/mvp/ProfileSettings';
import CryptoTicker from '../components/mvp/CryptoTicker';
import ExchangeTabs from '../components/mvp/ExchangeTabs';
import InventoryView from '../components/mvp/InventoryView';
import SwapPanel from '../components/mvp/SwapPanel';
import ActivityLog from '../components/mvp/ActivityLog';
import { usePortfolio } from '../hooks/usePortfolio';
import './Home.css';
import {
  applyLiveMarketSnapshot,
  buildMarketAsset,
  COINBASE_PRODUCTS,
  formatCurrency,
  formatSignedPercent,
  INITIAL_CASH_BALANCE,
  MARKET_POKEMON,
} from '../data/pokemonMarket';

const FILTERS = [
  { id: 'all', label: 'Todo el mercado' },
  { id: 'legendary', label: 'Legendarios' },
  { id: 'bullish', label: 'Alcistas' },
  { id: 'owned', label: 'En cartera' },
];

const MARKET_BATCH_SIZE = 10;
const CRYPTO_BATCH_SIZE = 6;
const MARKET_REFRESH_MS = 30000;

const marketTimeFormatter = new Intl.DateTimeFormat('es-CO', { timeStyle: 'short' });

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
  const quotes = {};

  for (let index = 0; index < COINBASE_PRODUCTS.length; index += CRYPTO_BATCH_SIZE) {
    const batch = COINBASE_PRODUCTS.slice(index, index + CRYPTO_BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async (product) => {
        try {
          const response = await fetch(`https://api.exchange.coinbase.com/products/${product.id}/stats`);
          if (!response.ok) {
            throw new Error(`Product ${product.id} unavailable`);
          }
          const payload = await response.json();
          return [product.id, { ...payload, productId: product.id, label: product.label, fetchedAt: Date.now() }];
        } catch {
          return null;
        }
      })
    );

    for (const entry of results) {
      if (entry) {
        quotes[entry[0]] = entry[1];
      }
    }
  }

  return quotes;
}

const TABS = [
  { id: 'market', label: 'Mercado', icon: '🛰️' },
  { id: 'trade', label: 'Operar', icon: '💱' },
  { id: 'inventory', label: 'Inventario', icon: '🎒' },
  { id: 'activity', label: 'Actividad', icon: '📜' },
];

function Home({ authUser, onRequestLogin, onProfileUpdated }) {
  const [assets, setAssets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [tradeSide, setTradeSide] = useState('buy');
  const [quantity, setQuantity] = useState('1');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('market');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [tradeError, setTradeError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [liveMarket, setLiveMarket] = useState({});
  const [liveMarketAnchor, setLiveMarketAnchor] = useState({});
  const [marketFeedError, setMarketFeedError] = useState('');
  const [marketSyncedAt, setMarketSyncedAt] = useState(null);

  const portfolio = usePortfolio(authUser);
  const { cashBalance, holdings, transactions, ready: portfolioReady, mode } = portfolio;

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
          if (cancelled) return;
          collectedAssets.push(...batchAssets.filter(Boolean));
        }

        const readyAssets = collectedAssets.sort((a, b) => b.basePrice - a.basePrice);
        if (!readyAssets.length) {
          throw new Error('No assets loaded');
        }
        if (cancelled) return;

        setAssets(readyAssets);
        setSelectedId((current) => current ?? readyAssets[0].id);
      } catch {
        if (!cancelled) {
          setLoadError('No pudimos sincronizar PokeAPI en este momento. Reintenta mas tarde.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMarket();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function syncCryptoMarket(isFirstLoad) {
      try {
        const quotes = await fetchCryptoReferenceStats();
        if (cancelled || !Object.keys(quotes).length) {
          if (isFirstLoad && !cancelled) {
            setMarketFeedError('Feed cripto temporalmente no disponible. Mostrando precios base.');
          }
          return;
        }
        setLiveMarket(quotes);
        setLiveMarketAnchor((current) => (Object.keys(current).length ? current : quotes));
        setMarketFeedError('');
        setMarketSyncedAt(Date.now());
      } catch {
        if (isFirstLoad && !cancelled) {
          setMarketFeedError('Feed cripto temporalmente no disponible. Mostrando precios base.');
        }
      }
    }

    syncCryptoMarket(true);
    const intervalId = window.setInterval(() => syncCryptoMarket(false), MARKET_REFRESH_MS);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!feedback) return undefined;
    const timeoutId = window.setTimeout(() => setFeedback(''), 2800);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  useEffect(() => {
    if (activeTab === 'profile' && !authUser) {
      setActiveTab('market');
    }
  }, [activeTab, authUser]);

  const marketAssets = useMemo(
    () =>
      assets
        .map((asset) =>
          applyLiveMarketSnapshot(asset, liveMarket[asset.referenceProductId], liveMarketAnchor[asset.referenceProductId])
        )
        .map((asset) => {
          const holding = holdings[asset.id];
          return {
            ...asset,
            ownedQuantity: holding?.quantity ?? 0,
            avgCost: holding?.avgCost ?? 0,
          };
        }),
    [assets, liveMarket, liveMarketAnchor, holdings]
  );

  const selectedAsset = marketAssets.find((asset) => asset.id === selectedId) ?? marketAssets[0] ?? null;
  const selectedQuantity = selectedAsset?.ownedQuantity ?? 0;
  const parsedQuantity = Number(quantity);
  const normalizedQuantity = Number.isFinite(parsedQuantity) ? Math.max(0, Math.floor(parsedQuantity)) : 0;
  const estimatedTotal = selectedAsset ? selectedAsset.price * normalizedQuantity : 0;
  const searchTerm = search.trim().toLowerCase();

  const filteredAssets = marketAssets.filter((asset) => {
    const matchesSearch =
      !searchTerm ||
      asset.name.toLowerCase().includes(searchTerm) ||
      asset.ticker.toLowerCase().includes(searchTerm) ||
      asset.referenceProductSymbol?.toLowerCase().includes(searchTerm) ||
      asset.types.some((type) => type.toLowerCase().includes(searchTerm));

    if (!matchesSearch) return false;
    if (activeFilter === 'legendary') return asset.isLegendary || asset.isMythical;
    if (activeFilter === 'bullish') return asset.changePct > 0;
    if (activeFilter === 'owned') return asset.ownedQuantity > 0;
    return true;
  });

  const ownedAssets = useMemo(
    () =>
      marketAssets
        .filter((asset) => asset.ownedQuantity > 0)
        .map((asset) => {
          const value = asset.price * asset.ownedQuantity;
          const costBasis = asset.avgCost * asset.ownedQuantity;
          const gifted = asset.avgCost === 0;
          const pnl = value - costBasis;
          const pnlPct = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
          return { ...asset, value, costBasis, gifted, pnl, pnlPct };
        }),
    [marketAssets]
  );

  const totals = useMemo(() => {
    const collectionValue = ownedAssets.reduce((sum, asset) => sum + asset.value, 0);
    const costBasis = ownedAssets.reduce((sum, asset) => sum + asset.costBasis, 0);
    const totalCards = ownedAssets.reduce((sum, asset) => sum + asset.ownedQuantity, 0);
    const pnl = collectionValue - costBasis;
    const pnlPct = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
    const topAsset = ownedAssets.reduce((best, asset) => (!best || asset.value > best.value ? asset : best), null);
    return { collectionValue, costBasis, totalCards, pnl, pnlPct, topAsset };
  }, [ownedAssets]);

  const netWorth = cashBalance + totals.collectionValue;
  const netPnl = netWorth - INITIAL_CASH_BALANCE;
  const topMover = useMemo(
    () => marketAssets.reduce((best, asset) => (!best || asset.changePct > best.changePct ? asset : best), null),
    [marketAssets]
  );

  const tabs = authUser ? [...TABS, { id: 'profile', label: 'Perfil', icon: '⚙️' }] : TABS;

  function goToTrade(id) {
    setSelectedId(id);
    setActiveTab('trade');
  }

  function handleTradeSubmit(event) {
    event.preventDefault();
    setTradeError('');
    setFeedback('');

    if (!selectedAsset) return;

    if (!authUser) {
      setTradeError('Inicia sesion para operar con tu saldo guardado.');
      onRequestLogin();
      return;
    }

    const result = tradeSide === 'buy'
      ? portfolio.buy(selectedAsset, normalizedQuantity)
      : portfolio.sell(selectedAsset, normalizedQuantity);

    if (result.ok) {
      setFeedback(result.message);
      setQuantity('1');
    } else {
      setTradeError(result.message);
    }
  }

  const syncLabel = marketSyncedAt ? `Sync ${marketTimeFormatter.format(marketSyncedAt)}` : 'Sincronizando…';

  return (
    <main className="poke-market-page">
      <header className="poke-market-section poke-x-topbar">
        <div className="poke-x-brand">
          <span className="poke-x-brand__logo">PX</span>
          <div>
            <h1>PokeXchange</h1>
            <p>Cartas legendarias enlazadas a cripto real · {COINBASE_PRODUCTS.length} mercados en vivo</p>
          </div>
        </div>
        <div className="poke-x-stats">
          <div className="poke-x-stat">
            <span>Patrimonio</span>
            <strong>{formatCurrency(netWorth)}</strong>
          </div>
          <div className="poke-x-stat">
            <span>Efectivo</span>
            <strong>{formatCurrency(cashBalance)}</strong>
          </div>
          <div className="poke-x-stat">
            <span>P&amp;L total</span>
            <strong className={netPnl >= 0 ? 'is-up' : 'is-down'}>
              {netPnl >= 0 ? '+' : ''}{formatCurrency(netPnl)}
            </strong>
          </div>
          <div className="poke-x-stat poke-x-stat--sync">
            <span className={`poke-x-sync ${mode === 'cloud' ? 'is-cloud' : mode === 'local' ? 'is-local' : ''}`}>
              {mode === 'cloud' ? '☁ Nube' : mode === 'local' ? '💾 Local' : '👤 Invitado'}
            </span>
            <small>{syncLabel}</small>
          </div>
        </div>
      </header>

      <div className="poke-market-section">
        <CryptoTicker quotes={liveMarket} syncedAt={marketSyncedAt} />
      </div>

      {marketFeedError && (
        <div className="poke-market-section">
          <span className="poke-market-inline-note">{marketFeedError}</span>
        </div>
      )}

      <div className="poke-market-section">
        <ExchangeTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {loadError ? (
        <section className="poke-market-section">
          <div className="poke-market-state poke-market-state--error">{loadError}</div>
        </section>
      ) : (
        <>
          {/* ----------------------------- MERCADO ----------------------------- */}
          {activeTab === 'market' && (
            <>
              {topMover && (
                <section className="poke-market-section poke-x-spotlight" style={{ '--spot-accent': topMover.palette.accent }}>
                  <div className="poke-x-spotlight__info">
                    <span className="poke-market-mini-badge">Mayor movimiento 24H</span>
                    <h2>{topMover.name}</h2>
                    <p>{topMover.headline}</p>
                    <div className="poke-x-spotlight__metrics">
                      <div>
                        <span>Precio</span>
                        <strong>{formatCurrency(topMover.price)}</strong>
                      </div>
                      <div>
                        <span>24H</span>
                        <strong className={topMover.changePct >= 0 ? 'is-up' : 'is-down'}>
                          {formatSignedPercent(topMover.changePct)}
                        </strong>
                      </div>
                      <div>
                        <span>Enlazado a</span>
                        <strong>{topMover.referenceProductSymbol}</strong>
                      </div>
                    </div>
                    <button type="button" className="poke-market-btn poke-market-btn--primary" onClick={() => goToTrade(topMover.id)}>
                      Operar {topMover.name}
                    </button>
                  </div>
                  <img src={topMover.image} alt={topMover.name} />
                </section>
              )}

              <section className="poke-market-section poke-market-panel">
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
                    placeholder="Buscar carta o cripto (BTC, ETH...)"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>

                {loading && !marketAssets.length ? (
                  <div className="poke-market-state">Sincronizando cartas desde PokeAPI…</div>
                ) : filteredAssets.length ? (
                  <div className="pokemon-asset-grid">
                    {filteredAssets.map((asset) => (
                      <CryptoCard
                        key={asset.id}
                        asset={asset}
                        ownedQuantity={asset.ownedQuantity}
                        isActive={asset.id === selectedAsset?.id}
                        onSelect={goToTrade}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="poke-market-state">No encontramos cartas para ese filtro.</div>
                )}
              </section>
            </>
          )}

          {/* ----------------------------- OPERAR ----------------------------- */}
          {activeTab === 'trade' && (
            <section className="poke-market-section poke-market-dashboard">
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
                          <span className="poke-x-coin-chip">◎ {selectedAsset.referenceProductSymbol}</span>
                        </div>
                        <div className="poke-market-collector-card__owned">
                          <span>En cartera</span>
                          <strong>{selectedQuantity}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="poke-market-detail-stack">
                      <MarketChart asset={selectedAsset} />
                      <div className="poke-market-stat-grid">
                        <article>
                          <span>Enlazado a</span>
                          <strong>{selectedAsset.referenceProductLabel}</strong>
                          {typeof selectedAsset.cryptoChangePct === 'number' && (
                            <small className={selectedAsset.cryptoChangePct >= 0 ? 'is-up' : 'is-down'}>
                              {formatSignedPercent(selectedAsset.cryptoChangePct)} hoy
                            </small>
                          )}
                        </article>
                        <article>
                          <span>Floor</span>
                          <strong>{formatCurrency(selectedAsset.floorPrice)}</strong>
                          <small>Piso de mercado</small>
                        </article>
                        <article>
                          <span>Spread</span>
                          <strong>{selectedAsset.spreadPct}%</strong>
                          <small>Compra / venta</small>
                        </article>
                        <article>
                          <span>Demanda</span>
                          <strong>{selectedAsset.demandScore}/99</strong>
                          <small>{selectedAsset.sentimentLabel}</small>
                        </article>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="poke-market-state">{loading ? 'Sincronizando cartas…' : 'Selecciona una carta del mercado'}</div>
                )}
              </article>

              <aside className="poke-market-panel poke-market-panel--trade">
                <div className="poke-market-wallet">
                  <div>
                    <span>Cash</span>
                    <strong>{formatCurrency(cashBalance)}</strong>
                  </div>
                  <div>
                    <span>Coleccion</span>
                    <strong>{formatCurrency(totals.collectionValue)}</strong>
                  </div>
                </div>

                {!authUser && (
                  <div className="poke-market-auth-callout">
                    <strong>Inicia sesion para operar y guardar tu cartera.</strong>
                    <button type="button" className="poke-market-btn poke-market-btn--ghost" onClick={onRequestLogin}>
                      Iniciar sesion
                    </button>
                  </div>
                )}

                {feedback && <div className="poke-market-alert poke-market-alert--success">{feedback}</div>}
                {tradeError && <div className="poke-market-alert poke-market-alert--error">{tradeError}</div>}

                <form className="poke-market-form" onSubmit={handleTradeSubmit}>
                  <label className="poke-market-field">
                    <span>Activo</span>
                    <select value={selectedAsset?.id ?? ''} onChange={(event) => setSelectedId(Number(event.target.value))}>
                      {marketAssets.map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.name} · {formatCurrency(asset.price)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="poke-market-field">
                    <span>Operacion</span>
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
                    disabled={!selectedAsset || (authUser && !portfolioReady)}
                  >
                    {authUser
                      ? tradeSide === 'buy' ? 'Ejecutar compra' : 'Ejecutar venta'
                      : 'Inicia sesion para operar'}
                  </button>
                </form>

                {authUser && (
                  <div className="poke-x-swap-card">
                    <SwapPanel ownedAssets={ownedAssets} allAssets={marketAssets} onSwap={portfolio.swap} />
                  </div>
                )}
              </aside>
            </section>
          )}

          {/* --------------------------- INVENTARIO --------------------------- */}
          {activeTab === 'inventory' && (
            <InventoryView ownedAssets={ownedAssets} totals={totals} selectedId={selectedId} onSelect={goToTrade} />
          )}

          {/* --------------------------- ACTIVIDAD ---------------------------- */}
          {activeTab === 'activity' && <ActivityLog transactions={transactions} />}

          {/* ---------------------------- PERFIL ------------------------------ */}
          {activeTab === 'profile' && authUser && (
            <ProfileSettings authUser={authUser} onProfileUpdated={onProfileUpdated} />
          )}
        </>
      )}
    </main>
  );
}

export default Home;
