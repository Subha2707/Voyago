import express from 'express';
import { compareDestinations } from '../controllers/compareController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // Requires auth

router.post('/', compareDestinations);

export default router;
