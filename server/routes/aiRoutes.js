import express from 'express';
import {
  generateItinerary,
  generatePackingList,
  chatbot,
  regenerateDay,
} from '../controllers/aiController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // AI features require auth

router.post('/itinerary', generateItinerary);
router.post('/packing-list', generatePackingList);
router.post('/chat', chatbot);
router.post('/regenerate', regenerateDay);

export default router;
