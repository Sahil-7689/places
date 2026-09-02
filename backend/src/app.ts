import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import placesRoutes from './routes/places.routes';
import { notFoundHandler, errorHandler } from './middleware/error.middleware';

const app: Application = express();

// Security Middleware
app.use(helmet());
app.use(cors());

// Rate Limiting (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use(limiter);

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// API Routes
app.use('/api/v1/places', placesRoutes);
app.use('/api/places', placesRoutes); // Direct alias

// Fallback & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
