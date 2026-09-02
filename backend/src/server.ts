import app from './app';
import { config } from './config/env';

const PORT = config.port;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`=============================================`);
  console.log(`🚀 Tourist Places Production Backend Running!`);
  console.log(`📡 Listening on: http://${HOST}:${PORT}`);
  console.log(`🌱 Environment:  ${config.nodeEnv}`);
  console.log(`🌐 Health Check: http://${HOST}:${PORT}/health`);
  console.log(`📍 Nearby API:   http://${HOST}:${PORT}/api/v1/places/nearby`);
  console.log(`🔑 Geoapify:     ${config.geoapifyApiKey ? 'Configured ✅' : 'Missing ⚠️'}`);
  console.log(`=============================================`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
