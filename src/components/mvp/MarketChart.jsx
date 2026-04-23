import { formatCurrency, formatSignedPercent } from '../../data/pokemonMarket';

function MarketChart({ asset, compact = false }) {
  if (!asset) {
    return null;
  }

  const width = 640;
  const height = compact ? 220 : 280;
  const padding = compact ? 18 : 24;
  const min = Math.min(...asset.series);
  const max = Math.max(...asset.series);
  const range = max - min || 1;
  const fillId = `market-chart-fill-${asset.id}`;
  const glowId = `market-chart-glow-${asset.id}`;

  const points = asset.series
    .map((value, index) => {
      const x = padding + (index / (asset.series.length - 1)) * (width - padding * 2);
      const y = padding + (1 - (value - min) / range) * (height - padding * 2);

      return `${x},${y}`;
    })
    .join(' ');

  const fillPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;
  const guideValues = [0, 0.33, 0.66, 1].map((ratio) => Math.round(max - range * ratio));

  return (
    <div
      className={`market-chart ${compact ? 'market-chart--compact' : ''}`}
      style={{
        '--chart-accent': asset.palette.accent,
        '--chart-accent-alt': asset.palette.accentAlt,
      }}
    >
      <div className="market-chart__header">
        <div>
          <span className="market-chart__eyebrow">Grafico 24H</span>
          <strong className="market-chart__price">{formatCurrency(asset.price)}</strong>
        </div>
        <span className={`market-chart__change ${asset.changePct >= 0 ? 'is-up' : 'is-down'}`}>
          {formatSignedPercent(asset.changePct)}
        </span>
      </div>

      <div className="market-chart__canvas">
        <div className="market-chart__guides">
          {guideValues.map((value) => (
            <span key={value}>{formatCurrency(value)}</span>
          ))}
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Grafico del precio de ${asset.name}`}>
          <defs>
            <linearGradient id={fillId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={asset.palette.accent} stopOpacity="0.42" />
              <stop offset="100%" stopColor={asset.palette.accentAlt} stopOpacity="0.02" />
            </linearGradient>
            <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor={asset.palette.accent} floodOpacity="0.35" />
            </filter>
          </defs>

          {[0.18, 0.42, 0.68, 0.9].map((ratio) => {
            const y = padding + ratio * (height - padding * 2);

            return (
              <line
                key={ratio}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="6 8"
              />
            );
          })}

          <polygon points={fillPoints} fill={`url(#${fillId})`} />
          <polyline
            points={points}
            fill="none"
            stroke={asset.palette.accent}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${glowId})`}
          />
        </svg>
      </div>

      <div className="market-chart__footer">
        <div>
          <span>Floor</span>
          <strong>{formatCurrency(asset.floorPrice)}</strong>
        </div>
        <div>
          <span>High</span>
          <strong>{formatCurrency(asset.high24h)}</strong>
        </div>
        <div>
          <span>Spread</span>
          <strong>{asset.spreadPct}%</strong>
        </div>
      </div>
    </div>
  );
}

export default MarketChart;
