import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchExchangeState,
  insertTransactions,
  persistCash,
  persistHolding,
} from '../services/TradeService';
import { INITIAL_CASH_BALANCE, INITIAL_HOLDINGS } from '../data/pokemonMarket';

const STORAGE_PREFIX = 'pokexchange::v3::';
const STORAGE_VERSION = 3;
const SWAP_FEE = 0.005; // 0.5% spread on card-to-card swaps.

function storageKey(userId) {
  return `${STORAGE_PREFIX}${userId}`;
}

function defaultState() {
  const holdings = {};
  for (const [id, quantity] of Object.entries(INITIAL_HOLDINGS)) {
    holdings[id] = { quantity, avgCost: 0 };
  }
  return { cashBalance: INITIAL_CASH_BALANCE, holdings, transactions: [] };
}

function readLocal(userId) {
  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) {
      return defaultState();
    }
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== STORAGE_VERSION) {
      return defaultState();
    }
    return {
      cashBalance: Number(parsed.cashBalance) || 0,
      holdings: parsed.holdings && typeof parsed.holdings === 'object' ? parsed.holdings : {},
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
    };
  } catch {
    return defaultState();
  }
}

function writeLocal(userId, state) {
  try {
    window.localStorage.setItem(
      storageKey(userId),
      JSON.stringify({ version: STORAGE_VERSION, ...state })
    );
  } catch {
    /* storage full or unavailable — ignore */
  }
}

export function usePortfolio(authUser) {
  const userId = authUser?.id ?? null;
  const [cashBalance, setCashBalance] = useState(INITIAL_CASH_BALANCE);
  const [holdings, setHoldings] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState('guest'); // guest | cloud | local
  const stateRef = useRef({ cashBalance: INITIAL_CASH_BALANCE, holdings: {}, transactions: [] });

  // Keep a live snapshot so async persistence reads fresh values.
  useEffect(() => {
    stateRef.current = { cashBalance, holdings, transactions };
  }, [cashBalance, holdings, transactions]);

  const applyState = useCallback((next, nextMode) => {
    setCashBalance(next.cashBalance);
    setHoldings(next.holdings);
    setTransactions(next.transactions);
    setMode(nextMode);
    setReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!userId) {
        setReady(false);
        setMode('guest');
        setCashBalance(INITIAL_CASH_BALANCE);
        setHoldings({});
        setTransactions([]);
        return;
      }

      setReady(false);
      try {
        const cloud = await fetchExchangeState(userId);
        if (cancelled) return;
        applyState(cloud, 'cloud');
        writeLocal(userId, cloud);
      } catch {
        if (cancelled) return;
        applyState(readLocal(userId), 'local');
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [userId, applyState]);

  // Persist a mutation: write-through to localStorage, then try the cloud.
  const persist = useCallback(
    async (nextState, cloudWriter) => {
      if (!userId) return;
      writeLocal(userId, nextState);

      if (mode === 'local') {
        return;
      }

      try {
        await cloudWriter();
      } catch {
        setMode('local');
      }
    },
    [userId, mode]
  );

  const buy = useCallback(
    (asset, quantity) => {
      if (!userId || !ready) {
        return { ok: false, message: 'Tu cartera aun se esta sincronizando.' };
      }
      const qty = Math.max(0, Math.floor(quantity));
      if (!qty) {
        return { ok: false, message: 'Ingresa una cantidad valida.' };
      }
      const total = asset.price * qty;
      const current = stateRef.current;
      if (total > current.cashBalance) {
        return { ok: false, message: 'Saldo insuficiente para esta compra.' };
      }

      const prev = current.holdings[asset.id] ?? { quantity: 0, avgCost: 0 };
      const newQty = prev.quantity + qty;
      const newAvgCost = (prev.quantity * prev.avgCost + qty * asset.price) / newQty;
      const newCash = current.cashBalance - total;
      const tx = {
        id: `local-${Date.now()}`,
        assetId: asset.id,
        assetName: asset.name,
        assetTicker: asset.ticker,
        side: 'buy',
        quantity: qty,
        unitPrice: asset.price,
        total,
        executedAt: Date.now(),
      };

      const nextHoldings = { ...current.holdings, [asset.id]: { quantity: newQty, avgCost: newAvgCost } };
      const nextState = {
        cashBalance: newCash,
        holdings: nextHoldings,
        transactions: [tx, ...current.transactions].slice(0, 80),
      };
      applyState(nextState, mode === 'guest' ? 'cloud' : mode);

      persist(nextState, async () => {
        await persistCash(userId, newCash);
        await persistHolding(userId, asset.id, newQty, newAvgCost);
        const [saved] = await insertTransactions(userId, [tx]);
        if (saved) {
          setTransactions((list) => list.map((item) => (item.id === tx.id ? saved : item)));
        }
      });

      return { ok: true, message: `Compraste ${qty} ${asset.name}.` };
    },
    [userId, ready, mode, applyState, persist]
  );

  const sell = useCallback(
    (asset, quantity) => {
      if (!userId || !ready) {
        return { ok: false, message: 'Tu cartera aun se esta sincronizando.' };
      }
      const qty = Math.max(0, Math.floor(quantity));
      if (!qty) {
        return { ok: false, message: 'Ingresa una cantidad valida.' };
      }
      const current = stateRef.current;
      const prev = current.holdings[asset.id] ?? { quantity: 0, avgCost: 0 };
      if (qty > prev.quantity) {
        return { ok: false, message: `Solo tienes ${prev.quantity} en cartera.` };
      }

      const total = asset.price * qty;
      const newQty = prev.quantity - qty;
      const newCash = current.cashBalance + total;
      const tx = {
        id: `local-${Date.now()}`,
        assetId: asset.id,
        assetName: asset.name,
        assetTicker: asset.ticker,
        side: 'sell',
        quantity: qty,
        unitPrice: asset.price,
        total,
        executedAt: Date.now(),
      };

      const nextHoldings = { ...current.holdings };
      if (newQty > 0) {
        nextHoldings[asset.id] = { quantity: newQty, avgCost: prev.avgCost };
      } else {
        delete nextHoldings[asset.id];
      }
      const nextState = {
        cashBalance: newCash,
        holdings: nextHoldings,
        transactions: [tx, ...current.transactions].slice(0, 80),
      };
      applyState(nextState, mode === 'guest' ? 'cloud' : mode);

      persist(nextState, async () => {
        await persistCash(userId, newCash);
        await persistHolding(userId, asset.id, newQty, prev.avgCost);
        const [saved] = await insertTransactions(userId, [tx]);
        if (saved) {
          setTransactions((list) => list.map((item) => (item.id === tx.id ? saved : item)));
        }
      });

      return { ok: true, message: `Vendiste ${qty} ${asset.name}.` };
    },
    [userId, ready, mode, applyState, persist]
  );

  const swap = useCallback(
    (fromAsset, toAsset, quantity) => {
      if (!userId || !ready) {
        return { ok: false, message: 'Tu cartera aun se esta sincronizando.' };
      }
      if (!fromAsset || !toAsset || fromAsset.id === toAsset.id) {
        return { ok: false, message: 'Elige dos cartas distintas para intercambiar.' };
      }
      const qty = Math.max(0, Math.floor(quantity));
      if (!qty) {
        return { ok: false, message: 'Ingresa una cantidad valida.' };
      }
      const current = stateRef.current;
      const fromPrev = current.holdings[fromAsset.id] ?? { quantity: 0, avgCost: 0 };
      if (qty > fromPrev.quantity) {
        return { ok: false, message: `Solo tienes ${fromPrev.quantity} ${fromAsset.name}.` };
      }

      const grossValue = fromAsset.price * qty;
      const netValue = grossValue * (1 - SWAP_FEE);
      const receiveQty = Math.floor(netValue / toAsset.price);
      if (receiveQty < 1) {
        return { ok: false, message: `Valor insuficiente para recibir 1 ${toAsset.name}.` };
      }

      const spent = receiveQty * toAsset.price;
      const residualCash = Math.max(0, netValue - spent);
      const newCash = current.cashBalance + residualCash;

      const fromQtyLeft = fromPrev.quantity - qty;
      const toPrev = current.holdings[toAsset.id] ?? { quantity: 0, avgCost: 0 };
      const toQtyNew = toPrev.quantity + receiveQty;
      const toAvgCost = (toPrev.quantity * toPrev.avgCost + receiveQty * toAsset.price) / toQtyNew;

      const now = Date.now();
      const txOut = {
        id: `local-out-${now}`,
        assetId: fromAsset.id,
        assetName: fromAsset.name,
        assetTicker: fromAsset.ticker,
        side: 'swap_out',
        quantity: qty,
        unitPrice: fromAsset.price,
        total: grossValue,
        executedAt: now,
      };
      const txIn = {
        id: `local-in-${now}`,
        assetId: toAsset.id,
        assetName: toAsset.name,
        assetTicker: toAsset.ticker,
        side: 'swap_in',
        quantity: receiveQty,
        unitPrice: toAsset.price,
        total: spent,
        executedAt: now + 1,
      };

      const nextHoldings = { ...current.holdings };
      if (fromQtyLeft > 0) {
        nextHoldings[fromAsset.id] = { quantity: fromQtyLeft, avgCost: fromPrev.avgCost };
      } else {
        delete nextHoldings[fromAsset.id];
      }
      nextHoldings[toAsset.id] = { quantity: toQtyNew, avgCost: toAvgCost };

      const nextState = {
        cashBalance: newCash,
        holdings: nextHoldings,
        transactions: [txIn, txOut, ...current.transactions].slice(0, 80),
      };
      applyState(nextState, mode === 'guest' ? 'cloud' : mode);

      persist(nextState, async () => {
        if (residualCash > 0) {
          await persistCash(userId, newCash);
        }
        await persistHolding(userId, fromAsset.id, fromQtyLeft, fromPrev.avgCost);
        await persistHolding(userId, toAsset.id, toQtyNew, toAvgCost);
        const saved = await insertTransactions(userId, [txOut, txIn]);
        if (saved.length) {
          setTransactions((list) => {
            const withoutLocal = list.filter((item) => item.id !== txOut.id && item.id !== txIn.id);
            return [...saved.reverse(), ...withoutLocal].slice(0, 80);
          });
        }
      });

      return {
        ok: true,
        message: `Intercambiaste ${qty} ${fromAsset.name} por ${receiveQty} ${toAsset.name}.`,
      };
    },
    [userId, ready, mode, applyState, persist]
  );

  return { cashBalance, holdings, transactions, ready, mode, buy, sell, swap };
}
