import { supabase } from '../lib/supabase';
import { INITIAL_CASH_BALANCE, INITIAL_HOLDINGS } from '../data/pokemonMarket';

const PORTFOLIO_TABLE = 'pokemon_portfolios';
const HOLDINGS_TABLE = 'pokemon_holdings';
const TRANSACTIONS_TABLE = 'pokemon_transactions';
const TRANSACTION_HISTORY_LIMIT = 80;

// Shape returned to the app: { cashBalance, holdings, transactions }
// holdings: { [pokemonId]: { quantity, avgCost } }

function mapHoldingRows(rows) {
  const holdings = {};

  for (const row of rows ?? []) {
    if (row.quantity > 0) {
      holdings[row.pokemon_id] = {
        quantity: row.quantity,
        avgCost: Number(row.avg_cost) || 0,
      };
    }
  }

  return holdings;
}

function mapTransactionRows(rows) {
  return (rows ?? []).map((row) => ({
    id: row.id,
    assetId: row.pokemon_id,
    assetName: row.asset_name,
    assetTicker: row.asset_ticker,
    side: row.side,
    quantity: row.quantity,
    unitPrice: Number(row.unit_price) || 0,
    total: Number(row.total) || 0,
    executedAt: new Date(row.executed_at).getTime(),
  }));
}

async function ensurePortfolio(userId) {
  const { data, error } = await supabase
    .from(PORTFOLIO_TABLE)
    .select('user_id, cash_balance')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return Number(data.cash_balance) || 0;
  }

  // First visit: create the wallet and grant a small airdrop of starter cards.
  const { error: insertError } = await supabase
    .from(PORTFOLIO_TABLE)
    .insert({ user_id: userId, cash_balance: INITIAL_CASH_BALANCE });

  if (insertError) {
    throw insertError;
  }

  const seedRows = Object.entries(INITIAL_HOLDINGS).map(([pokemonId, quantity]) => ({
    user_id: userId,
    pokemon_id: Number(pokemonId),
    quantity,
    avg_cost: 0,
  }));

  if (seedRows.length) {
    const { error: seedError } = await supabase.from(HOLDINGS_TABLE).insert(seedRows);
    if (seedError) {
      throw seedError;
    }
  }

  return INITIAL_CASH_BALANCE;
}

export async function fetchExchangeState(userId) {
  const cashBalance = await ensurePortfolio(userId);

  const [{ data: holdingRows, error: holdingsError }, { data: txRows, error: txError }] = await Promise.all([
    supabase.from(HOLDINGS_TABLE).select('pokemon_id, quantity, avg_cost').eq('user_id', userId),
    supabase
      .from(TRANSACTIONS_TABLE)
      .select('id, pokemon_id, asset_name, asset_ticker, side, quantity, unit_price, total, executed_at')
      .eq('user_id', userId)
      .order('executed_at', { ascending: false })
      .limit(TRANSACTION_HISTORY_LIMIT),
  ]);

  if (holdingsError) {
    throw holdingsError;
  }

  if (txError) {
    throw txError;
  }

  return {
    cashBalance,
    holdings: mapHoldingRows(holdingRows),
    transactions: mapTransactionRows(txRows),
  };
}

export async function persistCash(userId, cashBalance) {
  const { error } = await supabase
    .from(PORTFOLIO_TABLE)
    .upsert({ user_id: userId, cash_balance: cashBalance }, { onConflict: 'user_id' });

  if (error) {
    throw error;
  }
}

export async function persistHolding(userId, pokemonId, quantity, avgCost) {
  if (quantity <= 0) {
    const { error } = await supabase
      .from(HOLDINGS_TABLE)
      .delete()
      .eq('user_id', userId)
      .eq('pokemon_id', pokemonId);

    if (error) {
      throw error;
    }
    return;
  }

  const { error } = await supabase.from(HOLDINGS_TABLE).upsert(
    {
      user_id: userId,
      pokemon_id: pokemonId,
      quantity,
      avg_cost: Number(avgCost.toFixed(2)),
    },
    { onConflict: 'user_id,pokemon_id' }
  );

  if (error) {
    throw error;
  }
}

export async function insertTransactions(userId, transactions) {
  const rows = transactions.map((tx) => ({
    user_id: userId,
    pokemon_id: tx.assetId,
    asset_name: tx.assetName,
    asset_ticker: tx.assetTicker,
    side: tx.side,
    quantity: tx.quantity,
    unit_price: Number(tx.unitPrice.toFixed(2)),
    total: Number(tx.total.toFixed(2)),
  }));

  const { data, error } = await supabase
    .from(TRANSACTIONS_TABLE)
    .insert(rows)
    .select('id, pokemon_id, asset_name, asset_ticker, side, quantity, unit_price, total, executed_at');

  if (error) {
    throw error;
  }

  return mapTransactionRows(data);
}
