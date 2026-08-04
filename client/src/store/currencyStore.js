import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const FALLBACK_RATES = { INR: 1 };

export const CURRENCY_OPTIONS = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'CHF', label: 'Swiss Franc' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar' },
  { code: 'THB', symbol: '฿', label: 'Thai Baht' },
  { code: 'MYR', symbol: 'RM', label: 'Malaysian Ringgit' },
  { code: 'CNY', symbol: '¥', label: 'Chinese Yuan' },
  { code: 'HKD', symbol: 'HK$', label: 'Hong Kong Dollar' },
  { code: 'KRW', symbol: '₩', label: 'South Korean Won' },
  { code: 'TRY', symbol: '₺', label: 'Turkish Lira' },
  { code: 'ZAR', symbol: 'R', label: 'South African Rand' },
  { code: 'NZD', symbol: 'NZ$', label: 'New Zealand Dollar' },
];

const symbolFor = (code) => {
  const found = CURRENCY_OPTIONS.find((c) => c.code === code);
  return found ? found.symbol : code + ' ';
};

const RATE_STALE_MS = 6 * 60 * 60 * 1000; // re-fetch if rates older than 6h
const REFRESH_MS = 60 * 60 * 1000; // background refresh every 60 min

let refreshTimer = null;

export const useCurrencyStore = create(
  persist(
    (set, get) => ({
      currency: 'INR',
      rates: FALLBACK_RATES,
      ratesUpdatedAt: null,
      loadingRates: false,

      // Fetch live INR-based exchange rates from the backend proxy
      // (/api/rates → exchangerate-api.com with open.er-api.com fallback).
      // Refreshes automatically in the background every hour and re-fetches
      // stale persisted rates on load.
      initRates: async (force = false) => {
        const { rates, loadingRates, ratesUpdatedAt } = get();
        const alreadyLoaded = Object.keys(rates).length > 1;
        const stale =
          ratesUpdatedAt != null && Date.now() - new Date(ratesUpdatedAt).getTime() > RATE_STALE_MS;
        if ((alreadyLoaded && !force && !stale) || loadingRates) return;

        set({ loadingRates: true });
        try {
          const { data } = await api.get('/rates');
          if (data.success && data.rates) {
            set({
              rates: { ...data.rates, INR: 1 },
              ratesUpdatedAt: data.fetchedAt || new Date().toISOString(),
            });
          }
        } catch (err) {
          // Keep INR fallback on failure
        } finally {
          set({ loadingRates: false });
        }

        if (refreshTimer == null) {
          refreshTimer = setInterval(() => get().initRates(true), REFRESH_MS);
        }
      },

      setCurrency: (code) => set({ currency: code }),

      // Convert an INR amount to the active currency
      convert: (inr) => {
        const { currency, rates } = get();
        const rate = rates[currency] || 1;
        return (Number(inr) || 0) * rate;
      },

      symbol: () => symbolFor(get().currency),

      // Full format e.g. ₹1,20,000 or $1,432.50 (JPY/KRW shown as whole numbers)
      format: (inr, { decimals = 2 } = {}) => {
        const { currency } = get();
        const value = get().convert(inr);
        const sym = symbolFor(currency);
        if (currency === 'INR') {
          return `₹${Math.round(value).toLocaleString('en-IN')}`;
        }
        const whole = currency === 'JPY' || currency === 'KRW';
        const dec = whole ? 0 : decimals;
        return `${sym}${value.toLocaleString('en-US', { maximumFractionDigits: dec, minimumFractionDigits: dec })}`;
      },

      // Compact format e.g. ₹1.2L, ₹50K, $600K, $12
      formatCompact: (inr) => {
        const { currency } = get();
        const value = get().convert(inr);
        const sym = symbolFor(currency);
        if (currency === 'INR') {
          if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
          if (value >= 1000) return `₹${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`;
          return `₹${Math.round(value)}`;
        }
        if (value >= 1000000) return `${sym}${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${sym}${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`;
        return `${sym}${Math.round(value)}`;
      },
    }),
    {
      name: 'voyago-currency',
      partialize: (s) => ({ currency: s.currency, rates: s.rates, ratesUpdatedAt: s.ratesUpdatedAt }),
    }
  )
);