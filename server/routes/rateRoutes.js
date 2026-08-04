import express from 'express';
import { getRates } from '../controllers/rateController.js';

const router = express.Router();

// Public  no auth required (the navbar loads rates for all visitors)
router.get('/', getRates);

export default router;
