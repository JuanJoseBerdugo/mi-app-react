import {
  formatCurrency,
  formatSignedPercent,
} from '../../data/pokemonMarket';

function CryptoCard({ asset, ownedQuantity, isActive, onSelect }) {
  return (
    <button
      type="button"
      className={`pokemon-asset-card pokemon-asset-card--${asset.rarityTone} ${isActive ? 'is-active' : ''}`}
      onClick={() => onSelect(asset.id)}
      style={{
        '--asset-accent': asset.palette.accent,
        '--asset-accent-alt': asset.palette.accentAlt,
        '--asset-glow': asset.palette.glow,
      }}
    >
      <div className="pokemon-asset-card__top">
        <span className="pokemon-asset-card__grade">{asset.grade}</span>
        <span className={`pokemon-asset-card__sentiment ${asset.changePct >= 0 ? 'is-up' : 'is-down'}`}>
          {asset.sentimentLabel}
        </span>
      </div>

      <div className="pokemon-asset-card__art">
        <img src={asset.image} alt={asset.name} loading="lazy" />
        <span className="pokemon-asset-card__ticker">{asset.ticker}</span>
      </div>

      <div className="pokemon-asset-card__body">
        <div className="pokemon-asset-card__headline">
          <div>
            <h3>{asset.name}</h3>
            <p>{asset.rarityLabel}</p>
          </div>
          <strong>{formatCurrency(asset.price)}</strong>
        </div>

        <div className="pokemon-asset-card__types">
          {asset.types.map((type) => (
            <span key={`${asset.id}-${type}`}>{type}</span>
          ))}
        </div>

        <div className="pokemon-asset-card__metrics">
          <div>
            <span>Tendencia</span>
            <strong className={asset.changePct >= 0 ? 'is-up' : 'is-down'}>
              {formatSignedPercent(asset.changePct)}
            </strong>
          </div>
          <div>
            <span>Cartera</span>
            <strong>{ownedQuantity}</strong>
          </div>
        </div>
      </div>
    </button>
  );
}

export default CryptoCard;
