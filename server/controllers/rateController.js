import { getExchangeRates } from '../services/exchangeRates.js';

// ── Live exchange rates (INR base) ─────────────────────────────────────────────
export const getRates = async (req, res, next) => {
  try {
    const data = await getExchangeRates();
    res.json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
};
