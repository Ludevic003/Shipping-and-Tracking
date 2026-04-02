import { Router } from 'express';
import healthCheck from './health-check.js';
import contactRouter from './contact.js';
import shipmentRouter from './shipment.js';
import analyticsRouter from './analytics.js';
import adminRouter from './admin.js';
import authRouter from './auth.js';
import emailRouter from './email.js';
import logger from '../utils/logger.js';

const router = Router();

export default () => {
  logger.debug('Registering routes');
  
  router.get('/health', healthCheck);
  logger.debug('Registered: GET /health');
  
  router.use('/contact', contactRouter);
  logger.debug('Registered: /contact routes');
  
  router.use('/shipment', shipmentRouter);
  logger.debug('Registered: /shipment routes');
  
  router.use('/analytics', analyticsRouter);
  logger.debug('Registered: /analytics routes');
  
  router.use('/admin', adminRouter);
  logger.debug('Registered: /admin routes');

  router.use('/auth', authRouter);
  logger.debug('Registered: /auth routes');

  router.use('/email', emailRouter);
  logger.debug('Registered: /email routes');

  return router;
};