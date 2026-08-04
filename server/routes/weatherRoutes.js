import express from 'express';
import { getForecast, getAQI, getAlerts } from '../controllers/weatherController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Weather can be public or require auth; let's require auth to keep API usage controlled
router.use(auth);

router.get('/forecast/:city', getForecast);
router.get('/aqi/:city', getAQI);
router.get('/alerts/:city', getAlerts);

export default router;
