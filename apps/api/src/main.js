import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import routes from './routes/index.js';
import { errorMiddleware } from './middleware/index.js';
import logger from './utils/logger.js';

const app = express();

// Global error handlers
process.on('uncaughtException', (error) => {
  logger.error('UNCAUGHT EXCEPTION - Full Stack Trace:', {
    message: error.message,
    stack: error.stack,
    name: error.name,
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('UNHANDLED REJECTION - Full Stack Trace:', {
    reason: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : 'No stack trace',
    promise: String(promise),
  });
  process.exit(1);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received - Shutting down gracefully');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received - Shutting down gracefully');
  await new Promise(resolve => setTimeout(resolve, 3000));
  logger.info('Exiting process');
  process.exit(0);
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware setup
app.use(helmet());
app.use(compression()); // Compress responses
app.use('/api', limiter); // Apply rate limiting to API routes
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(morgan('combined', {
  skip: (req, res) => res.statusCode < 400 // Only log errors in morgan to reduce noise, logger handles the rest
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Manual cookie parser middleware
app.use((req, res, next) => {
  req.cookies = {};
  const cookieHeader = req.headers?.cookie;
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      if (parts.length >= 2) {
        req.cookies[parts[0].trim()] = parts.slice(1).join('=').trim();
      }
    });
  }
  next();
});

// Routes
app.use('/api', routes());
app.use('/', routes()); // Keep root for proxy compatibility

// Deprecated /hcgi guard
app.use(/^\/hcgi/, (req, res) => {
  logger.warn('Deprecated /hcgi route accessed:', req.path);
  return res.status(404).json({error: 'Not Found - /hcgi prefix is deprecated, use /api instead'});
});

// Error middleware
app.use(errorMiddleware);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const port = process.env.PORT || 3001;

app.listen(port, () => {
  logger.info(`🚀 API Server starting on port ${port}`);
  logger.info(`✅ API Server is ready and listening on http://localhost:${port}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle server errors
app.on('error', (error) => {
  logger.error('Server error:', {
    message: error.message,
    stack: error.stack,
    code: error.code,
  });
});

export default app;