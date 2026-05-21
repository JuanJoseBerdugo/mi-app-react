// PokeXchange market data.
// 20 curated "best" Pokemon, each linked 1:1 to a distinct real crypto traded on
// Coinbase (USD product). The live crypto feed modulates each card's USD value so the
// exchange tracks real markets while keeping a Pokemon collectible identity.

// --- Real crypto reference products (Coinbase Exchange public API ids) ---
const MARKET_REFERENCE_PRODUCTS = [
  { id: 'BTC-USD', label: 'Bitcoin', symbol: 'BTC' },
  { id: 'ETH-USD', label: 'Ethereum', symbol: 'ETH' },
  { id: 'SOL-USD', label: 'Solana', symbol: 'SOL' },
  { id: 'ADA-USD', label: 'Cardano', symbol: 'ADA' },
  { id: 'XRP-USD', label: 'XRP', symbol: 'XRP' },
  { id: 'AVAX-USD', label: 'Avalanche', symbol: 'AVAX' },
  { id: 'DOT-USD', label: 'Polkadot', symbol: 'DOT' },
  { id: 'LINK-USD', label: 'Chainlink', symbol: 'LINK' },
  { id: 'LTC-USD', label: 'Litecoin', symbol: 'LTC' },
  { id: 'DOGE-USD', label: 'Dogecoin', symbol: 'DOGE' },
  { id: 'BCH-USD', label: 'Bitcoin Cash', symbol: 'BCH' },
  { id: 'ATOM-USD', label: 'Cosmos', symbol: 'ATOM' },
  { id: 'NEAR-USD', label: 'NEAR', symbol: 'NEAR' },
  { id: 'UNI-USD', label: 'Uniswap', symbol: 'UNI' },
  { id: 'SUI-USD', label: 'Sui', symbol: 'SUI' },
  { id: 'AAVE-USD', label: 'Aave', symbol: 'AAVE' },
  { id: 'XLM-USD', label: 'Stellar', symbol: 'XLM' },
  { id: 'ALGO-USD', label: 'Algorand', symbol: 'ALGO' },
  { id: 'FIL-USD', label: 'Filecoin', symbol: 'FIL' },
  { id: 'APT-USD', label: 'Aptos', symbol: 'APT' },
];

const MARKET_REFERENCE_BY_ID = Object.fromEntries(
  MARKET_REFERENCE_PRODUCTS.map((product) => [product.id, product])
);

// --- The 20 cards: the strongest / most iconic Pokemon, each pinned to one coin ---
export const MARKET_POKEMON = [
  {
    id: 150,
    grade: 'PSA 10',
    headline: 'Blue chip psiquico, el activo de reserva del mercado.',
    demandMultiplier: 1.46,
    specialTier: 'legendary',
    marketProductId: 'BTC-USD',
  },
  {
    id: 384,
    grade: 'CGC Pristine',
    headline: 'Dragon celestial con liquidez global y alta rotacion.',
    demandMultiplier: 1.4,
    specialTier: 'legendary',
    marketProductId: 'ETH-USD',
  },
  {
    id: 493,
    grade: 'Black Label',
    headline: 'El Pokemon dios: oferta minima, prestigio de museo.',
    demandMultiplier: 1.52,
    specialTier: 'mythical',
    marketProductId: 'SOL-USD',
  },
  {
    id: 151,
    grade: 'Gold Star',
    headline: 'Mitico de coleccion con fuerte prima de nostalgia.',
    demandMultiplier: 1.34,
    specialTier: 'mythical',
    marketProductId: 'ADA-USD',
  },
  {
    id: 249,
    grade: 'CGC 9.5',
    headline: 'Guardian de los mares, refugio en ciclos bajistas.',
    demandMultiplier: 1.3,
    specialTier: 'legendary',
    marketProductId: 'XRP-USD',
  },
  {
    id: 250,
    grade: 'PSA 10',
    headline: 'Ave arcoiris, momentum fuerte tras cada renacer.',
    demandMultiplier: 1.32,
    specialTier: 'legendary',
    marketProductId: 'AVAX-USD',
  },
  {
    id: 483,
    grade: 'PSA 10',
    headline: 'Soberano del tiempo con curva alcista sostenida.',
    demandMultiplier: 1.28,
    specialTier: 'legendary',
    marketProductId: 'DOT-USD',
  },
  {
    id: 487,
    grade: 'CGC 9.5',
    headline: 'Dragon fantasma del mundo distorsion, alta volatilidad.',
    demandMultiplier: 1.27,
    specialTier: 'legendary',
    marketProductId: 'LINK-USD',
  },
  {
    id: 6,
    grade: 'PSA 10',
    headline: 'Icono masivo del hobby, volumen alto y spread estrecho.',
    demandMultiplier: 1.3,
    marketProductId: 'LTC-USD',
  },
  {
    id: 25,
    grade: 'PSA 10',
    headline: 'La mascota: el ticker mas popular para nuevos compradores.',
    demandMultiplier: 1.24,
    marketProductId: 'DOGE-USD',
  },
  {
    id: 149,
    grade: 'BGS 9.5',
    headline: 'Pseudo-legendario clasico con demanda constante.',
    demandMultiplier: 1.18,
    marketProductId: 'BCH-USD',
  },
  {
    id: 248,
    grade: 'PSA 9',
    headline: 'Tanque roca-siniestro, base solida en correcciones.',
    demandMultiplier: 1.16,
    marketProductId: 'ATOM-USD',
  },
  {
    id: 445,
    grade: 'PSA 9',
    headline: 'Pseudo-legendario meta con compradores agresivos.',
    demandMultiplier: 1.15,
    marketProductId: 'NEAR-USD',
  },
  {
    id: 448,
    grade: 'PSA 9',
    headline: 'Activo competitivo con momentum de corto plazo.',
    demandMultiplier: 1.12,
    marketProductId: 'UNI-USD',
  },
  {
    id: 658,
    grade: 'CGC 9.5',
    headline: 'Ninja moderno, favorito de la nueva generacion.',
    demandMultiplier: 1.14,
    marketProductId: 'SUI-USD',
  },
  {
    id: 94,
    grade: 'CGC 9.5',
    headline: 'Fantasma de culto con base de coleccionistas fiel.',
    demandMultiplier: 1.12,
    marketProductId: 'AAVE-USD',
  },
  {
    id: 130,
    grade: 'PSA 9',
    headline: 'Serpiente marina, volatilidad media y demanda solida.',
    demandMultiplier: 1.1,
    marketProductId: 'XLM-USD',
  },
  {
    id: 143,
    grade: 'PSA 9',
    headline: 'Tanque dormilon, acumulacion lenta y constante.',
    demandMultiplier: 1.08,
    marketProductId: 'ALGO-USD',
  },
  {
    id: 9,
    grade: 'PSA 10',
    headline: 'Fortaleza de agua, entrada favorita para coleccionistas.',
    demandMultiplier: 1.12,
    marketProductId: 'FIL-USD',
  },
  {
    id: 3,
    grade: 'PSA 10',
    headline: 'Inicial de planta, liquidez retail y rebotes rapidos.',
    demandMultiplier: 1.12,
    marketProductId: 'APT-USD',
  },
];

export const COINBASE_PRODUCTS = MARKET_REFERENCE_PRODUCTS;

// Starter wallet for a freshly registered trainer.
export const INITIAL_CASH_BALANCE = 10000000;

export const INITIAL_HOLDINGS = {
  25: 8,
  6: 2,
  130: 3,
  94: 2,
  143: 4,
  149: 1,
};

const TYPE_COLORS = {
  normal: '#9fa5b0',
  fire: '#ff875f',
  water: '#5fb5ff',
  electric: '#ffd44d',
  grass: '#5fd38c',
  ice: '#7be7ff',
  fighting: '#ff7a7a',
  poison: '#ce7dff',
  ground: '#d1a86f',
  flying: '#7da3ff',
  psychic: '#ff6cab',
  bug: '#95d94f',
  rock: '#bfa372',
  ghost: '#9d82ff',
  dragon: '#5fe1ff',
  dark: '#748097',
  steel: '#8dc0d1',
  fairy: '#ff9ddd',
};

const ICONIC_MULTIPLIERS = {
  150: 1.31,
  384: 1.3,
  493: 1.4,
  151: 1.26,
  249: 1.22,
  250: 1.22,
  483: 1.24,
  487: 1.24,
  6: 1.3,
  25: 1.2,
  149: 1.18,
  248: 1.18,
  445: 1.16,
  448: 1.12,
  658: 1.14,
  94: 1.12,
  130: 1.1,
  143: 1.1,
  9: 1.12,
  3: 1.12,
};

const PSEUDO_LEGENDARY_IDS = new Set([149, 248, 445]);

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const preciseCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const integerFormatter = new Intl.NumberFormat('en-US');

export function formatCurrency(value) {
  return currencyFormatter.format(value);
}

export function formatPreciseCurrency(value) {
  return preciseCurrencyFormatter.format(value);
}

export function formatCompactNumber(value) {
  return compactFormatter.format(value);
}

export function formatInteger(value) {
  return integerFormatter.format(value);
}

export function formatSignedPercent(value) {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function formatPokemonLabel(value) {
  return value
    .split(/[-_]/g)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getStat(pokemon, statName) {
  return pokemon.stats.find((item) => item.stat.name === statName)?.base_stat ?? 0;
}

function getPricePalette(types) {
  const primary = TYPE_COLORS[types[0]] ?? TYPE_COLORS.normal;
  const secondary = TYPE_COLORS[types[1] ?? types[0]] ?? primary;

  return {
    accent: primary,
    accentAlt: secondary,
    glow: `${primary}66`,
    softGlow: `${secondary}55`,
  };
}

function getSentimentLabel(changePct) {
  return changePct >= 1.8 ? 'Alcista' : changePct <= -1.6 ? 'Bajista' : 'Acumulacion';
}

function getReferenceProduct(types, isLegendary, isMythical, pokemonId) {
  if (isLegendary || isMythical) {
    return MARKET_REFERENCE_BY_ID['BTC-USD'];
  }

  if (types.includes('psychic') || types.includes('ghost')) {
    return MARKET_REFERENCE_BY_ID['ETH-USD'];
  }

  if (types.includes('dragon') || types.includes('flying')) {
    return MARKET_REFERENCE_BY_ID['SOL-USD'];
  }

  if (types.includes('water') || types.includes('ice')) {
    return MARKET_REFERENCE_BY_ID['XRP-USD'];
  }

  if (types.includes('grass') || types.includes('bug')) {
    return MARKET_REFERENCE_BY_ID['ADA-USD'];
  }

  if (types.includes('electric')) {
    return MARKET_REFERENCE_BY_ID['DOGE-USD'];
  }

  if (types.includes('fire') || types.includes('fighting')) {
    return MARKET_REFERENCE_BY_ID['AVAX-USD'];
  }

  return MARKET_REFERENCE_PRODUCTS[pokemonId % MARKET_REFERENCE_PRODUCTS.length];
}

function getRarityTone(price, isLegendary, isMythical) {
  if (isLegendary || isMythical || price >= 175000) {
    return 'rainbow';
  }

  if (price >= 85000) {
    return 'gold';
  }

  if (price >= 42000) {
    return 'platinum';
  }

  return 'ember';
}

function buildSeries(id, basePrice, changePct, totalStats) {
  const points = [];

  for (let index = 0; index < 18; index += 1) {
    const progress = index / 17;
    const swingA = Math.sin((index + id) * 0.72) * basePrice * 0.034;
    const swingB = Math.cos((index + totalStats) * 0.31) * basePrice * 0.016;
    const drift = basePrice * (changePct / 100) * (progress - 0.45);
    const pulse = (((index + id) % 4) - 1.5) * basePrice * 0.007;

    points.push(Math.round(Math.max(basePrice * 0.62, basePrice + swingA + swingB + drift + pulse)));
  }

  return points;
}

function formatGenerationLabel(generationName) {
  if (!generationName) {
    return 'Collectors Set';
  }

  return generationName
    .replace('generation-', 'Gen ')
    .replace(/-/g, ' ')
    .toUpperCase();
}

export function buildMarketAsset(pokemon, species, meta) {
  const types = pokemon.types
    .slice()
    .sort((a, b) => a.slot - b.slot)
    .map((entry) => entry.type.name);
  const totalStats = pokemon.stats.reduce((sum, item) => sum + item.base_stat, 0);
  const attack = getStat(pokemon, 'attack');
  const defense = getStat(pokemon, 'defense');
  const speed = getStat(pokemon, 'speed');
  const hp = getStat(pokemon, 'hp');
  const specialAttack = getStat(pokemon, 'special-attack');

  const isLegendary = species?.is_legendary || meta.specialTier === 'legendary';
  const isMythical = species?.is_mythical || meta.specialTier === 'mythical';
  const referenceProduct = meta.marketProductId
    ? MARKET_REFERENCE_BY_ID[meta.marketProductId] ?? getReferenceProduct(types, isLegendary, isMythical, pokemon.id)
    : getReferenceProduct(types, isLegendary, isMythical, pokemon.id);

  let price =
    7000 +
    totalStats * 122 +
    pokemon.base_experience * 96 +
    pokemon.height * 220 +
    pokemon.weight * 16;

  if (types.includes('dragon')) {
    price *= 1.15;
  }

  if (types.includes('psychic')) {
    price *= 1.12;
  }

  if (types.includes('ghost')) {
    price *= 1.08;
  }

  if (PSEUDO_LEGENDARY_IDS.has(pokemon.id)) {
    price *= 1.2;
  }

  if (isLegendary) {
    price *= 2.75;
  }

  if (isMythical) {
    price *= 3.1;
  }

  price *= meta.demandMultiplier ?? 1;
  price *= ICONIC_MULTIPLIERS[pokemon.id] ?? 1;
  price = Math.round(price / 10) * 10;

  const rawChange =
    (attack * 0.026 + speed * 0.038 + specialAttack * 0.024 - defense * 0.012) / 2.4 +
    (((pokemon.id % 9) - 4) * 0.54) +
    (isLegendary ? 0.6 : 0) +
    (isMythical ? 0.8 : 0);
  const changePct = clamp(Number(rawChange.toFixed(2)), -8.6, 11.9);

  const series = buildSeries(pokemon.id, price, changePct, totalStats);
  const low24h = Math.min(...series);
  const high24h = Math.max(...series);
  const listedUnits = Math.max(
    8,
    Math.round(18 + (species?.capture_rate ?? 45) * 0.92 + totalStats * 0.1 - (isLegendary ? 36 : 0))
  );
  const volume = Math.round(price * listedUnits * (0.26 + Math.abs(changePct) / 24));
  const spreadPct = Number((1.2 + Math.abs(changePct) * 0.24 + (isLegendary || isMythical ? 0.7 : 0.2)).toFixed(1));
  const demandScore = Math.round(
    clamp(58 + totalStats / 18 + changePct * 3.1 + (isLegendary ? 8 : 0) + (isMythical ? 10 : 0), 50, 99)
  );
  const floorPrice = Math.round(price * (isLegendary || isMythical ? 0.84 : 0.89));
  const marketCap = price * listedUnits;
  const palette = getPricePalette(types);
  const rarityTone = getRarityTone(price, isLegendary, isMythical);
  const marketBeta = Number(
    clamp(
      (isLegendary || isMythical ? 0.72 : 0.92) +
        (totalStats / 1000) +
        ((meta.demandMultiplier ?? 1) - 1) * 0.42,
      0.72,
      1.34
    ).toFixed(2)
  );

  return {
    id: pokemon.id,
    name: formatPokemonLabel(pokemon.name),
    ticker: `PK-${String(pokemon.id).padStart(3, '0')}`,
    image:
      pokemon.sprites.other?.['official-artwork']?.front_default ||
      pokemon.sprites.other?.dream_world?.front_default ||
      pokemon.sprites.front_default,
    types: types.map(formatPokemonLabel),
    abilities: pokemon.abilities.slice(0, 2).map((entry) => formatPokemonLabel(entry.ability.name)),
    basePrice: price,
    price,
    baseChangePct: changePct,
    changePct,
    baseSeries: series,
    series,
    baseVolume: volume,
    volume,
    listedUnits,
    baseSpreadPct: spreadPct,
    spreadPct,
    baseHigh24h: high24h,
    high24h,
    baseLow24h: low24h,
    low24h,
    baseFloorPrice: floorPrice,
    floorPrice,
    baseMarketCap: marketCap,
    marketCap,
    totalStats,
    attack,
    defense,
    speed,
    hp,
    specialAttack,
    isLegendary,
    isMythical,
    rarityTone,
    rarityLabel: isMythical
      ? 'Mythic Rainbow'
      : isLegendary
        ? 'Legendary Holo'
        : price >= 85000
          ? 'Gold Chase'
          : price >= 42000
            ? 'Chrome Rare'
            : 'Collector Rare',
    sentimentLabel: getSentimentLabel(changePct),
    grade: meta.grade,
    headline: meta.headline,
    demandScore,
    generationLabel: formatGenerationLabel(species?.generation?.name),
    palette,
    referenceProductId: referenceProduct.id,
    referenceProductLabel: referenceProduct.label,
    referenceProductSymbol: referenceProduct.symbol,
    marketBeta,
  };
}

export function applyLiveMarketSnapshot(asset, liveStat, anchorStat) {
  if (!liveStat) {
    return asset;
  }

  const open = Number(liveStat.open) || 0;
  const high = Number(liveStat.high) || open || asset.basePrice;
  const low = Number(liveStat.low) || open || asset.basePrice;
  const last = Number(liveStat.last) || open || asset.basePrice;
  const volumeBase = Number(liveStat.volume) || 0;

  const dayChangePct = open ? ((last - open) / open) * 100 : asset.baseChangePct;
  const anchorLast = Number(anchorStat?.last) || last;
  const anchorVolume = Number(anchorStat?.volume) || volumeBase || 1;
  const anchorPerformance = anchorLast ? last / anchorLast - 1 : dayChangePct / 100;
  const intradayRangePct = open ? Math.abs(high - low) / open : 0.035;

  const priceMultiplier = clamp(
    1 +
      (dayChangePct / 100) * asset.marketBeta * 0.92 +
      anchorPerformance * asset.marketBeta * 3.4,
    0.72,
    1.92
  );
  const price = Math.max(1400, Math.round((asset.basePrice * priceMultiplier) / 10) * 10);
  const changePct = clamp(asset.baseChangePct * 0.28 + dayChangePct * asset.marketBeta, -14.8, 19.8);
  const volumeMultiplier = clamp(
    0.78 + (volumeBase / anchorVolume) * 0.34 + Math.abs(changePct) / 24,
    0.58,
    2.9
  );
  const volume = Math.round(asset.baseVolume * volumeMultiplier);
  const spreadPct = Number(
    clamp(asset.baseSpreadPct + intradayRangePct * 72 + Math.abs(changePct) * 0.11, 0.8, 9.9).toFixed(1)
  );
  const high24h = Math.round(price * (1 + intradayRangePct * (0.74 + asset.marketBeta * 0.18)));
  const low24h = Math.round(
    Math.max(price * 0.56, price * (1 - intradayRangePct * (0.68 + asset.marketBeta * 0.16)))
  );
  const floorPrice = Math.round(price * (asset.isLegendary || asset.isMythical ? 0.84 : 0.88));
  const marketCap = price * asset.listedUnits;
  const demandScore = Math.round(
    clamp(asset.demandScore + changePct * 0.65 + anchorPerformance * 100 * 0.4, 50, 99)
  );
  const rarityTone = getRarityTone(price, asset.isLegendary, asset.isMythical);
  const series = buildSeries(asset.id, price, changePct, asset.totalStats + Math.round(intradayRangePct * 100));

  return {
    ...asset,
    price,
    changePct: Number(changePct.toFixed(2)),
    series,
    volume,
    spreadPct,
    high24h: Math.max(price, high24h),
    low24h: Math.min(price, low24h),
    floorPrice,
    marketCap,
    demandScore,
    rarityTone,
    sentimentLabel: getSentimentLabel(changePct),
    cryptoLast: last,
    cryptoChangePct: Number(dayChangePct.toFixed(2)),
    lastSyncedAt: liveStat.fetchedAt ?? Date.now(),
  };
}

export function buildSeedTransactions(assets) {
  const now = Date.now();

  return assets.slice(0, 5).map((asset, index) => {
    const quantity = [1, 2, 1, 3, 4][index] ?? 1;
    const side = index % 2 === 0 ? 'buy' : 'sell';

    return {
      id: `seed-${asset.id}`,
      assetId: asset.id,
      assetName: asset.name,
      assetTicker: asset.ticker,
      side,
      quantity,
      unitPrice: asset.price,
      total: asset.price * quantity,
      executedAt: now - (index + 2) * 1000 * 60 * 95,
    };
  });
}
