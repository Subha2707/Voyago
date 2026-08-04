import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Loader } from 'lucide-react';
import { CURRENCY_OPTIONS, useCurrencyStore } from '../../store/currencyStore';

const formatRate = (code, rate) => {
  if (rate == null || Number.isNaN(rate)) return '—';
  if (code === 'INR') return '1.00';
  if (rate < 1) return rate.toFixed(4);
  if (rate < 100) return rate.toFixed(2);
  return rate.toLocaleString('en-US', { maximumFractionDigits: 0 });
};

const timeAgo = (iso) => {
  if (!iso) return '';
  const mins = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export default function CurrencySelector() {
  const { currency, setCurrency, rates, ratesUpdatedAt, loadingRates } = useCurrencyStore();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const current = CURRENCY_OPTIONS.find((c) => c.code === currency) || CURRENCY_OPTIONS[0];

  return (
    <div className="currency-selector" ref={ref}>
      <button
        className="currency-selector-btn"
        onClick={() => setOpen((o) => !o)}
        title={`Change display currency · 1 INR = ${formatRate(current.code, rates[current.code])} ${current.code}`}
      >
        {loadingRates && <Loader size={13} className="animate-spin" />}
        <span className="currency-code">{current.code}</span>
        <ChevronDown size={14} className={open ? 'rotate-180' : ''} />
      </button>

      {open && (
        <div className="currency-selector-menu">
          <div className="currency-menu-header">
            <span>Display Currency</span>
            <span
              className="currency-live"
              title={ratesUpdatedAt ? `Live rates from exchange-rate-api.com · updated ${timeAgo(ratesUpdatedAt)}` : 'Live rates from exchange-rate-api.com'}
            >
              <span className="currency-live-dot" />
              {ratesUpdatedAt ? `Live · ${timeAgo(ratesUpdatedAt)}` : 'Live rates'}
            </span>
          </div>

          {loadingRates && (
            <div className="currency-menu-loading">
              <Loader size={12} className="animate-spin" /> Fetching live rates…
            </div>
          )}

          <div className="currency-menu-list">
            {CURRENCY_OPTIONS.map((c) => {
              const rate = rates[c.code];
              return (
                <button
                  key={c.code}
                  className={`currency-option ${currency === c.code ? 'active' : ''}`}
                  title={`1 INR = ${formatRate(c.code, rate)} ${c.code}`}
                  onClick={() => {
                    setCurrency(c.code);
                    setOpen(false);
                  }}
                >
                  <span className="currency-option-symbol">{c.symbol}</span>
                  <span className="currency-option-label">
                    {c.code} <em>{c.label}</em>
                  </span>
                  <span className="currency-option-rate">
                    {loadingRates && rate == null ? '…' : formatRate(c.code, rate)}
                  </span>
                  {currency === c.code && <Check size={14} className="currency-option-check" />}
                </button>
              );
            })}
          </div>

          <div className="currency-menu-footer">
            Rates are per 1 INR, sourced from exchange-rate-api.com
          </div>
        </div>
      )}
    </div>
  );
}
