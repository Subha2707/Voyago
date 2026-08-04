import express from 'express';
import {
  planTrip,
  exploreDestination,
  surpriseMe,
  getTrips,
  getTripById,
  deleteTripById,
} from '../controllers/tripController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // All trip routes require auth

router.post('/plan', planTrip);
router.post('/explore', exploreDestination);
router.post('/surprise', surpriseMe);
router.get('/', getTrips);
router.get('/:id', getTripById);
router.delete('/:id', deleteTripById);

export default router;
