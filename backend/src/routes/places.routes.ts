import { Router, Request, Response, NextFunction } from 'express';
import { placesController } from '../controllers/places.controller';
import { validateNearbyPlacesQuery } from '../middleware/validation.middleware';

const router = Router();

/**
 * @route   GET /api/v1/places/nearby
 * @desc    Get top 5 tourist places near the specified coordinates
 * @access  Public
 * @query   latitude (required, -90 to 90)
 * @query   longitude (required, -180 to 180)
 * @query   radius (optional, default 5000 meters)
 */
router.get('/nearby', validateNearbyPlacesQuery, (req: Request, res: Response, next: NextFunction) => {
  placesController.getNearbyPlaces(req, res, next);
});

/**
 * @route   GET /api/v1/places/geocode
 * @desc    Autocomplete search for locations/cities/landmarks
 * @access  Public
 * @query   text (required, string)
 */
router.get('/geocode', (req: Request, res: Response, next: NextFunction) => {
  placesController.geocode(req, res, next);
});

export default router;
