import { Request, Response, NextFunction } from 'express';
import { placesService } from '../services/places.service';
import { NearbyPlacesQuery } from '../types/places.types';

export class PlacesController {
  /**
   * Controller handler for GET /api/v1/places/nearby
   */
  public async getNearbyPlaces(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validatedQuery = (req as any).validatedQuery as NearbyPlacesQuery;

      const places = await placesService.getNearbyTouristPlaces(validatedQuery);

      if (!places || places.length === 0) {
        res.status(200).json({
          success: true,
          data: {
            places: [],
          },
          message: 'No tourist places found nearby',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          places,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Controller handler for GET /api/v1/places/geocode
   */
  public async geocode(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const text = req.query.text as string;
      if (!text || text.trim().length === 0) {
        res.status(200).json({ success: true, data: { locations: [] } });
        return;
      }

      const locations = await placesService.geocodeLocation(text);
      res.status(200).json({
        success: true,
        data: {
          locations,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const placesController = new PlacesController();
