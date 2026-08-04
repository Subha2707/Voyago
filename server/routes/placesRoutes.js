import express from 'express';
import { getPlaces, getBestTime, getSafety } from '../controllers/placesController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // Requires auth

router.get('/:city', getPlaces);
router.get('/best-time/:city', getBestTime);
router.get('/safety/:city', getSafety);

export default router;
