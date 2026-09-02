import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Zod Schema for nearby places query validation
const nearbyPlacesSchema = z.object({
  latitude: z
    .string({ required_error: 'Invalid location parameters' })
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val >= -90 && val <= 90, {
      message: 'Invalid location parameters',
    }),
  longitude: z
    .string({ required_error: 'Invalid location parameters' })
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val >= -180 && val <= 180, {
      message: 'Invalid location parameters',
    }),
  radius: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : 5000))
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'Invalid location parameters',
    }),
});

/**
 * Middleware to validate query parameters for nearby places endpoint
 */
export function validateNearbyPlacesQuery(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const parsed = nearbyPlacesSchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid location parameters',
      });
      return;
    }

    // Attach validated values to request object
    (req as any).validatedQuery = parsed.data;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid location parameters',
    });
  }
}
