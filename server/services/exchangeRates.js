import axios from 'axios';

/**
 * Exchange rate service.
 *
 * Primary provider: exchangerate-api.com (keyed) — set EXCHANGERATE_API_KEY in .env.
 * Fallback provider: open.er-api.com (keyless) — used automatically when the keyed
 * provider is missing or fails.
 *
 * All rates are normalized to an INR base (how many units of each currency per 1 INR)
 * so the frontend can convert INR-stored costs directly.
 */

const EXCHANGE_RATE_API_KEY = process.env.EXCHANGERATE_API_KEY;

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
let cache = null;
let cacheExpiresAt = 0;

// exchangerate-api.com free tier exposes USD as base → derive INR-based rates
const toInrBase = (usdRates) => {
  const inr = usdRates.INR;
  if (!inr || inr <= 0) return null;
  const out = {};
  for (const [code, val] of Object.entries(usdRates)) {
    out[code] = Number.isFinite(val) ? val / inr : null;
  }
  out.INR = 1;
  return out;
};

export const getExchangeRates = async ({ force = false } = {}) => {
  if (!force && cache && Date.now() < cacheExpiresAt) {
    return cache;
  }

  const startedAt = Date.now();
  let rates = null;
  let source = '';

  if (EXCHANGE_RATE_API_KEY) {
    try {
      const res = await axios.get(
        `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/USD`
      );
      if (res.data?.result === 'success' && res.data.conversion_rates) {
        rates = toInrBase(res.data.conversion_rates);
        source = 'exchangerate-api.com';
      }
    } catch (error) {
      console.error('exchangerate-api.com failed:', error.message);
    }
  }

  if (!rates) {
    try {
      const res = await axios.get('https://open.er-api.com/v6/latest/INR');
      if (res.data?.result === 'success' && res.data.rates) {
        rates = { ...res.data.rates, INR: 1 };
        source = 'open.er-api.com';
      }
    } catch (error) {
      console.error('open.er-api.com fallback failed:', error.message);
    }
  }

  if (!rates) {
    throw new Error('Could not fetch exchange rates from any provider.');
  }

  cache = { rates, source, fetchedAt: new Date().toISOString() };
  cacheExpiresAt = startedAt + CACHE_TTL_MS;
  return cache;
};

export default { getExchangeRates };
