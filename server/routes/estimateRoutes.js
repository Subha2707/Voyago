import express from 'express';
import { getCostEstimate, splitCost, checkBudget } from '../controllers/estimateController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // Requires auth

router.post('/cost', getCostEstimate);
router.post('/split', splitCost);
router.post('/budget-check', checkBudget);

export default router;
