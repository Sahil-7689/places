import { Request, Response, NextFunction } from 'express';

/**
 * 404 Not Found Middleware
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
}

/**
 * Centralized Application Error Handler
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log error on server without leaking to response
  console.error('[Error Middleware]:', err?.message || err);

  const statusCode = err.statusCode || (err.response?.status ? 502 : 500);

  let message = 'Something went wrong';
  if (statusCode === 400) {
    message = err.message || 'Invalid location parameters';
  } else if (statusCode === 502) {
    message = 'Unable to fetch nearby tourist places';
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}
